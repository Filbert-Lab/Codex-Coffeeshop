import { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../api";

const EMPTY = { name:"", description:"", icon:"☕" };
const ICONS = ["☕","🍵","🥐","🍫","🧋","🥤","✨","🌿","🍰","🧁"];
const card = { background:"#241A14", border:"1px solid #3F2E22", boxShadow:"0 2px 16px rgba(0,0,0,0.35)" };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => getCategories().then(r=>setCategories(r.data||[])).catch(console.error);
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setError(""); setModal({mode:"create"}); };
  const openEdit = (c) => { setForm(c); setError(""); setModal({mode:"edit",id:c.id}); };
  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      if (modal.mode==="create") await createCategory(form);
      else await updateCategory(modal.id, form);
      setModal(null); load();
    } catch(err) { setError(err.message); }
    finally { setSaving(false); }
  };
  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try { await deleteCategory(id); load(); } catch(err) { alert(err.message); }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-codex-text tracking-tight">Categories</h1>
          <p className="text-codex-muted text-sm mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="rounded-2xl p-5 relative overflow-hidden group transition-all duration-500 cursor-default"
            style={card}
            onMouseEnter={e=>{ e.currentTarget.style.border="1px solid rgba(232,155,61,0.2)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,0.5)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.border="1px solid #3F2E22"; e.currentTarget.style.boxShadow="0 2px 16px rgba(0,0,0,0.35)"; }}>
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{background:"rgba(232,155,61,0.08)"}} />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300"
                style={{background:"rgba(232,155,61,0.1)",border:"1px solid rgba(232,155,61,0.15)"}}>
                {cat.icon||"☕"}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={()=>openEdit(cat)} className="text-[11px] px-2 py-1 rounded-lg font-semibold transition-colors" style={{background:"rgba(99,102,241,0.15)",color:"#818CF8"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,0.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(99,102,241,0.15)"}>Edit</button>
                <button onClick={()=>handleDelete(cat.id,cat.name)} className="text-[11px] px-2 py-1 rounded-lg font-semibold transition-colors" style={{background:"rgba(239,68,68,0.15)",color:"#FCA5A5"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,0.15)"}>Delete</button>
              </div>
            </div>
            <h3 className="font-bold text-codex-text relative z-10">{cat.name}</h3>
            <p className="text-codex-muted text-sm mt-1 relative z-10">{cat.description||"No description"}</p>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" style={{background:"rgba(0,0,0,0.7)"}} onClick={()=>setModal(null)}>
          <div className="rounded-2xl w-[400px] animate-slide-up" style={{background:"#241A14",border:"1px solid #3F2E22",boxShadow:"0 24px 64px rgba(0,0,0,0.6)"}} onClick={e=>e.stopPropagation()}>
            <div className="p-6" style={{borderBottom:"1px solid #3F2E22"}}>
              <h2 className="text-xl font-bold text-codex-text">{modal.mode==="create"?"Add Category":"Edit Category"}</h2>
            </div>
            <div className="p-6">
              {error && <p className="text-red-400 text-sm mb-4 px-4 py-2.5 rounded-xl" style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)"}}>{error}</p>}
              <form onSubmit={handleSave} className="space-y-4">
                <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:"#A08770"}}>Name *</label>
                  <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required className="input-field" /></div>
                <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:"#A08770"}}>Description</label>
                  <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="input-field" /></div>
                <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:"#A08770"}}>Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map(ic => (
                      <button type="button" key={ic} onClick={()=>setForm({...form,icon:ic})}
                        className="text-2xl p-2 rounded-xl transition-all duration-200"
                        style={form.icon===ic ? {border:"2px solid #E89B3D",background:"rgba(232,155,61,0.1)"} : {border:"2px solid #3F2E22",background:"transparent"}}
                        onMouseEnter={e=>{ if(form.icon!==ic) e.currentTarget.style.borderColor="#A08770"; }}
                        onMouseLeave={e=>{ if(form.icon!==ic) e.currentTarget.style.borderColor="#3F2E22"; }}
                      >{ic}</button>
                    ))}
                  </div>
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
