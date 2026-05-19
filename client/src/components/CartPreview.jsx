import { useMemo } from "react";

const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

function Cart({ cart, setCart, openPayment }) {
  const inc = (id) => setCart(cart.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)));
  const dec = (id) =>
    setCart(
      cart
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  const remove = (id) => setCart(cart.filter((i) => i.id !== id));

  const total = useMemo(
    () => cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0),
    [cart]
  );
  const itemCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  return (
    <div className="surface-1 h-full rounded-2xl p-4 flex flex-col relative overflow-hidden">
      {/* Decorative orb */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(232,155,61,0.15), transparent 70%)" }}
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 relative z-10" style={{ borderBottom: "1px solid #3F2E22" }}>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(232,155,61,0.18), rgba(168,101,25,0.08))",
              border: "1px solid rgba(232,155,61,0.2)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-codex-accent">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" x2="21" y1="6" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h3 className="font-display text-sm font-bold text-codex-text tracking-tight">Your Order</h3>
        </div>
        {cart.length > 0 && (
          <span
            className="text-[10px] font-bold text-codex-accent px-2.5 py-0.5 rounded-full"
            style={{
              background: "linear-gradient(180deg, rgba(232,155,61,0.15), rgba(232,155,61,0.05))",
              border: "1px solid rgba(232,155,61,0.25)",
            }}
          >
            {itemCount} items
          </span>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 relative z-10">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-codex-muted py-10">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 animate-float"
              style={{
                background: "radial-gradient(circle, rgba(232,155,61,0.06), transparent)",
                border: "1px solid #3F2E22",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-codex-subtle">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" x2="21" y1="6" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <p className="text-sm font-medium text-codex-text-soft">Your cart is empty</p>
            <p className="text-xs mt-1">Add items from the menu</p>
          </div>
        ) : (
          cart.map((item, index) => (
            <CartItem
              key={item.id}
              item={item}
              index={index}
              onInc={() => inc(item.id)}
              onDec={() => dec(item.id)}
              onRemove={() => remove(item.id)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 mt-3 space-y-3 relative z-10" style={{ borderTop: "1px solid #3F2E22" }}>
        <div className="flex justify-between items-center">
          <span className="text-codex-text-soft text-sm font-medium">Total</span>
          <span className="text-xl font-bold text-codex-accent-glow tabular">{fmt(total)}</span>
        </div>
        <button
          onClick={openPayment}
          disabled={cart.length === 0}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-[0.96] relative overflow-hidden ${
            cart.length === 0 ? "cursor-not-allowed" : ""
          }`}
          style={
            cart.length === 0
              ? { background: "#241A14", color: "#6B5847", border: "1px solid #3F2E22" }
              : {
                  background: "linear-gradient(135deg, #F4B96A 0%, #E89B3D 50%, #C8832A 100%)",
                  color: "#1B1410",
                  boxShadow: "0 6px 20px rgba(232,155,61,0.35), 0 1px 0 rgba(255,255,255,0.2) inset",
                }
          }
        >
          {cart.length > 0 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.15), transparent 50%)" }}
            />
          )}
          <span className="relative z-10">
            {cart.length === 0 ? "Add items to order" : `Checkout · ${fmt(total)}`}
          </span>
        </button>
      </div>
    </div>
  );
}

function CartItem({ item, index, onInc, onDec, onRemove }) {
  return (
    <div
      style={{
        animationDelay: `${index * 40}ms`,
        background: "linear-gradient(180deg, #1B1410, #15100C)",
        border: "1px solid #3F2E22",
      }}
      className="rounded-xl p-3 animate-fade-in group transition-all duration-300 hover:border-codex-accent/30"
    >
      <div className="flex justify-between items-start">
        <span className="font-medium text-sm line-clamp-1 flex-1 text-codex-text">{item.name}</span>
        <button
          onClick={onRemove}
          className="text-codex-subtle hover:text-codex-danger ml-2 text-xs transition-all duration-200 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded hover:bg-red-900/20"
          aria-label="Remove"
        >
          ✕
        </button>
      </div>
      <div className="flex justify-between items-center mt-2.5">
        <div
          className="flex items-center gap-0.5 rounded-lg"
          style={{ background: "#241A14", border: "1px solid #3F2E22" }}
        >
          <button
            onClick={onDec}
            className="w-7 h-7 flex items-center justify-center text-codex-muted hover:text-codex-text rounded-l-lg transition-all font-medium text-sm hover:bg-codex-border/50"
            aria-label="Decrease"
          >
            −
          </button>
          <span className="w-7 text-center text-sm font-bold text-codex-text tabular">
            {item.quantity}
          </span>
          <button
            onClick={onInc}
            className="w-7 h-7 flex items-center justify-center text-codex-muted hover:text-codex-accent rounded-r-lg transition-all font-medium text-sm hover:bg-codex-accent/10"
            aria-label="Increase"
          >
            +
          </button>
        </div>
        <span className="text-codex-accent font-bold text-sm tabular">
          {fmt(item.price * item.quantity)}
        </span>
      </div>
    </div>
  );
}

export default Cart;
