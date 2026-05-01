import { useState, useEffect, useCallback } from "react";
import { getUsers, updateUser, deleteUser } from "../../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const LIMIT = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (search) params.search = search;
      const res = await getUsers(params);
      setUsers(res.data || []); setTotal(res.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const toggleRole = async (user) => {
    const newRole = user.role === "admin" ? "customer" : "admin";
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    try { await updateUser(user.id, { role: newRole }); load(); }
    catch (e) { alert(e.message); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    try { await deleteUser(id); load(); }
    catch (e) { alert(e.message); }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-codex-dark">Users</h1>
          <p className="text-codex-muted text-sm">{total} registered users</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5 mb-5">
        <div className="relative max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-codex-muted/40 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Search users..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-codex-muted flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-codex-accent/30 border-t-codex-accent rounded-full animate-spin mb-3" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>{["Avatar","Name","Email","Role","Joined","Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-semibold text-codex-muted/60 text-[11px] uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-codex-muted">No users found</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-codex-accent/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-codex-dark">{u.name}</td>
                  <td className="px-5 py-3.5 text-codex-muted text-xs">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ring-1 ${u.role === "admin" ? "bg-purple-50 text-purple-600 ring-purple-100" : "bg-blue-50 text-blue-600 ring-blue-100"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-codex-muted text-xs">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID") : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <button onClick={() => toggleRole(u)} className="text-[11px] bg-purple-50 text-purple-600 px-2.5 py-1.5 rounded-lg hover:bg-purple-100 font-semibold transition-colors">
                        {u.role === "admin" ? "→ Customer" : "→ Admin"}
                      </button>
                      <button onClick={() => handleDelete(u.id, u.name)} className="text-[11px] bg-red-50 text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-100 font-semibold transition-colors">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-between items-center px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs text-codex-muted">Page {page} of {Math.ceil(total / LIMIT) || 1}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="text-xs px-3.5 py-1.5 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white transition-all font-medium">← Prev</button>
            <button onClick={() => setPage(p => p+1)} disabled={page*LIMIT>=total} className="text-xs px-3.5 py-1.5 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white transition-all font-medium">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
