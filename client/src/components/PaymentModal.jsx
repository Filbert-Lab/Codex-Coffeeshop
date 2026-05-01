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
    <div onClick={close} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex justify-center items-center animate-fade-in">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-[420px] p-7 rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto animate-slide-up">
        <button onClick={close} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition text-xl">✕</button>
        <h2 className="font-display text-2xl font-bold text-codex-dark mb-5 border-b pb-3">Checkout</h2>

        {/* Order Type */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          {["pickup", "delivery"].map((t) => (
            <button key={t} onClick={() => setOrderType(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                orderType === t ? "bg-codex-dark text-white shadow" : "text-codex-muted hover:text-codex-dark"
              }`}>
              {t === "pickup" ? "🏪 Pickup" : "🚗 Delivery (+Rp 15.000)"}
            </button>
          ))}
        </div>

        {/* Customer Name */}
        <input type="text" placeholder="Your name" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
          className="input-field mb-3" />

        {/* Notes */}
        <textarea placeholder="Special notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
          className="input-field mb-4 resize-none" />

        {/* Promos */}
        {promos.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-codex-dark mb-2">Available Promos</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {promos.map((p) => (
                <button key={p.id} onClick={() => setPromoCode(p.code)}
                  className={`text-xs px-3 py-1.5 rounded-lg border-2 font-semibold transition-all ${
                    promoCode === p.code ? "border-codex-accent bg-codex-accent text-white" : "border-gray-200 text-codex-muted hover:border-codex-accent"
                  }`}>
                  {p.code}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter promo code" value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoMsg(null); setDiscount(0); }}
                className="input-field flex-1 text-sm" />
              <button onClick={applyPromo} className="btn-dark text-sm px-4 py-2">Apply</button>
            </div>
            {promoMsg && (
              <p className={`text-xs mt-1.5 font-medium ${promoMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
                {promoMsg.text}
              </p>
            )}
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-codex-dark text-codex-light rounded-xl p-4 mb-5 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          {deliveryFee > 0 && <div className="flex justify-between"><span>Delivery</span><span>{fmt(deliveryFee)}</span></div>}
          {discount > 0 && <div className="flex justify-between text-green-400"><span>Discount ({promoCode})</span><span>−{fmt(discount)}</span></div>}
          <div className="flex justify-between font-bold text-base border-t border-codex-surface pt-2 mt-2">
            <span>Total</span><span className="text-codex-accent">{fmt(finalTotal)}</span>
          </div>
        </div>

        <button onClick={handleCheckout} disabled={loading}
          className="btn-primary w-full py-4 text-base disabled:opacity-50">
          {loading ? "Processing..." : `Place Order · ${fmt(finalTotal)}`}
        </button>
      </div>
    </div>
  );
}

export default PaymentModal;