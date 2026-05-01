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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-full p-1">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
            <div className="w-full h-40 bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-9 bg-gray-200 rounded mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-codex-muted">
        <span className="text-5xl mb-4">☕</span>
        <p className="text-lg font-semibold">No products found</p>
        <p className="text-sm">Try a different search or category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-1 h-full overflow-y-auto content-start">
      {products.map((item) => {
        const inCart = cart.find((x) => x.id === item.id);
        return (
          <div key={item.id} className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in flex flex-col">
            <div className="relative overflow-hidden h-40">
              <img
                src={item.image || "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=400"}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=400"; }}
              />
              {item.category && (
                <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {item.category.icon} {item.category.name}
                </span>
              )}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-codex-dark text-sm mb-1 line-clamp-1">{item.name}</h3>
              <p className="text-xs text-codex-muted mb-3 line-clamp-2 flex-1">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-codex-accent text-sm">{formatPrice(item.price)}</span>
                <button
                  onClick={() => addToCart(item)}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-200 active:scale-95 ${
                    inCart
                      ? "bg-codex-accent text-white"
                      : "bg-codex-dark text-white hover:bg-codex-accent"
                  }`}
                >
                  {inCart ? `✓ ${inCart.quantity}` : "+ Add"}
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