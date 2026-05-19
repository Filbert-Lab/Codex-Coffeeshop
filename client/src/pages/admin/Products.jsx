import { useState, useEffect, useCallback } from "react";
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from "../../api";

const EMPTY = { name:"", category_id:"", description:"", price:"", image:"", stock:99, is_available:true };
const fmt = (n) => new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR", minimumFractionDigits:0 }).format(n);
const card = { background:"#FFFFFF", border:"1px solid #E8DCC4", boxShadow:"0 1px 3px rgba(61,40,23,0.06), 0 8px 20px rgba(61,40,23,0.06)" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const LIMIT = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit:LIMIT };
      if (search) params.search = search;
      const res = await getProducts(params);
      setProducts(res.data||[]); setTotal(res.total||0);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { getCategories().then(r => setCategories(r.data||[])).catch(()=>{}); }, []);

  const openCreate = () => { setForm(EMPTY); setError(""); setModal({mode:"create"}); };
  const openEdit = (p) => { setForm({...p, category_id:p.category_id||"", is_available:p.is_available??true}); setError(""); setModal({mode:"edit",id:p.id}); };
  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      if (modal.mode==="create") await createProduct(form);
      else await updateProduct(modal.id, form);
      setModal(null); load();
    } catch(err) { setError(err.message); }
    finally { setSaving(false); }
  };
  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await deleteProduct(id); load(); } catch(err) { alert(err.message); }
  };

  const Label = ({children}) => <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:"#8C7458"}}>{children}</label>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-codex-text tracking-tight">Products</h1>
          <p className="text-codex-muted text-sm mt-0.5">{total} products total</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </button>
      </div>

      <div className="rounded-2xl p-4 mb-5" style={card}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{color:"#8C7458"}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Search products..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
          </div>
          <span className="text-xs px-3 py-1.5 rounded-lg" style={{background:"#F4ECDF",border:"1px solid #E8DCC4",color:"#8C7458"}}>{products.length} shown</span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={card}>
        {loading ? (
          <div className="p-12 text-center text-codex-muted flex flex-col items-center">
            <div className="w-8 h-8 border-2 rounded-full animate-spin mb-3" style={{borderColor:"rgba(156,107,63,0.3)",borderTopColor:"#9C6B3F"}} />
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{background:"#F4ECDF",borderBottom:"1px solid #E8DCC4"}}>
              <tr>{["Image","Name","Category","Price","Stock","Status","Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-semibold text-[11px] uppercase tracking-wider" style={{color:"#8C7458"}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {products.length===0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-codex-muted"><span className="text-3xl block mb-2 opacity-30">☕</span>No products found</td></tr>
              ) : products.map(p => (
                <tr key={p.id} className="transition-colors duration-200" style={{borderBottom:"1px solid #E8DCC4"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(156,107,63,0.02)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td className="px-5 py-3.5">
                    <img src={p.image||"https://via.placeholder.com/40"} alt={p.name} className="w-10 h-10 rounded-xl object-cover" style={{border:"1px solid #E8DCC4"}} onError={e=>{e.target.src="https://via.placeholder.com/40";}} />
                  </td>
                  <td className="px-5 py-3.5 font-medium max-w-[160px] truncate text-codex-text">{p.name}</td>
                  <td className="px-5 py-3.5 text-[12px] text-codex-muted">{p.category?.name||"—"}</td>
                  <td className="px-5 py-3.5 font-semibold text-codex-accent">{fmt(p.price)}</td>
                  <td className="px-5 py-3.5 text-codex-muted">{p.stock}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={p.is_available ? {background:"rgba(16,185,129,0.15)",color:"#6EE7B7",border:"1px solid rgba(16,185,129,0.2)"} : {background:"rgba(61,46,34,0.5)",color:"#8C7458",border:"1px solid #E8DCC4"}}>
                      {p.is_available?"Available":"Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <button onClick={()=>openEdit(p)} className="text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-colors" style={{background:"rgba(99,102,241,0.15)",color:"#818CF8"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,0.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(99,102,241,0.15)"}>Edit</button>
                      <button onClick={()=>handleDelete(p.id,p.name)} className="text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-colors" style={{background:"rgba(239,68,68,0.15)",color:"#FCA5A5"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,0.15)"}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-between items-center px-5 py-3.5" style={{borderTop:"1px solid #E8DCC4",background:"#F4ECDF"}}>
          <span className="text-xs text-codex-muted">Page {page} of {Math.ceil(total/LIMIT)||1}</span>
          <div className="flex gap-2">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all disabled:opacity-30" style={{background:"#FFFFFF",border:"1px solid #E8DCC4",color:"#5C4530"}} onMouseEnter={e=>e.currentTarget.style.background="#FFFBF3"} onMouseLeave={e=>e.currentTarget.style.background="#FFFFFF"}>← Prev</button>
            <button onClick={()=>setPage(p=>p+1)} disabled={page*LIMIT>=total} className="text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all disabled:opacity-30" style={{background:"#FFFFFF",border:"1px solid #E8DCC4",color:"#5C4530"}} onMouseEnter={e=>e.currentTarget.style.background="#FFFBF3"} onMouseLeave={e=>e.currentTarget.style.background="#FFFFFF"}>Next →</button>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" style={{background:"rgba(42,27,14,0.5)"}} onClick={()=>setModal(null)}>
          <div className="rounded-2xl w-[500px] max-h-[90vh] overflow-y-auto animate-slide-up" style={{background:"#FFFFFF",border:"1px solid #E8DCC4",boxShadow:"0 8px 24px rgba(61,40,23,0.15), 0 24px 64px rgba(61,40,23,0.18)"}} onClick={e=>e.stopPropagation()}>
            <div className="p-6" style={{borderBottom:"1px solid #E8DCC4"}}>
              <h2 className="text-xl font-bold text-codex-text">{modal.mode==="create"?"Add Product":"Edit Product"}</h2>
            </div>
            <div className="p-6">
              {error && <p className="text-red-400 text-sm mb-4 px-4 py-2.5 rounded-xl" style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)"}}>{error}</p>}
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><Label>Name *</Label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required className="input-field" /></div>
                  <div><Label>Category</Label>
                    <select value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})} className="input-field">
                      <option value="">No category</option>
                      {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                    </select></div>
                  <div><Label>Price (Rp) *</Label><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required className="input-field" /></div>
                  <div><Label>Stock</Label><input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="input-field" /></div>
                  <div className="flex items-center gap-2 pt-7">
                    <input type="checkbox" id="avail" checked={form.is_available} onChange={e=>setForm({...form,is_available:e.target.checked})} className="w-4 h-4 accent-codex-accent rounded" />
                    <label htmlFor="avail" className="text-sm font-semibold text-codex-text">Available</label>
                  </div>
                  <div className="col-span-2"><Label>Image URL</Label><input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://..." className="input-field" /></div>
                  <div className="col-span-2"><Label>Description</Label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} className="input-field resize-none" /></div>
                </div>
                <div className="flex gap-3 pt-3">
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
