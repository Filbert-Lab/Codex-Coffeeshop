import { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../api";

const EMPTY = { name: "", description: "", icon: "☕" };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => getCategories().then(r => setCategories(r.data || [])).catch(console.error);
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setError(""); setModal({ mode: "create" }); };
  const openEdit = (c) => { setForm(c); setError(""); setModal({ mode: "edit", id: c.id }); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      if (modal.mode === "create") await createCategory(form);
      else await updateCategory(modal.id, form);
      setModal(null); load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try { await deleteCategory(id); load(); }
    catch (err) { alert(err.message); }
  };

  const ICONS = ["☕", "🍵", "🥐", "🍫", "🧋", "🥤", "✨", "🌿", "🍰", "🧁"];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-codex-dark">Categories</h1>
          <p className="text-codex-muted text-sm">{categories.length} categories</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="glass-card rounded-2xl p-5 hover:shadow-card-hover transition-all duration-500 group relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-codex-accent/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-codex-dark to-codex-warm flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                {cat.icon || "☕"}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(cat)} className="text-[11px] text-blue-500 hover:text-blue-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="text-[11px] text-red-400 hover:text-red-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
              </div>
            </div>
            <h3 className="font-bold text-codex-dark relative z-10">{cat.name}</h3>
            <p className="text-codex-muted text-sm mt-1 relative z-10">{cat.description || "No description"}</p>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-[400px] shadow-2xl animate-slide-up">
            <div className="p-7 border-b border-gray-100">
              <h2 className="font-display text-xl font-bold text-codex-dark">{modal.mode === "create" ? "Add Category" : "Edit Category"}</h2>
            </div>
            <div className="p-7">
              {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2.5 rounded-xl ring-1 ring-red-100">{error}</p>}
              <form onSubmit={handleSave} className="space-y-4">
                <div><label className="block text-xs font-semibold text-codex-muted uppercase tracking-wider mb-1.5">Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="input-field" /></div>
                <div><label className="block text-xs font-semibold text-codex-muted uppercase tracking-wider mb-1.5">Description</label>
                  <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" /></div>
                <div><label className="block text-xs font-semibold text-codex-muted uppercase tracking-wider mb-1.5">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map(ic => <button type="button" key={ic} onClick={() => setForm({...form, icon: ic})}
                      className={`text-2xl p-2 rounded-xl border-2 transition-all duration-200 ${form.icon === ic ? "border-codex-accent bg-codex-accent/10 shadow-sm" : "border-gray-100 hover:border-codex-muted/40"}`}>{ic}</button>)}
                  </div>
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
