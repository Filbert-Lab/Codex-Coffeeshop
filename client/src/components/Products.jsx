import { useState, memo } from "react";
import CategoryIcon from "./CategoryIcon";

const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

function ProductList({ products, cart, setCart, loading, onAdded }) {
  const addToCart = (item) => {
    const exist = cart.find((x) => x.id === item.id);
    if (exist) {
      setCart(
        cart.map((x) =>
          x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x,
        ),
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    onAdded?.(item);
  };

  if (loading) return <ProductSkeleton />;
  if (!products.length) return <EmptyState />;

  return (
    <div className="h-full overflow-y-auto pr-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((item, i) => (
          <ProductCard
            key={item.id}
            item={item}
            index={i}
            inCart={cart.find((x) => x.id === item.id)}
            onAdd={() => addToCart(item)}
          />
        ))}
      </div>
    </div>
  );
}

const ProductCard = memo(function ProductCard({ item, index, inCart, onAdd }) {
  const [imgError, setImgError] = useState(false);
  const hasImage = item.image && item.image.trim() !== "" && !imgError;

  return (
    <div
      style={{ animationDelay: `${index * 50}ms` }}
      className="card group animate-fade-in flex flex-col"
    >
      {/* Image */}
      <div
        className="relative overflow-hidden h-44 shrink-0"
        style={{ background: "#F4ECDF" }}
      >
        {hasImage ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, #FBF4E6, #F4ECDF)",
            }}
          >
            <div className="text-center animate-float">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ color: "rgba(156,107,63,0.4)" }}
                className="mx-auto mb-2"
              >
                <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
                <path d="M6 2v3M10 2v3M14 2v3" />
              </svg>
              <span className="text-codex-muted text-[10px] font-semibold uppercase tracking-wider px-2">
                {item.name}
              </span>
            </div>
          </div>
        )}

        {/* Subtle bottom darken (improves contrast on light photos) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 60%, rgba(42,27,14,0.18) 100%)",
          }}
        />

        {item.category && (
          <span
            className="absolute top-3 left-3 text-[10px] font-semibold pl-1 pr-2.5 py-1 rounded-full z-10 flex items-center gap-1.5"
            style={{
              background: "rgba(255,251,243,0.95)",
              color: "#3D2817",
              border: "1px solid rgba(156,107,63,0.2)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 6px rgba(61,40,23,0.1)",
            }}
          >
            <CategoryIcon
              icon={item.category.icon}
              label={item.category.name}
              size="sm"
            />
            <span>{item.category.name}</span>
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-codex-text text-[15px] mb-1 line-clamp-1 group-hover:text-codex-accent transition-colors duration-300">
          {item.name}
        </h3>
        <p className="text-xs text-codex-muted mb-3 line-clamp-2 flex-1 leading-relaxed">
          {item.description || "Freshly prepared with premium ingredients"}
        </p>
        <div className="flex items-center justify-between mt-auto gap-3">
          <span className="font-bold text-codex-accent text-[15px] tabular">
            {fmt(item.price)}
          </span>
          <AddButton inCart={inCart} onAdd={onAdd} itemName={item.name} />
        </div>
      </div>
    </div>
  );
});

function AddButton({ inCart, onAdd, itemName }) {
  return (
    <button
      onClick={onAdd}
      aria-label={
        inCart ? `${itemName} in cart, ${inCart.quantity}` : `Add ${itemName}`
      }
      className="text-xs font-bold px-4 py-2 rounded-lg transition-all duration-300 active:scale-95 flex items-center gap-1.5 shrink-0"
      style={
        inCart
          ? {
              background:
                "linear-gradient(135deg, #B88B5A 0%, #9C6B3F 50%, #5A3920 100%)",
              color: "#FAF6EF",
              boxShadow:
                "0 4px 14px rgba(156,107,63,0.35), 0 1px 0 rgba(255,255,255,0.18) inset",
            }
          : {
              background: "linear-gradient(180deg, #3D2817, #2A1B0E)",
              color: "#FAF6EF",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.08) inset, 0 2px 6px rgba(61,40,23,0.25)",
            }
      }
    >
      {inCart ? (
        <>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{inCart.quantity}</span>
        </>
      ) : (
        <>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add</span>
        </>
      )}
    </button>
  );
}

function ProductSkeleton() {
  return (
    <div className="h-full overflow-y-auto pr-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden surface-1">
            <div className="w-full h-44 skeleton" />
            <div className="p-4 space-y-3">
              <div className="h-4 rounded w-3/4 skeleton" />
              <div className="h-3 rounded w-1/2 skeleton" />
              <div className="flex justify-between items-center pt-1">
                <div className="h-5 rounded w-20 skeleton" />
                <div className="h-9 rounded-lg w-16 skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-codex-muted">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-4 animate-float"
        style={{
          background:
            "radial-gradient(circle, rgba(156,107,63,0.15), rgba(156,107,63,0.04))",
          border: "1px solid rgba(156,107,63,0.2)",
        }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ color: "rgba(156,107,63,0.6)" }}
        >
          <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
          <path d="M6 2v3M10 2v3M14 2v3" />
        </svg>
      </div>
      <p className="text-lg font-semibold text-codex-text-soft">
        No products found
      </p>
      <p className="text-sm mt-1">Try a different search or category</p>
    </div>
  );
}

export default ProductList;
