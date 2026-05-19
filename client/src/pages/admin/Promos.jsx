import { useState, useEffect, useCallback } from "react";
import { getPromos, createPromo, updatePromo, deletePromo } from "../../api";

const EMPTY = { code: "", description: "", type: "percent", value: "", max_discount: "", min_order: 0, is_active: true };

const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

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
    try {
      const res = await getPromos({ page, limit: LIMIT });
      setPromos(res.data || []); setTotal(res.total || 0);
    } catch (e) { console.error(e); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY); setError(""); setModal({ mode: "create" }); };
  const openEdit = (p) => { setForm({ ...p, max_discount: p.max_discount ?? "", min_order: p.min_order ?? 0 }); setError(""); setModal({ mode: "edit", id: p.id }); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const data = { ...form, max_discount: form.max_discount || null };
      if (modal.mode === "create") await createPromo(data);
      else await updatePromo(modal.id, data);
      setModal(null); load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, code) => {
    if (!confirm(`Delete promo "${code}"?`)) return;
    try { await deletePromo(id); load(); }
    catch (e) { alert(e.message); }
  };

  const toggleActive = async (p) => {
    try { await updatePromo(p.id, { is_active: !p.is_active }); load(); }
    catch (e) { alert(e.message); }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-codex-dark tracking-tight">Promos</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} promo codes</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Promo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {promos.map(p => (
          <div key={p.id} className={`bg-white rounded-2xl p-5 border border-gray-100 transition-all duration-500 group relative overflow-hidden hover:border-codex-accent/20 hover:shadow-lg ${!p.is_active ? "opacity-60" : ""}`}>
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-codex-accent/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div>
                <span className="text-xl font-bold text-codex-dark tracking-wider">{p.code}</span>
                <div className="flex gap-2 mt-1.5">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ring-1 ${p.type === "percent" ? "bg-blue-50 text-blue-600 ring-blue-100" : "bg-emerald-50 text-emerald-600 ring-emerald-100"}`}>
                    {p.type === "percent" ? `${p.value}% off` : fmt(p.value) + " off"}
                  </span>
                  {p.max_discount && <span className="text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">max {fmt(p.max_discount)}</span>}
                </div>
              </div>
              <button onClick={() => toggleActive(p)} className={`text-[10px] font-semibold px-3 py-1.5 rounded-full ring-1 transition-all ${p.is_active ? "bg-emerald-50 text-emerald-600 ring-emerald-100 hover:bg-emerald-100" : "bg-gray-50 text-gray-400 ring-gray-200 hover:bg-gray-100"}`}>
                {p.is_active ? "Active" : "Inactive"}
              </button>
            </div>
            <p className="text-gray-500 text-sm relative z-10">{p.description}</p>
            {Number(p.min_order) > 0 && <p className="text-xs text-gray-400 mt-1 relative z-10">Min. order: {fmt(p.min_order)}</p>}
            <div className="flex gap-2 mt-4 relative z-10">
              <button onClick={() => openEdit(p)} className="text-[11px] bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-semibold transition-colors">Edit</button>
              <button onClick={() => handleDelete(p.id, p.code)} className="text-[11px] bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 font-semibold transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="text-xs px-3.5 py-1.5 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white transition-all font-medium text-gray-600">← Prev</button>
        <button onClick={() => setPage(p => p+1)} disabled={page*LIMIT>=total} className="text-xs px-3.5 py-1.5 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white transition-all font-medium text-gray-600">Next →</button>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl w-[420px] shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-codex-dark">{modal.mode === "create" ? "Add Promo" : "Edit Promo"}</h2>
            </div>
            <div className="p-6">
              {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2.5 rounded-xl ring-1 ring-red-100">{error}</p>}
              <form onSubmit={handleSave} className="space-y-4">
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Code *</label>
                  <input value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} required placeholder="e.g. SAVE20" className="input-field uppercase" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description *</label>
                  <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} required className="input-field" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Type *</label>
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input-field">
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed (Rp)</option>
                    </select></div>
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Value *</label>
                    <input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} required placeholder={form.type==="percent"?"20":"10000"} className="input-field" /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Max Discount</label>
                    <input type="number" value={form.max_discount} onChange={e => setForm({...form, max_discount: e.target.value})} placeholder="Optional" className="input-field" /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Min Order</label>
                    <input type="number" value={form.min_order} onChange={e => setForm({...form, min_order: e.target.value})} className="input-field" /></div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="active" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-4 h-4 accent-codex-accent rounded" />
                  <label htmlFor="active" className="text-sm font-semibold text-codex-dark">Active</label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(null)} className="btn-outline flex-1">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
