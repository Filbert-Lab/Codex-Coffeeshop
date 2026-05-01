function Cart({ cart, setCart, openPayment }) {
  const inc = (id) => setCart(cart.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const dec = (id) => setCart(cart.map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0));
  const remove = (id) => setCart(cart.filter((i) => i.id !== id));

  const total = cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="bg-codex-dark text-codex-light h-full rounded-2xl p-5 flex flex-col shadow-lg">
      <h3 className="font-display text-lg font-bold text-codex-accent border-b border-codex-surface pb-3 mb-4">
        Your Order
      </h3>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-codex-muted py-10">
            <span className="text-4xl mb-3">🛒</span>
            <p className="text-sm">Your cart is empty</p>
            <p className="text-xs mt-1 opacity-60">Add items from the menu</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="bg-codex-surface rounded-xl p-3 animate-slide-up">
              <div className="flex justify-between items-start">
                <span className="font-semibold text-sm line-clamp-1 flex-1">{item.name}</span>
                <button onClick={() => remove(item.id)} className="text-codex-muted hover:text-red-400 ml-2 text-xs transition">✕</button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-1 bg-codex-dark rounded-lg">
                  <button onClick={() => dec(item.id)} className="w-7 h-7 flex items-center justify-center text-codex-muted hover:text-white transition font-bold">−</button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => inc(item.id)} className="w-7 h-7 flex items-center justify-center text-codex-muted hover:text-codex-accent transition font-bold">+</button>
                </div>
                <span className="text-codex-accent font-bold text-sm">{fmt(item.price * item.quantity)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-codex-surface pt-4 mt-3 space-y-3">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-codex-accent">{fmt(total)}</span>
        </div>
        <button
          onClick={openPayment}
          disabled={cart.length === 0}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${
            cart.length === 0
              ? "bg-codex-surface text-codex-muted cursor-not-allowed"
              : "bg-codex-accent text-white hover:brightness-110 shadow-lg shadow-codex-accent/30"
          }`}
        >
          {cart.length === 0 ? "Add items to order" : `Checkout · ${fmt(total)}`}
        </button>
      </div>
    </div>
  );
}

export default Cart;