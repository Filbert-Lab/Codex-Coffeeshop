function Cart({ cart, setCart, openPayment }) {
  const inc = (id) => setCart(cart.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const dec = (id) => setCart(cart.map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0));
  const remove = (id) => setCart(cart.filter((i) => i.id !== id));

  const total = cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const fmt = (n) => new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR", minimumFractionDigits:0 }).format(n);

  return (
    <div className="h-full rounded-2xl p-4 flex flex-col relative overflow-hidden"
      style={{ background:"#251C16", border:"1px solid #3D2E22", boxShadow:"0 2px 16px rgba(0,0,0,0.35)" }}>
      <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl pointer-events-none"
        style={{ background:"rgba(232,160,69,0.06)" }} />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 relative z-10" style={{ borderBottom:"1px solid #3D2E22" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"rgba(232,160,69,0.1)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-codex-accent">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <h3 className="font-display text-sm font-bold text-codex-text tracking-tight">Your Order</h3>
        </div>
        {cart.length > 0 && (
          <span className="text-[10px] font-bold text-codex-accent px-2.5 py-0.5 rounded-full"
            style={{ background:"rgba(232,160,69,0.12)", border:"1px solid rgba(232,160,69,0.2)" }}>
            {cart.reduce((s, i) => s + i.quantity, 0)} items
          </span>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 relative z-10">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-codex-muted py-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 animate-float"
              style={{ background:"rgba(232,160,69,0.05)", border:"1px solid #3D2E22" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-codex-muted/50">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-codex-text-dim">Your cart is empty</p>
            <p className="text-xs mt-1">Add items from the menu</p>
          </div>
        ) : (
          cart.map((item, index) => (
            <div key={item.id}
              style={{ animationDelay:`${index * 40}ms`, background:"#1C1410", border:"1px solid #3D2E22" }}
              className="rounded-xl p-3 animate-fade-in group transition-all duration-300"
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(232,160,69,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#3D2E22"; }}
            >
              <div className="flex justify-between items-start">
                <span className="font-medium text-sm line-clamp-1 flex-1 text-codex-text">{item.name}</span>
                <button onClick={() => remove(item.id)}
                  className="text-codex-muted hover:text-red-400 ml-2 text-xs transition-all duration-200 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded hover:bg-red-900/20">✕</button>
              </div>
              <div className="flex justify-between items-center mt-2.5">
                <div className="flex items-center gap-0.5 rounded-lg" style={{ background:"#251C16", border:"1px solid #3D2E22" }}>
                  <button onClick={() => dec(item.id)} className="w-7 h-7 flex items-center justify-center text-codex-muted hover:text-codex-text rounded-l-lg transition-all font-medium text-sm hover:bg-codex-border/50">−</button>
                  <span className="w-7 text-center text-sm font-bold text-codex-text">{item.quantity}</span>
                  <button onClick={() => inc(item.id)} className="w-7 h-7 flex items-center justify-center text-codex-muted hover:text-codex-accent rounded-r-lg transition-all font-medium text-sm hover:bg-codex-accent/10">+</button>
                </div>
                <span className="text-codex-accent font-bold text-sm">{fmt(item.price * item.quantity)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 mt-3 space-y-3 relative z-10" style={{ borderTop:"1px solid #3D2E22" }}>
        <div className="flex justify-between items-center">
          <span className="text-codex-muted text-sm font-medium">Total</span>
          <span className="text-xl font-bold text-codex-accent">{fmt(total)}</span>
        </div>
        <button
          onClick={openPayment}
          disabled={cart.length === 0}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-[0.96] relative overflow-hidden ${
            cart.length === 0 ? "cursor-not-allowed" : ""
          }`}
          style={cart.length === 0
            ? { background:"#2E2218", color:"#5A4A3A", border:"1px solid #3D2E22" }
            : { background:"linear-gradient(135deg, #E8A045, #C8832A)", color:"#1C1410", boxShadow:"0 6px 24px rgba(232,160,69,0.3)" }
          }
        >
          {cart.length > 0 && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />}
          <span className="relative z-10">{cart.length === 0 ? "Add items to order" : `Checkout · ${fmt(total)}`}</span>
        </button>
      </div>
    </div>
  );
}

export default Cart;
