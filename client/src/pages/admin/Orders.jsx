import { useState, useEffect, useCallback } from "react";
import { getOrders, getOrderById, updateOrderStatus, deleteOrder } from "../../api";

const fmt = (n) => new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR", minimumFractionDigits:0 }).format(n);
const card = { background:"#241A14", border:"1px solid #3F2E22", boxShadow:"0 2px 16px rgba(0,0,0,0.35)" };
const StatusBadge = ({ s }) => {
  const cls = { pending:"badge-pending", processing:"badge-processing", completed:"badge-completed", cancelled:"badge-cancelled" };
  return <span className={cls[s] || "badge-pending"}>{s}</span>;
};

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
      const params = { page, limit:LIMIT };
      if (statusFilter) params.status = statusFilter;
      const res = await getOrders(params);
      setOrders(res.data || []); setTotal(res.total || 0);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const viewDetail = async (id) => { try { const res = await getOrderById(id); setDetail(res.data); } catch(e) { alert(e.message); } };
  const changeStatus = async (id, status) => { try { await updateOrderStatus(id, status); load(); if (detail?.id === id) setDetail(d => ({...d, status})); } catch(e) { alert(e.message); } };
  const handleDelete = async (id) => { if (!confirm("Delete this order?")) return; try { await deleteOrder(id); load(); } catch(e) { alert(e.message); } };

  const counts = orders.reduce((a, o) => { a[o.status] = (a[o.status]||0)+1; return a; }, {});

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-codex-text tracking-tight">Orders</h1>
          <p className="text-codex-muted text-sm mt-0.5">{total} orders total</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background:"#15100C", border:"1px solid #3F2E22" }}>
          {[{val:"",label:"All"},{val:"pending",label:"Pending"},{val:"processing",label:"Process"},{val:"completed",label:"Done"}].map(f => (
            <button key={f.val} onClick={() => { setStatusFilter(f.val); setPage(1); }}
              className="text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-all duration-200"
              style={statusFilter===f.val ? {background:"linear-gradient(135deg,#E89B3D,#A86519)",color:"#1B1410"} : {color:"#A08770"}}
              onMouseEnter={e => { if (statusFilter!==f.val) { e.currentTarget.style.background="rgba(232,155,61,0.08)"; e.currentTarget.style.color="#F5EBDC"; }}}
              onMouseLeave={e => { if (statusFilter!==f.val) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#A08770"; }}}
            >{f.label}</button>
          ))}
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          {label:"Pending",count:counts.pending||0,color:"rgba(245,158,11,0.1)",text:"#F59E0B",border:"rgba(245,158,11,0.2)",icon:"⏳"},
          {label:"Processing",count:counts.processing||0,color:"rgba(99,102,241,0.1)",text:"#6366F1",border:"rgba(99,102,241,0.2)",icon:"⚙️"},
          {label:"Completed",count:counts.completed||0,color:"rgba(16,185,129,0.1)",text:"#10B981",border:"rgba(16,185,129,0.2)",icon:"✓"},
          {label:"Cancelled",count:counts.cancelled||0,color:"rgba(239,68,68,0.1)",text:"#EF4444",border:"rgba(239,68,68,0.2)",icon:"✕"},
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3.5 flex items-center gap-3" style={{ background:s.color, border:`1px solid ${s.border}` }}>
            <span className="text-lg">{s.icon}</span>
            <div>
              <p className="text-xl font-bold leading-tight" style={{color:s.text}}>{s.count}</p>
              <p className="text-[10px] font-medium" style={{color:s.text,opacity:0.7}}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={card}>
        {loading ? (
          <div className="p-12 text-center text-codex-muted flex flex-col items-center">
            <div className="w-8 h-8 border-2 rounded-full animate-spin mb-3" style={{borderColor:"rgba(232,155,61,0.3)",borderTopColor:"#E89B3D"}} />
            <span className="text-sm">Loading orders...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background:"#15100C", borderBottom:"1px solid #3F2E22" }}>
                <tr>{["#","Customer","Total","Type","Status","Date","Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-semibold text-[11px] uppercase tracking-wider" style={{color:"#A08770"}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-codex-muted">
                    <span className="text-3xl block mb-2 opacity-30">📦</span>No orders found
                  </td></tr>
                ) : orders.map(o => (
                  <tr key={o.id} className="transition-colors duration-200" style={{borderBottom:"1px solid #3F2E22"}}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(232,155,61,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <td className="px-5 py-3.5 font-mono text-[11px]" style={{color:"#A08770"}}>#{o.id}</td>
                    <td className="px-5 py-3.5 font-medium text-codex-text">{o.customer_name}</td>
                    <td className="px-5 py-3.5 font-semibold text-codex-accent">{fmt(o.total_amount)}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-full"
                        style={o.order_type==="delivery" ? {background:"rgba(139,92,246,0.15)",color:"#A78BFA",border:"1px solid rgba(139,92,246,0.2)"} : {background:"rgba(232,155,61,0.1)",color:"#E89B3D",border:"1px solid rgba(232,155,61,0.2)"}}>
                        {o.order_type==="delivery" ? "🛵 Delivery" : "🏪 Pickup"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge s={o.status} /></td>
                    <td className="px-5 py-3.5 text-[11px]" style={{color:"#A08770"}}>
                      {o.created_at ? new Date(o.created_at).toLocaleDateString("id-ID",{day:"numeric",month:"short"}) : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5">
                        <button onClick={() => viewDetail(o.id)} className="text-[11px] px-2.5 py-1.5 rounded-lg font-semibold transition-colors" style={{background:"rgba(99,102,241,0.15)",color:"#818CF8"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,0.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(99,102,241,0.15)"}>View</button>
                        {o.status==="pending" && <button onClick={() => changeStatus(o.id,"processing")} className="text-[11px] px-2.5 py-1.5 rounded-lg font-semibold transition-colors" style={{background:"rgba(245,158,11,0.15)",color:"#FCD34D"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(245,158,11,0.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(245,158,11,0.15)"}>Process</button>}
                        {o.status==="processing" && <button onClick={() => changeStatus(o.id,"completed")} className="text-[11px] px-2.5 py-1.5 rounded-lg font-semibold transition-colors" style={{background:"rgba(16,185,129,0.15)",color:"#6EE7B7"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(16,185,129,0.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(16,185,129,0.15)"}>Complete</button>}
                        <button onClick={() => handleDelete(o.id)} className="text-[11px] px-2.5 py-1.5 rounded-lg font-semibold transition-colors" style={{background:"rgba(239,68,68,0.15)",color:"#FCA5A5"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,0.15)"}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-between items-center px-5 py-3.5" style={{borderTop:"1px solid #3F2E22",background:"#15100C"}}>
          <span className="text-xs text-codex-muted">Page {page} of {Math.ceil(total/LIMIT)||1}</span>
          <div className="flex gap-2">
            {[{label:"← Prev",disabled:page===1,onClick:()=>setPage(p=>Math.max(1,p-1))},{label:"Next →",disabled:page*LIMIT>=total,onClick:()=>setPage(p=>p+1)}].map(b => (
              <button key={b.label} onClick={b.onClick} disabled={b.disabled}
                className="text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-30"
                style={{background:"#241A14",border:"1px solid #3F2E22",color:"#D4C5B0"}}
                onMouseEnter={e=>{ if(!b.disabled) e.currentTarget.style.background="#2D2118"; }}
                onMouseLeave={e=>e.currentTarget.style.background="#241A14"}
              >{b.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" style={{background:"rgba(0,0,0,0.7)"}} onClick={() => setDetail(null)}>
          <div className="rounded-2xl w-[500px] max-h-[85vh] overflow-y-auto animate-slide-up" style={{background:"#241A14",border:"1px solid #3F2E22",boxShadow:"0 24px 64px rgba(0,0,0,0.6)"}} onClick={e=>e.stopPropagation()}>
            <div className="p-6 flex justify-between items-start" style={{borderBottom:"1px solid #3F2E22"}}>
              <div>
                <h2 className="text-xl font-bold text-codex-text">Order #{detail.id}</h2>
                <p className="text-codex-muted text-sm mt-0.5">{detail.customer_name}</p>
              </div>
              <button onClick={() => setDetail(null)} className="text-codex-muted hover:text-codex-text text-xl w-8 h-8 flex items-center justify-center rounded-lg transition-colors" style={{background:"#1B1410"}}>✕</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl p-3.5" style={{background:"#1B1410",border:"1px solid #3F2E22"}}><p className="text-[10px] uppercase tracking-wider mb-1 text-codex-muted">Status</p><StatusBadge s={detail.status} /></div>
                <div className="rounded-xl p-3.5" style={{background:"#1B1410",border:"1px solid #3F2E22"}}><p className="text-[10px] uppercase tracking-wider mb-1 text-codex-muted">Type</p><p className="font-semibold text-codex-text capitalize">{detail.order_type==="delivery"?"🛵 Delivery":"🏪 Pickup"}</p></div>
                {detail.promo_code && <div className="rounded-xl p-3.5 col-span-2" style={{background:"#1B1410",border:"1px solid #3F2E22"}}><p className="text-[10px] uppercase tracking-wider mb-1 text-codex-muted">Promo</p><p className="font-semibold text-codex-accent">{detail.promo_code}</p></div>}
              </div>
              <div className="rounded-xl overflow-hidden" style={{border:"1px solid #3F2E22"}}>
                <table className="w-full text-sm">
                  <thead style={{background:"#15100C"}}><tr>
                    <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wider text-codex-muted">Item</th>
                    <th className="text-center px-4 py-2.5 text-[10px] uppercase tracking-wider text-codex-muted">Qty</th>
                    <th className="text-right px-4 py-2.5 text-[10px] uppercase tracking-wider text-codex-muted">Subtotal</th>
                  </tr></thead>
                  <tbody>
                    {(detail.items||[]).map((item,i) => (
                      <tr key={i} style={{borderTop:"1px solid #3F2E22"}}>
                        <td className="px-4 py-2.5 font-medium text-codex-text">{item.product?.name||"Product"}</td>
                        <td className="px-4 py-2.5 text-center text-codex-muted">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-codex-accent">{fmt(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-sm space-y-1.5 rounded-xl p-4" style={{background:"#1B1410",border:"1px solid #3F2E22"}}>
                {Number(detail.discount_amount)>0 && <div className="flex justify-between text-emerald-400"><span>Discount</span><span>−{fmt(detail.discount_amount)}</span></div>}
                {Number(detail.delivery_fee)>0 && <div className="flex justify-between text-codex-muted"><span>Delivery Fee</span><span>{fmt(detail.delivery_fee)}</span></div>}
                <div className="flex justify-between font-bold text-base pt-2.5 mt-2" style={{borderTop:"1px solid #3F2E22"}}><span className="text-codex-text">Total</span><span className="text-codex-accent">{fmt(detail.total_amount)}</span></div>
              </div>
              <div className="flex gap-2">
                {detail.status==="pending" && <button onClick={() => changeStatus(detail.id,"processing")} className="btn-dark flex-1 text-sm">Mark Processing</button>}
                {detail.status==="processing" && <button onClick={() => changeStatus(detail.id,"completed")} className="btn-primary flex-1 text-sm">Mark Completed</button>}
                {["pending","processing"].includes(detail.status) && <button onClick={() => changeStatus(detail.id,"cancelled")} className="flex-1 text-sm py-2.5 rounded-xl font-semibold transition-colors" style={{border:"1px solid rgba(239,68,68,0.3)",color:"#FCA5A5"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.1)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>Cancel</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
