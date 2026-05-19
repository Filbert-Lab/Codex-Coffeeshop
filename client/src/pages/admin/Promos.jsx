import { useState, useEffect, useCallback } from "react";
import { getPromos, createPromo, updatePromo, deletePromo } from "../../api";

const EMPTY = { code:"", description:"", type:"percent", value:"", max_discount:"", min_order:0, is_active:true };
const fmt = (n) => new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR", minimumFractionDigits:0 }).format(n);
const card = { background:"#FFFFFF", border:"1px solid #E8DCC4", boxShadow:"0 1px 3px rgba(61,40,23,0.06), 0 8px 20px rgba(61,40,23,0.06)" };

export default function AdminPromos() {
  const [promos, setPromos] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const LIMIT = 10;

  const load = useCallback(async () => {
    try { const res = await getPromos({page,limit:LIMIT}); setPromos(res.data||[]); setTotal(res.total||0); }
    catch(e) { console.error(e); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY); setError(""); setModal({mode:"create"}); };
  const openEdit = (p) => { setForm({...p,max_discount:p.max_discount??"",min_order:p.min_order??0}); setError(""); setModal({mode:"edit",id:p.id}); };
  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const data = {...form, max_discount:form.max_discount||null};
      if (modal.mode==="create") await createPromo(data);
      else await updatePromo(modal.id, data);
      setModal(null); load();
    } catch(err) { setError(err.message); }
    finally { setSaving(false); }
  };
  const handleDelete = async (id, code) => {
    if (!confirm(`Delete promo "${code}"?`)) return;
    try { await deletePromo(id); load(); } catch(e) { alert(e.message); }
  };
  const toggleActive = async (p) => {
    try { await updatePromo(p.id,{is_active:!p.is_active}); load(); } catch(e) { alert(e.message); }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-codex-text tracking-tight">Promos</h1>
          <p className="text-codex-muted text-sm mt-0.5">{total} promo codes</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Promo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {promos.map(p => (
          <div key={p.id} className={`rounded-2xl p-5 relative overflow-hidden group transition-all duration-500 ${!p.is_active?"opacity-50":""}`}
            style={card}
            onMouseEnter={e=>{ e.currentTarget.style.border="1px solid rgba(156,107,63,0.2)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(42,27,14,0.5)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.border="1px solid #E8DCC4"; e.currentTarget.style.boxShadow="0 2px 16px rgba(0,0,0,0.35)"; }}>
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{background:"rgba(156,107,63,0.06)"}} />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div>
                <span className="text-xl font-bold text-codex-text tracking-wider">{p.code}</span>
                <div className="flex gap-2 mt-1.5">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                    style={p.type==="percent" ? {background:"rgba(99,102,241,0.15)",color:"#818CF8",border:"1px solid rgba(99,102,241,0.2)"} : {background:"rgba(16,185,129,0.15)",color:"#6EE7B7",border:"1px solid rgba(16,185,129,0.2)"}}>
                    {p.type==="percent" ? `${p.value}% off` : fmt(p.value)+" off"}
                  </span>
                  {p.max_discount && <span className="text-[10px] px-2 py-1 rounded-full text-codex-muted" style={{background:"#F4ECDF",border:"1px solid #E8DCC4"}}>max {fmt(p.max_discount)}</span>}
                </div>
              </div>
              <button onClick={()=>toggleActive(p)} className="text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all"
                style={p.is_active ? {background:"rgba(16,185,129,0.15)",color:"#6EE7B7",border:"1px solid rgba(16,185,129,0.2)"} : {background:"#F4ECDF",color:"#8C7458",border:"1px solid #E8DCC4"}}>
                {p.is_active?"Active":"Inactive"}
              </button>
            </div>
            <p className="text-codex-muted text-sm relative z-10">{p.description}</p>
            {Number(p.min_order)>0 && <p className="text-xs text-codex-muted/60 mt-1 relative z-10">Min. order: {fmt(p.min_order)}</p>}
            <div className="flex gap-2 mt-4 relative z-10">
              <button onClick={()=>openEdit(p)} className="text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-colors" style={{background:"rgba(99,102,241,0.15)",color:"#818CF8"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,0.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(99,102,241,0.15)"}>Edit</button>
              <button onClick={()=>handleDelete(p.id,p.code)} className="text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-colors" style={{background:"rgba(239,68,68,0.15)",color:"#FCA5A5"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,0.15)"}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all disabled:opacity-30" style={{background:"#FFFFFF",border:"1px solid #E8DCC4",color:"#5C4530"}} onMouseEnter={e=>e.currentTarget.style.background="#FFFBF3"} onMouseLeave={e=>e.currentTarget.style.background="#FFFFFF"}>← Prev</button>
        <button onClick={()=>setPage(p=>p+1)} disabled={page*LIMIT>=total} className="text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all disabled:opacity-30" style={{background:"#FFFFFF",border:"1px solid #E8DCC4",color:"#5C4530"}} onMouseEnter={e=>e.currentTarget.style.background="#FFFBF3"} onMouseLeave={e=>e.currentTarget.style.background="#FFFFFF"}>Next →</button>
      </div>

      {modal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" style={{background:"rgba(42,27,14,0.5)"}} onClick={()=>setModal(null)}>
          <div className="rounded-2xl w-[420px] animate-slide-up" style={{background:"#FFFFFF",border:"1px solid #E8DCC4",boxShadow:"0 8px 24px rgba(61,40,23,0.15), 0 24px 64px rgba(61,40,23,0.18)"}} onClick={e=>e.stopPropagation()}>
            <div className="p-6" style={{borderBottom:"1px solid #E8DCC4"}}>
              <h2 className="text-xl font-bold text-codex-text">{modal.mode==="create"?"Add Promo":"Edit Promo"}</h2>
            </div>
            <div className="p-6">
              {error && <p className="text-red-400 text-sm mb-4 px-4 py-2.5 rounded-xl" style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)"}}>{error}</p>}
              <form onSubmit={handleSave} className="space-y-4">
                <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:"#8C7458"}}>Code *</label>
                  <input value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})} required placeholder="e.g. SAVE20" className="input-field uppercase" /></div>
                <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:"#8C7458"}}>Description *</label>
                  <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required className="input-field" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:"#8C7458"}}>Type *</label>
                    <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="input-field">
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed (Rp)</option>
                    </select></div>
                  <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:"#8C7458"}}>Value *</label>
                    <input type="number" value={form.value} onChange={e=>setForm({...form,value:e.target.value})} required className="input-field" /></div>
                  <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:"#8C7458"}}>Max Discount</label>
                    <input type="number" value={form.max_discount} onChange={e=>setForm({...form,max_discount:e.target.value})} placeholder="Optional" className="input-field" /></div>
                  <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:"#8C7458"}}>Min Order</label>
                    <input type="number" value={form.min_order} onChange={e=>setForm({...form,min_order:e.target.value})} className="input-field" /></div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="active" checked={form.is_active} onChange={e=>setForm({...form,is_active:e.target.checked})} className="w-4 h-4 accent-codex-accent rounded" />
                  <label htmlFor="active" className="text-sm font-semibold text-codex-text">Active</label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={()=>setModal(null)} className="btn-outline flex-1">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving?"Saving...":"Save"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
