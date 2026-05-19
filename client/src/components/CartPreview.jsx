function Cart({ cart, setCart, openPayment }) {
  const inc = (id) => setCart(cart.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const dec = (id) => setCart(cart.map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0));
  const remove = (id) => setCart(cart.filter((i) => i.id !== id));

  const total = cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="bg-white/90 backdrop-blur-xl h-full rounded-2xl p-4 flex flex-col relative overflow-hidden border border-white/60 shadow-soft">
      {/* Decorative */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-codex-accent/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-codex-accent/15 to-codex-accent/5 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-codex-accent">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h3 className="font-display text-sm font-bold text-codex-dark tracking-tight">Your Order</h3>
        </div>
        {cart.length > 0 && (
          <span className="text-[10px] font-bold text-codex-accent bg-codex-accent/10 px-2.5 py-0.5 rounded-full">
            {cart.reduce((s, i) => s + i.quantity, 0)} items
          </span>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 relative z-10">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-3 animate-float border border-gray-100">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">Your cart is empty</p>
            <p className="text-xs mt-1 text-gray-400">Add items from the menu</p>
          </div>
        ) : (
          cart.map((item, index) => (
            <div
              key={item.id}
              style={{ animationDelay: `${index * 40}ms` }}
              className="bg-gray-50/80 rounded-xl p-3 animate-fade-in border border-gray-100 hover:border-codex-accent/20 hover:bg-codex-accent/[0.02] transition-all duration-300 group"
            >
              <div className="flex justify-between items-start">
                <span className="font-medium text-sm line-clamp-1 flex-1 text-codex-dark">{item.name}</span>
                <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-400 ml-2 text-xs transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-red-50 w-5 h-5 flex items-center justify-center rounded">✕</button>
              </div>
              <div className="flex justify-between items-center mt-2.5">
                <div className="flex items-center gap-0.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <button onClick={() => dec(item.id)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-codex-dark hover:bg-gray-50 rounded-l-lg transition-all font-medium text-sm">−</button>
                  <span className="w-7 text-center text-sm font-bold text-codex-dark">{item.quantity}</span>
                  <button onClick={() => inc(item.id)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-codex-accent hover:bg-codex-accent/5 rounded-r-lg transition-all font-medium text-sm">+</button>
                </div>
                <span className="text-codex-accent font-bold text-sm">{fmt(item.price * item.quantity)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-3 mt-3 space-y-3 relative z-10">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm font-medium">Total</span>
          <span className="text-xl font-bold text-codex-accent">{fmt(total)}</span>
        </div>
        <button
          onClick={openPayment}
          disabled={cart.length === 0}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-[0.96] relative overflow-hidden ${
            cart.length === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-codex-accent to-codex-accent-dark text-white shadow-lg shadow-codex-accent/25 hover:shadow-codex-accent/40"
          }`}
        >
          {cart.length > 0 && <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent pointer-events-none" />}
          <span className="relative z-10">{cart.length === 0 ? "Add items to order" : `Checkout · ${fmt(total)}`}</span>
        </button>
      </div>
    </div>
  );
}

export default Cart;
