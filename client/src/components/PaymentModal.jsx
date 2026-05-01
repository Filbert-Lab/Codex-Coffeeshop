import { useState, useEffect } from "react";
import { getActivePromos, validatePromo } from "../api";
import { useAuth } from "../context/AuthContext";

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

  const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  useEffect(() => {
    getActivePromos().then((r) => setPromos(r.data || [])).catch(() => {});
  }, []);

  const subtotal = cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const deliveryFee = orderType === "delivery" ? 15000 : 0;
  const finalTotal = subtotal + deliveryFee - discount;

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const res = await validatePromo(promoCode, subtotal);
      setDiscount(res.data.discount);
      setPromoMsg({ type: "success", text: `✓ Saved ${fmt(res.data.discount)}!` });
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
        items: cart.map((i) => ({ product_id: i.id, quantity: i.quantity, price: Number(i.price) })),
        user_id: user?.id || null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={close} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex justify-center items-center animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-[440px] p-0 rounded-3xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-slide-up"
      >
        {/* Header */}
        <div className="relative bg-codex-dark px-7 pt-7 pb-5 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-codex-accent/15 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-codex-accent/60 to-transparent" />
          <button onClick={close} className="absolute top-4 right-4 text-codex-muted/40 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06]">
            ✕
          </button>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center shadow-lg shadow-codex-accent/20">
              <span className="text-white text-lg">🧾</span>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-codex-accent">Checkout</h2>
              <p className="text-codex-muted/50 text-xs mt-0.5">{cart.reduce((s, i) => s + i.quantity, 0)} items in order</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-5 overflow-y-auto flex-1 space-y-5">
          {/* Order Type */}
          <div>
            <label className="block text-xs font-semibold text-codex-muted uppercase tracking-wider mb-2">Order Type</label>
            <div className="flex bg-gray-50 rounded-xl p-1 gap-1">
              {["pickup", "delivery"].map((t) => (
                <button key={t} onClick={() => setOrderType(t)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-300 ${
                    orderType === t
                      ? "bg-white text-codex-dark shadow-md"
                      : "text-codex-muted hover:text-codex-dark"
                  }`}>
                  {t === "pickup" ? "🏪 Pickup" : "🚗 Delivery (+Rp 15K)"}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-codex-muted uppercase tracking-wider mb-2">Your Name</label>
            <input type="text" placeholder="Enter your name" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
              className="input-field" />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-codex-muted uppercase tracking-wider mb-2">Notes</label>
            <textarea placeholder="Special instructions (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="input-field resize-none" />
          </div>

          {/* Promos */}
          {promos.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-codex-muted uppercase tracking-wider mb-2">Promo Code</label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {promos.map((p) => (
                  <button key={p.id} onClick={() => setPromoCode(p.code)}
                    className={`text-[11px] px-3 py-1.5 rounded-lg border-2 font-semibold transition-all duration-300 ${
                      promoCode === p.code
                        ? "border-codex-accent bg-codex-accent/10 text-codex-accent"
                        : "border-gray-100 text-codex-muted hover:border-codex-accent/40 hover:text-codex-accent"
                    }`}>
                    {p.code}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Enter code" value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoMsg(null); setDiscount(0); }}
                  className="input-field flex-1 text-sm" />
                <button onClick={applyPromo} className="btn-dark text-sm px-5 py-2 whitespace-nowrap">Apply</button>
              </div>
              {promoMsg && (
                <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${promoMsg.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                  <span>{promoMsg.type === "success" ? "✓" : "✕"}</span>
                  {promoMsg.text}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="px-7 pb-7 pt-3 border-t border-gray-100 space-y-4 bg-gray-50/50">
          <div className="glass-dark rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-codex-light/60">
              <span>Subtotal</span><span>{fmt(subtotal)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-codex-light/60">
                <span>Delivery</span><span>{fmt(deliveryFee)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount ({promoCode})</span><span>−{fmt(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t border-white/[0.06] pt-2.5 mt-2">
              <span className="text-codex-light">Total</span>
              <span className="text-codex-accent font-display text-lg">{fmt(finalTotal)}</span>
            </div>
          </div>

          <button onClick={handleCheckout} disabled={loading}
            className="btn-primary w-full py-4 text-base disabled:opacity-50 active:scale-[0.97]">
            <span className="relative z-10">{loading ? "Processing..." : `Place Order · ${fmt(finalTotal)}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;