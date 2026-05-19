import { useState } from "react";

function ProductList({ products, cart, setCart, loading }) {
  const addToCart = (item) => {
    const exist = cart.find((x) => x.id === item.id);
    if (exist) {
      setCart(cart.map((x) => x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <div className="h-full overflow-y-auto p-1">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-soft">
              <div className="w-full h-44 bg-gradient-to-br from-orange-50 to-gray-50 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded-full w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-50 rounded-full w-1/2 animate-pulse" />
                <div className="flex justify-between items-center pt-1">
                  <div className="h-5 bg-orange-50 rounded-full w-20 animate-pulse" />
                  <div className="h-9 bg-gray-100 rounded-lg w-16 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <div className="w-20 h-20 rounded-full bg-codex-accent/10 flex items-center justify-center mb-4 animate-float">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-codex-accent">
            <path d="M17 8h1a4 4 0 0 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" /><path d="M6 2v3M10 2v3M14 2v3" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-600">No products found</p>
        <p className="text-sm mt-1 text-gray-400">Try a different search or category</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-1">
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((item, index) => {
        const inCart = cart.find((x) => x.id === item.id);
        const hasImage = item.image && item.image.trim() !== "";

        return (
          <ProductCard
            key={item.id}
            item={item}
            index={index}
            inCart={inCart}
            hasImage={hasImage}
            addToCart={addToCart}
            formatPrice={formatPrice}
          />
        );
      })}
    </div>
    </div>
  );
}

function ProductCard({ item, index, inCart, hasImage, addToCart, formatPrice }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      style={{ animationDelay: `${index * 60}ms` }}
      className="card group animate-fade-in flex flex-col"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden h-44 shrink-0 bg-gradient-to-br from-orange-50 to-amber-50">
        {hasImage && !imgError ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center animate-float">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-codex-accent/40 mx-auto mb-2">
                <path d="M17 8h1a4 4 0 0 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" /><path d="M6 2v3M10 2v3M14 2v3" />
              </svg>
              <span className="text-codex-accent/50 text-[10px] font-semibold uppercase tracking-wider">{item.name}</span>
            </div>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {item.category && (
          <span className="absolute top-3 left-3 bg-white/95 text-codex-dark text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm z-10 border border-white/50">
            {item.category.icon} {item.category.name}
          </span>
        )}

        {/* Quick add floating button */}
        <button
          onClick={() => addToCart(item)}
          className="absolute bottom-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-codex-dark shadow-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-codex-accent hover:text-white active:scale-90 z-10 border border-white/50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-codex-dark text-sm mb-1 line-clamp-1 group-hover:text-codex-accent transition-colors duration-300">
          {item.name}
        </h3>
        <p className="text-[11px] text-gray-400 mb-3 line-clamp-2 flex-1 leading-relaxed">
          {item.description || "Freshly prepared with premium ingredients"}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-codex-accent text-[15px]">
            {formatPrice(item.price)}
          </span>
          <button
            onClick={() => addToCart(item)}
            className={`text-xs font-semibold px-3.5 py-2 rounded-lg transition-all duration-300 active:scale-95 ${
              inCart
                ? "bg-gradient-to-r from-codex-accent to-codex-accent-dark text-white shadow-md shadow-codex-accent/20"
                : "bg-codex-dark text-white hover:bg-codex-warm hover:shadow-md"
            }`}
          >
            {inCart ? `✓ ${inCart.quantity}` : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
