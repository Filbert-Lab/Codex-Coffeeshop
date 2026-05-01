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

  // Coffee placeholder gradient for when no image loads
  const PlaceholderImg = ({ name }) => (
    <div className="w-full h-full bg-gradient-to-br from-codex-dark via-codex-warm to-codex-surface flex items-center justify-center">
      <div className="text-center">
        <span className="text-4xl block mb-1">☕</span>
        <span className="text-white/40 text-[10px] font-medium uppercase tracking-wider">{name}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-full p-1 overflow-y-auto content-start">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl overflow-hidden">
            <div className="w-full h-36 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200/80 rounded-full w-3/4 animate-pulse" />
              <div className="h-3 bg-gray-200/60 rounded-full w-1/2 animate-pulse" />
              <div className="flex justify-between items-center pt-1">
                <div className="h-5 bg-gray-200/70 rounded-full w-20 animate-pulse" />
                <div className="h-9 bg-gray-200/70 rounded-lg w-16 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-codex-muted">
        <div className="w-20 h-20 rounded-full bg-codex-accent/10 flex items-center justify-center mb-4 animate-float">
          <span className="text-4xl">☕</span>
        </div>
        <p className="text-lg font-semibold text-codex-dark/70">No products found</p>
        <p className="text-sm mt-1">Try a different search or category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-1 h-full overflow-y-auto content-start">
      {products.map((item, index) => {
        const inCart = cart.find((x) => x.id === item.id);
        const hasImage = item.image && item.image.trim() !== "";

        return (
          <div
            key={item.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="card group animate-fade-in flex flex-col"
          >
            {/* Image Section */}
            <div className="relative overflow-hidden h-36 shrink-0">
              {hasImage ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    // Replace broken img with placeholder div
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              {/* Fallback placeholder (hidden if image loads) */}
              <div
                className="w-full h-full bg-gradient-to-br from-codex-dark via-codex-warm to-codex-surface items-center justify-center absolute inset-0"
                style={{ display: hasImage ? "none" : "flex" }}
              >
                <div className="text-center">
                  <span className="text-3xl block mb-1">☕</span>
                  <span className="text-white/40 text-[10px] font-medium uppercase tracking-wider line-clamp-1 px-2">{item.name}</span>
                </div>
              </div>

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {item.category && (
                <span className="absolute top-2.5 left-2.5 bg-black/40 text-white text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 z-10">
                  {item.category.icon} {item.category.name}
                </span>
              )}

              {/* Quick add floating button on hover */}
              <button
                onClick={() => addToCart(item)}
                className="absolute bottom-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-codex-dark shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-codex-accent hover:text-white active:scale-90 z-10"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {/* Content Section */}
            <div className="p-3.5 flex flex-col flex-1">
              <h3 className="font-semibold text-codex-dark text-sm mb-0.5 line-clamp-1 group-hover:text-codex-accent transition-colors duration-300">
                {item.name}
              </h3>
              <p className="text-[11px] text-codex-muted/70 mb-2.5 line-clamp-2 flex-1 leading-relaxed">
                {item.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-bold text-codex-accent text-sm tracking-tight">
                  {formatPrice(item.price)}
                </span>
                <button
                  onClick={() => addToCart(item)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-300 active:scale-95 ${
                    inCart
                      ? "bg-gradient-to-r from-codex-accent to-codex-accent-dark text-white shadow-md shadow-codex-accent/20"
                      : "bg-codex-dark text-white hover:bg-codex-warm"
                  }`}
                >
                  {inCart ? `✓ ${inCart.quantity}` : "Add"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductList;