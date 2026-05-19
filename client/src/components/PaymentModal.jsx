import { useState, useEffect, useMemo } from "react";
import { getActivePromos, validatePromo } from "../api";
import { useAuth } from "../context/AuthContext";

const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

const Label = ({ children }) => (
  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#A08770" }}>
    {children}
  </label>
);

function PaymentModal({ cart, close, onSuccess }) {
  const { user } = useAuth();
  const [orderType, setOrderType] = useState("pickup");
  const [promos, setPromos] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState(null);
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getActivePromos().then((r) => setPromos(r.data || [])).catch(() => {});
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0),
    [cart]
  );
  const deliveryFee = orderType === "delivery" ? 15000 : 0;
  const finalTotal = subtotal + deliveryFee - discount;

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const res = await validatePromo(promoCode, subtotal);
      setDiscount(res.data.discount);
      setPromoMsg({ type: "success", text: `Saved ${fmt(res.data.discount)}` });
    } catch (err) {
      setDiscount(0);
      setPromoMsg({ type: "error", text: err.message });
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await onSuccess({
        customer_name: customerName || "Walk-in Guest",
        order_type: orderType,
        promo_code: promoCode || null,
        notes,
        items: cart.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
          price: Number(i.price),
        })),
        user_id: user?.id || null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 backdrop-blur-sm z-[1000] flex justify-center items-end sm:items-center p-0 sm:p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.75)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:w-[440px] rounded-t-3xl sm:rounded-2xl relative flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden animate-slide-up"
        style={{
          background: "#241A14",
          border: "1px solid #3F2E22",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header */}
        <div
          className="relative px-6 sm:px-7 pt-6 pb-5 overflow-hidden shrink-0"
          style={{ background: "#15100C", borderBottom: "1px solid #3F2E22" }}
        >
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl" style={{ background: "rgba(232,155,61,0.1)" }} />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-codex-accent/70 to-transparent" />
          <button
            onClick={close}
            className="absolute top-4 right-4 text-codex-muted hover:text-codex-text transition w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: "#241A14" }}
            aria-label="Close"
          >
            ✕
          </button>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center shadow-lg shadow-codex-accent/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-codex-bg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-codex-text">Checkout</h2>
              <p className="text-codex-muted text-xs mt-0.5">
                {cart.reduce((s, i) => s + i.quantity, 0)} items in order
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-7 py-5 overflow-y-auto flex-1 space-y-5">
          {/* Order Type */}
          <div>
            <Label>Order Type</Label>
            <div className="flex rounded-xl p-1 gap-1" style={{ background: "#1B1410", border: "1px solid #3F2E22" }}>
              {[
                { val: "pickup", label: "🏪 Pickup", sub: "Free" },
                { val: "delivery", label: "🛵 Delivery", sub: "+Rp 15K" },
              ].map((t) => (
                <button
                  key={t.val}
                  onClick={() => setOrderType(t.val)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex flex-col items-center gap-0.5"
                  style={
                    orderType === t.val
                      ? { background: "linear-gradient(135deg, #E89B3D, #A86519)", color: "#1B1410" }
                      : { color: "#A08770" }
                  }
                >
                  <span>{t.label}</span>
                  <span className="text-[10px] opacity-70">{t.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <Label>Your Name</Label>
            <input
              type="text"
              placeholder="Enter your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <textarea
              placeholder="Special instructions (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="input-field resize-none"
            />
          </div>

          {/* Promos */}
          {promos.length > 0 && (
            <div>
              <Label>Promo Code</Label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {promos.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPromoCode(p.code)}
                    className="text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-all duration-300"
                    style={
                      promoCode === p.code
                        ? {
                            border: "1px solid #E89B3D",
                            background: "rgba(232,155,61,0.12)",
                            color: "#E89B3D",
                          }
                        : {
                            border: "1px solid #3F2E22",
                            background: "transparent",
                            color: "#A08770",
                          }
                    }
                  >
                    {p.code}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoMsg(null);
                    setDiscount(0);
                  }}
                  className="input-field flex-1 text-sm"
                />
                <button onClick={applyPromo} className="btn-dark text-sm px-5 py-2 whitespace-nowrap">
                  Apply
                </button>
              </div>
              {promoMsg && (
                <p
                  className={`text-xs mt-2 font-medium flex items-center gap-1 ${
                    promoMsg.type === "success" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  <span>{promoMsg.type === "success" ? "✓" : "✕"}</span>
                  {promoMsg.text}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div
          className="px-6 sm:px-7 pb-6 pt-3 space-y-3 shrink-0"
          style={{ background: "#15100C", borderTop: "1px solid #3F2E22" }}
        >
          <div className="rounded-xl p-4 space-y-2 text-sm" style={{ background: "#241A14", border: "1px solid #3F2E22" }}>
            <div className="flex justify-between text-codex-muted">
              <span>Subtotal</span>
              <span className="text-codex-text-soft">{fmt(subtotal)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-codex-muted">
                <span>Delivery</span>
                <span className="text-codex-text-soft">{fmt(deliveryFee)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount ({promoCode})</span>
                <span>−{fmt(discount)}</span>
              </div>
            )}
            <div
              className="flex justify-between font-bold text-base pt-2.5 mt-2"
              style={{ borderTop: "1px solid #3F2E22" }}
            >
              <span className="text-codex-text">Total</span>
              <span className="text-codex-accent text-lg">{fmt(finalTotal)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-primary w-full py-3.5 text-base disabled:opacity-50"
          >
            <span className="relative z-10">
              {loading ? "Processing..." : `Place Order · ${fmt(finalTotal)}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
