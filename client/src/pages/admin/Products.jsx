import { useState, useEffect, useCallback } from "react";
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from "../../api";

const EMPTY = { name: "", category_id: "", description: "", price: "", image: "", stock: 99, is_available: true };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // null | { mode: 'create'|'edit', data }
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const LIMIT = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (search) params.search = search;
      const res = await getProducts(params);
      setProducts(res.data || []);
      setTotal(res.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { getCategories().then((r) => setCategories(r.data || [])).catch(() => {}); }, []);

  const openCreate = () => { setForm(EMPTY); setError(""); setModal({ mode: "create" }); };
  const openEdit = (p) => { setForm({ ...p, category_id: p.category_id || "", is_available: p.is_available ?? true }); setError(""); setModal({ mode: "edit", id: p.id }); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (modal.mode === "create") await createProduct(form);
      else await updateProduct(modal.id, form);
      setModal(null);
      load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await deleteProduct(id); load(); }
    catch (err) { alert(err.message); }
  };

  const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-display font-bold text-codex-dark">Products</h1>
          <p className="text-codex-muted text-sm">{total} products total</p></div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">+ Add Product</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
        <input type="text" placeholder="🔍 Search products..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field max-w-sm" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-codex-muted">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{["Image", "Name", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-semibold text-codex-muted text-xs uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-codex-muted">No products found</td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="px-5 py-3">
                    <img src={p.image || "https://via.placeholder.com/40"} alt={p.name} className="w-10 h-10 rounded-lg object-cover" onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }} />
                  </td>
                  <td className="px-5 py-3 font-medium max-w-[160px] truncate">{p.name}</td>
                  <td className="px-5 py-3 text-codex-muted">{p.category?.name || "—"}</td>
                  <td className="px-5 py-3 text-codex-accent font-semibold">{fmt(p.price)}</td>
                  <td className="px-5 py-3">{p.stock}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${p.is_available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.is_available ? "Available" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition font-semibold">Edit</button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Pagination */}
        <div className="flex justify-between items-center px-5 py-3 border-t bg-gray-50">
          <span className="text-xs text-codex-muted">Page {page} of {Math.ceil(total / LIMIT) || 1}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-xs px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-100 transition">← Prev</button>
            <button onClick={() => setPage(p => p + 1)} disabled={page * LIMIT >= total} className="text-xs px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-100 transition">Next →</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-[500px] max-h-[90vh] overflow-y-auto p-7 shadow-2xl animate-slide-up">
            <h2 className="font-display text-xl font-bold mb-5">{modal.mode === "create" ? "Add Product" : "Edit Product"}</h2>
            {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-semibold mb-1.5">Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="input-field" /></div>
                <div><label className="block text-sm font-semibold mb-1.5">Category</label>
                  <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="input-field">
                    <option value="">No category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select></div>
                <div><label className="block text-sm font-semibold mb-1.5">Price (Rp) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="input-field" /></div>
                <div><label className="block text-sm font-semibold mb-1.5">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="input-field" /></div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="avail" checked={form.is_available} onChange={e => setForm({...form, is_available: e.target.checked})} className="w-4 h-4 accent-codex-accent" />
                  <label htmlFor="avail" className="text-sm font-semibold">Available</label>
                </div>
                <div className="col-span-2"><label className="block text-sm font-semibold mb-1.5">Image URL</label>
                  <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://..." className="input-field" /></div>
                <div className="col-span-2"><label className="block text-sm font-semibold mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="input-field resize-none" /></div>
              </div>
              <div className="flex gap-3 pt-2">
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
