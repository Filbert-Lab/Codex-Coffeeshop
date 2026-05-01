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
    <div className="p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-codex-dark">Products</h1>
          <p className="text-codex-muted text-sm">{total} products total</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </button>
      </div>

      <div className="glass-card rounded-2xl p-5 mb-5">
        <div className="relative max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-codex-muted/40 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Search products..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10" />
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-codex-muted flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-codex-accent/30 border-t-codex-accent rounded-full animate-spin mb-3" />
            <span className="text-sm">Loading products...</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>{["Image", "Name", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-semibold text-codex-muted/60 text-[11px] uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-codex-muted">
                  <span className="text-3xl block mb-2 opacity-30">☕</span>No products found
                </td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-codex-accent/[0.02] transition-colors duration-200">
                  <td className="px-5 py-3.5">
                    <img src={p.image || "https://via.placeholder.com/40"} alt={p.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-100" onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }} />
                  </td>
                  <td className="px-5 py-3.5 font-medium max-w-[160px] truncate text-codex-dark">{p.name}</td>
                  <td className="px-5 py-3.5 text-codex-muted text-xs">{p.category?.name || "—"}</td>
                  <td className="px-5 py-3.5 text-codex-accent font-semibold">{fmt(p.price)}</td>
                  <td className="px-5 py-3.5 text-codex-muted">{p.stock}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ring-1 ${p.is_available ? "bg-emerald-50 text-emerald-600 ring-emerald-100" : "bg-gray-50 text-gray-400 ring-gray-200"}`}>
                      {p.is_available ? "Available" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(p)} className="text-[11px] bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-semibold">Edit</button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="text-[11px] bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors duration-200 font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Pagination */}
        <div className="flex justify-between items-center px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs text-codex-muted">Page {page} of {Math.ceil(total / LIMIT) || 1}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-xs px-3.5 py-1.5 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white hover:shadow-sm transition-all duration-200 font-medium">← Prev</button>
            <button onClick={() => setPage(p => p + 1)} disabled={page * LIMIT >= total} className="text-xs px-3.5 py-1.5 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white hover:shadow-sm transition-all duration-200 font-medium">Next →</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
            <div className="p-7 border-b border-gray-100">
              <h2 className="font-display text-xl font-bold text-codex-dark">{modal.mode === "create" ? "Add Product" : "Edit Product"}</h2>
            </div>
            <div className="p-7">
              {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2.5 rounded-xl flex items-center gap-2 ring-1 ring-red-100"><span>⚠</span>{error}</p>}
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className="block text-xs font-semibold text-codex-muted uppercase tracking-wider mb-1.5">Name *</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="input-field" /></div>
                  <div><label className="block text-xs font-semibold text-codex-muted uppercase tracking-wider mb-1.5">Category</label>
                    <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="input-field">
                      <option value="">No category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select></div>
                  <div><label className="block text-xs font-semibold text-codex-muted uppercase tracking-wider mb-1.5">Price (Rp) *</label>
                    <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="input-field" /></div>
                  <div><label className="block text-xs font-semibold text-codex-muted uppercase tracking-wider mb-1.5">Stock</label>
                    <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="input-field" /></div>
                  <div className="flex items-center gap-2 pt-7">
                    <input type="checkbox" id="avail" checked={form.is_available} onChange={e => setForm({...form, is_available: e.target.checked})} className="w-4 h-4 accent-codex-accent rounded" />
                    <label htmlFor="avail" className="text-sm font-semibold text-codex-dark">Available</label>
                  </div>
                  <div className="col-span-2"><label className="block text-xs font-semibold text-codex-muted uppercase tracking-wider mb-1.5">Image URL</label>
                    <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://..." className="input-field" /></div>
                  <div className="col-span-2"><label className="block text-xs font-semibold text-codex-muted uppercase tracking-wider mb-1.5">Description</label>
                    <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="input-field resize-none" /></div>
                </div>
                <div className="flex gap-3 pt-3">
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
