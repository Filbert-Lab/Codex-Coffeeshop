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

  const statusCounts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-codex-dark tracking-tight">Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} orders total</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
            {[{ val: "", label: "All" }, { val: "pending", label: "Pending" }, { val: "processing", label: "Process" }, { val: "completed", label: "Done" }].map(f => (
              <button
                key={f.val}
                onClick={() => { setStatusFilter(f.val); setPage(1); }}
                className={`text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 ${
                  statusFilter === f.val
                    ? "bg-codex-accent text-white shadow-sm"
                    : "text-gray-500 hover:text-codex-dark hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats mini cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Pending", count: statusCounts.pending || 0, color: "bg-amber-50 border-amber-100 text-amber-700", icon: "⏳" },
          { label: "Processing", count: statusCounts.processing || 0, color: "bg-blue-50 border-blue-100 text-blue-700", icon: "⚙️" },
          { label: "Completed", count: statusCounts.completed || 0, color: "bg-emerald-50 border-emerald-100 text-emerald-700", icon: "✓" },
          { label: "Cancelled", count: statusCounts.cancelled || 0, color: "bg-red-50 border-red-100 text-red-600", icon: "✕" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-3.5 border ${s.color} flex items-center gap-3`}>
            <span className="text-lg">{s.icon}</span>
            <div>
              <p className="text-xl font-bold leading-tight">{s.count}</p>
              <p className="text-[10px] opacity-70 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-codex-accent/30 border-t-codex-accent rounded-full animate-spin mb-3" />
            <span className="text-sm">Loading orders...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{["#", "Customer", "Total", "Type", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">
                    <span className="text-3xl block mb-2 opacity-30">📦</span>No orders found
                  </td></tr>
                ) : orders.map(o => (
                  <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-200">
                    <td className="px-5 py-3.5 font-mono text-gray-400 text-xs">#{o.id}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-codex-dark">{o.customer_name}</p>
                    </td>
                    <td className="px-5 py-3.5 text-codex-accent font-semibold">{fmt(o.total_amount)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                        o.order_type === "delivery" ? "bg-purple-50 text-purple-600 ring-1 ring-purple-100" : "bg-gray-50 text-gray-600 ring-1 ring-gray-200"
                      }`}>
                        {o.order_type === "delivery" ? "🛵 Delivery" : "🏪 Pickup"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge s={o.status} /></td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {o.created_at ? new Date(o.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5">
                        <button onClick={() => viewDetail(o.id)} className="text-[11px] bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 font-semibold transition-colors">View</button>
                        {o.status === "pending" && <button onClick={() => changeStatus(o.id, "processing")} className="text-[11px] bg-amber-50 text-amber-700 px-2.5 py-1.5 rounded-lg hover:bg-amber-100 font-semibold transition-colors">Process</button>}
                        {o.status === "processing" && <button onClick={() => changeStatus(o.id, "completed")} className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 font-semibold transition-colors">Complete</button>}
                        <button onClick={() => handleDelete(o.id)} className="text-[11px] bg-red-50 text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-100 font-semibold transition-colors">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-between items-center px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs text-gray-400">Page {page} of {Math.ceil(total / LIMIT) || 1}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="text-xs px-3.5 py-1.5 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white hover:shadow-sm transition-all duration-200 font-medium text-gray-600">← Prev</button>
            <button onClick={() => setPage(p => p+1)} disabled={page*LIMIT>=total} className="text-xs px-3.5 py-1.5 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white hover:shadow-sm transition-all duration-200 font-medium text-gray-600">Next →</button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl w-[500px] max-h-[85vh] overflow-y-auto shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-codex-dark">Order #{detail.id}</h2>
                <p className="text-gray-500 text-sm mt-0.5">{detail.customer_name}</p>
              </div>
              <button onClick={() => setDetail(null)} className="text-gray-300 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100"><p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Status</p><StatusBadge s={detail.status} /></div>
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100"><p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Type</p><p className="font-semibold capitalize">{detail.order_type === "delivery" ? "🛵 Delivery" : "🏪 Pickup"}</p></div>
                {detail.promo_code && <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 col-span-2"><p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Promo Code</p><p className="font-semibold text-codex-accent">{detail.promo_code}</p></div>}
              </div>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>
                    <th className="text-left px-4 py-2.5 text-[10px] text-gray-400 uppercase tracking-wider">Item</th>
                    <th className="text-center px-4 py-2.5 text-[10px] text-gray-400 uppercase tracking-wider">Qty</th>
                    <th className="text-right px-4 py-2.5 text-[10px] text-gray-400 uppercase tracking-wider">Subtotal</th>
                  </tr></thead>
                  <tbody>
                    {(detail.items || []).map((item, i) => (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="px-4 py-2.5 font-medium">{item.product?.name || "Product"}</td>
                        <td className="px-4 py-2.5 text-center text-gray-500">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-codex-accent">{fmt(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-sm space-y-1.5 bg-gray-50 rounded-xl p-4 border border-gray-100">
                {Number(detail.discount_amount) > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>−{fmt(detail.discount_amount)}</span></div>}
                {Number(detail.delivery_fee) > 0 && <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span>{fmt(detail.delivery_fee)}</span></div>}
                <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2.5 mt-2"><span>Total</span><span className="text-codex-accent">{fmt(detail.total_amount)}</span></div>
              </div>
              <div className="flex gap-2">
                {detail.status === "pending" && <button onClick={() => changeStatus(detail.id, "processing")} className="btn-dark flex-1 text-sm">Mark Processing</button>}
                {detail.status === "processing" && <button onClick={() => changeStatus(detail.id, "completed")} className="btn-primary flex-1 text-sm">Mark Completed</button>}
                {["pending", "processing"].includes(detail.status) && <button onClick={() => changeStatus(detail.id, "cancelled")} className="flex-1 text-sm border-2 border-red-200 text-red-500 py-2.5 rounded-xl hover:bg-red-50 font-semibold transition-colors">Cancel</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
