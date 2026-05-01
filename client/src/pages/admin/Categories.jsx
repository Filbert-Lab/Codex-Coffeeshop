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
    if (!confirm(`Delete category "${name}"? Products in this category will be uncategorized.`)) return;
    try { await deleteCategory(id); load(); }
    catch (err) { alert(err.message); }
  };

  const ICONS = ["☕", "🍵", "🥐", "🍫", "🧋", "🥤", "✨", "🌿", "🍰", "🧁"];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-display font-bold text-codex-dark">Categories</h1>
          <p className="text-codex-muted text-sm">{categories.length} categories</p></div>
        <button onClick={openCreate} className="btn-primary">+ Add Category</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <span className="text-3xl">{cat.icon || "☕"}</span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(cat)} className="text-xs text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
            <h3 className="font-bold text-codex-dark">{cat.name}</h3>
            <p className="text-codex-muted text-sm mt-1">{cat.description || "No description"}</p>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-[400px] p-7 shadow-2xl animate-slide-up">
            <h2 className="font-display text-xl font-bold mb-5">{modal.mode === "create" ? "Add Category" : "Edit Category"}</h2>
            {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-sm font-semibold mb-1.5">Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="input-field" /></div>
              <div><label className="block text-sm font-semibold mb-1.5">Description</label>
                <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-semibold mb-1.5">Icon</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {ICONS.map(ic => <button type="button" key={ic} onClick={() => setForm({...form, icon: ic})}
                    className={`text-2xl p-1.5 rounded-lg border-2 transition ${form.icon === ic ? "border-codex-accent bg-codex-accent/10" : "border-gray-200 hover:border-codex-muted"}`}>{ic}</button>)}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setModal(null)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
