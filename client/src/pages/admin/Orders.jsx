import { useState, useEffect, useCallback } from "react";
import { getOrders, getOrderById, updateOrderStatus, deleteOrder } from "../../api";

const StatusBadge = ({ s }) => {
  const cls = { pending: "badge-pending", processing: "badge-processing", completed: "badge-completed", cancelled: "badge-cancelled" };
  return <span className={cls[s] || "badge-pending"}>{s}</span>;
};

const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const LIMIT = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (statusFilter) params.status = statusFilter;
      const res = await getOrders(params);
      setOrders(res.data || []); setTotal(res.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const viewDetail = async (id) => {
    try { const res = await getOrderById(id); setDetail(res.data); }
    catch (e) { alert(e.message); }
  };

  const changeStatus = async (id, status) => {
    try { await updateOrderStatus(id, status); load(); if (detail?.id === id) setDetail(d => ({ ...d, status })); }
    catch (e) { alert(e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return;
    try { await deleteOrder(id); load(); }
    catch (e) { alert(e.message); }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-codex-dark">Orders</h1>
          <p className="text-codex-muted text-sm">{total} orders total</p>
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="">All Status</option>
          {["pending","processing","completed","cancelled"].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center text-codex-muted">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{["#","Customer","Total","Type","Status","Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-semibold text-codex-muted text-xs uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-codex-muted">No orders found</td></tr>
                ) : orders.map(o => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-mono text-codex-muted text-xs">#{o.id}</td>
                    <td className="px-5 py-3 font-medium">{o.customer_name}</td>
                    <td className="px-5 py-3 text-codex-accent font-semibold">{fmt(o.total_amount)}</td>
                    <td className="px-5 py-3 capitalize">{o.order_type}</td>
                    <td className="px-5 py-3"><StatusBadge s={o.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => viewDetail(o.id)} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 font-semibold">View</button>
                        {o.status === "pending" && <button onClick={() => changeStatus(o.id, "processing")} className="text-xs bg-yellow-50 text-yellow-700 px-2.5 py-1.5 rounded-lg hover:bg-yellow-100 font-semibold">Process</button>}
                        {o.status === "processing" && <button onClick={() => changeStatus(o.id, "completed")} className="text-xs bg-green-50 text-green-700 px-2.5 py-1.5 rounded-lg hover:bg-green-100 font-semibold">Complete</button>}
                        <button onClick={() => handleDelete(o.id)} className="text-xs bg-red-50 text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-100 font-semibold">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-between items-center px-5 py-3 border-t bg-gray-50">
          <span className="text-xs text-codex-muted">Page {page} of {Math.ceil(total / LIMIT) || 1}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="text-xs px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-100">← Prev</button>
            <button onClick={() => setPage(p => p+1)} disabled={page*LIMIT>=total} className="text-xs px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-100">Next →</button>
          </div>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-[480px] max-h-[85vh] overflow-y-auto p-7 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="font-display text-xl font-bold">Order #{detail.id}</h2>
                <p className="text-codex-muted text-sm">{detail.customer_name}</p>
              </div>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-5">
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-codex-muted text-xs">Status</p><StatusBadge s={detail.status} /></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-codex-muted text-xs">Type</p><p className="font-semibold capitalize">{detail.order_type}</p></div>
              {detail.promo_code && <div className="bg-gray-50 rounded-lg p-3"><p className="text-codex-muted text-xs">Promo</p><p className="font-semibold">{detail.promo_code}</p></div>}
            </div>
            <table className="w-full text-sm border rounded-xl overflow-hidden mb-5">
              <thead className="bg-gray-50"><tr>
                <th className="text-left px-4 py-2.5 text-xs text-codex-muted">Item</th>
                <th className="text-center px-4 py-2.5 text-xs text-codex-muted">Qty</th>
                <th className="text-right px-4 py-2.5 text-xs text-codex-muted">Subtotal</th>
              </tr></thead>
              <tbody>
                {(detail.items || []).map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{item.product?.name || "Product"}</td>
                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                    <td className="px-4 py-2 text-right font-semibold text-codex-accent">{fmt(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-sm space-y-1 mb-4">
              {Number(detail.discount_amount)>0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−{fmt(detail.discount_amount)}</span></div>}
              {Number(detail.delivery_fee)>0 && <div className="flex justify-between"><span>Delivery</span><span>{fmt(detail.delivery_fee)}</span></div>}
              <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span className="text-codex-accent">{fmt(detail.total_amount)}</span></div>
            </div>
            <div className="flex gap-2">
              {detail.status==="pending" && <button onClick={() => changeStatus(detail.id,"processing")} className="btn-dark flex-1 text-sm">Mark Processing</button>}
              {detail.status==="processing" && <button onClick={() => changeStatus(detail.id,"completed")} className="btn-primary flex-1 text-sm">Mark Completed</button>}
              {["pending","processing"].includes(detail.status) && <button onClick={() => changeStatus(detail.id,"cancelled")} className="flex-1 text-sm border-2 border-red-400 text-red-500 py-2 rounded-xl hover:bg-red-50 font-semibold">Cancel</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
