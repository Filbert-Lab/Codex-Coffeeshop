import { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api";
import CategoryIcon, {
  FALLBACK_ICON,
  ICONS as CATEGORY_ICONS,
  normalizeIcon,
} from "../../components/CategoryIcon";

const EMPTY = { name: "", description: "", icon: "" };
const ICONS = Object.keys(CATEGORY_ICONS);
const card = {
  background: "#FFFFFF",
  border: "1px solid #E8DCC4",
  boxShadow: "0 1px 3px rgba(61,40,23,0.06), 0 8px 20px rgba(61,40,23,0.06)",
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () =>
    getCategories()
      .then((r) => setCategories(r.data || []))
      .catch(console.error);
  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setError("");
    setModal({ mode: "create" });
  };
  const openEdit = (c) => {
    setForm(c);
    setError("");
    setModal({ mode: "edit", id: c.id });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.icon) {
      setError("Please select an icon");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (modal.mode === "create") await createCategory(form);
      else await updateCategory(modal.id, form);
      setModal(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteCategory(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-codex-text tracking-tight">
            Categories
          </h1>
          <p className="text-codex-muted text-sm mt-0.5">
            {categories.length} categories
          </p>
        </div>
        <button
          onClick={openCreate}
          className="btn-primary flex items-center gap-2"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl p-5 relative overflow-hidden group transition-all duration-500 cursor-default"
            style={card}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = "1px solid rgba(156,107,63,0.25)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(61,40,23,0.1), 0 16px 32px rgba(61,40,23,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = "1px solid #E8DCC4";
              e.currentTarget.style.boxShadow =
                "0 1px 3px rgba(61,40,23,0.06), 0 8px 20px rgba(61,40,23,0.06)";
            }}
          >
            <div
              className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "rgba(156,107,63,0.1)" }}
            />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <CategoryIcon
                icon={cat.icon}
                label={cat.name}
                size="lg"
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => openEdit(cat)}
                  className="text-[11px] px-2 py-1 rounded-lg font-semibold transition-colors"
                  style={{
                    background: "rgba(99,102,241,0.12)",
                    color: "#5A6FB8",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="text-[11px] px-2 py-1 rounded-lg font-semibold transition-colors"
                  style={{
                    background: "rgba(184,84,80,0.12)",
                    color: "#B85450",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            <h3 className="font-bold text-codex-text relative z-10">
              {cat.name}
            </h3>
            <p className="text-codex-muted text-sm mt-1 relative z-10">
              {cat.description || "No description"}
            </p>
          </div>
        ))}
      </div>

      {modal && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
          style={{ background: "rgba(42,27,14,0.5)" }}
          onClick={() => setModal(null)}
        >
          <div
            className="rounded-2xl w-[400px] animate-slide-up"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8DCC4",
              boxShadow:
                "0 8px 24px rgba(61,40,23,0.15), 0 24px 64px rgba(61,40,23,0.18)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6" style={{ borderBottom: "1px solid #E8DCC4" }}>
              <h2 className="text-xl font-bold text-codex-text">
                {modal.mode === "create" ? "Add Category" : "Edit Category"}
              </h2>
            </div>
            <div className="p-6">
              {error && (
                <p
                  className="text-sm mb-4 px-4 py-2.5 rounded-xl"
                  style={{
                    background: "rgba(184,84,80,0.08)",
                    border: "1px solid rgba(184,84,80,0.25)",
                    color: "#B85450",
                  }}
                >
                  {error}
                </p>
              )}
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: "#8C7458" }}
                  >
                    Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: "#8C7458" }}
                  >
                    Description
                  </label>
                  <input
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: "#8C7458" }}
                  >
                    Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map((ic) => (
                      <button
                        type="button"
                        key={ic}
                        onClick={() => setForm({ ...form, icon: ic })}
                        className="text-2xl p-2 rounded-xl transition-all duration-200"
                        style={
                          form.icon && normalizeIcon(form.icon) === ic
                            ? {
                                border: "2px solid #9C6B3F",
                                background: "rgba(156,107,63,0.1)",
                                boxShadow: "0 8px 18px rgba(92,61,36,0.14)",
                              }
                            : {
                                border: "2px solid #E8DCC4",
                                background: "transparent",
                              }
                        }
                      >
                        <CategoryIcon
                          icon={ic}
                          label={ic}
                          size="sm"
                          active={form.icon && normalizeIcon(form.icon) === ic}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !form.icon}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
