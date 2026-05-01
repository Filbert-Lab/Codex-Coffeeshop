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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
        <input type="text" placeholder="🔍 Search users..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }} className="input-field max-w-sm" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center text-codex-muted">Loading...</div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{["Avatar","Name","Email","Role","Joined","Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-semibold text-codex-muted text-xs uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-codex-muted">No users found</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="px-5 py-3">
                    <div className="w-9 h-9 rounded-full bg-codex-accent flex items-center justify-center text-white font-bold text-sm">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-codex-muted">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-codex-muted text-xs">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID") : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggleRole(u)} className="text-xs bg-purple-50 text-purple-600 px-2.5 py-1.5 rounded-lg hover:bg-purple-100 font-semibold">
                        {u.role === "admin" ? "→ Customer" : "→ Admin"}
                      </button>
                      <button onClick={() => handleDelete(u.id, u.name)} className="text-xs bg-red-50 text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-100 font-semibold">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-between items-center px-5 py-3 border-t bg-gray-50">
          <span className="text-xs text-codex-muted">Page {page} of {Math.ceil(total / LIMIT) || 1}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="text-xs px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-100">← Prev</button>
            <button onClick={() => setPage(p => p+1)} disabled={page*LIMIT>=total} className="text-xs px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-100">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
