import { useState, useEffect, useCallback } from "react";
import { getUsers, updateUser, deleteUser } from "../../api";

const card = { background:"#241A14", border:"1px solid #3F2E22", boxShadow:"0 2px 16px rgba(0,0,0,0.35)" };

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
      const params = { page, limit:LIMIT };
      if (search) params.search = search;
      const res = await getUsers(params);
      setUsers(res.data||[]); setTotal(res.total||0);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const toggleRole = async (user) => {
    const newRole = user.role==="admin"?"customer":"admin";
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    try { await updateUser(user.id,{role:newRole}); load(); } catch(e) { alert(e.message); }
  };
  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    try { await deleteUser(id); load(); } catch(e) { alert(e.message); }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-codex-text tracking-tight">Users</h1>
          <p className="text-codex-muted text-sm mt-0.5">{total} registered users</p>
        </div>
      </div>

      <div className="rounded-2xl p-4 mb-5" style={card}>
        <div className="relative max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{color:"#A08770"}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Search users..." value={search}
            onChange={e=>{ setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={card}>
        {loading ? (
          <div className="p-12 text-center text-codex-muted flex flex-col items-center">
            <div className="w-8 h-8 border-2 rounded-full animate-spin mb-3" style={{borderColor:"rgba(232,155,61,0.3)",borderTopColor:"#E89B3D"}} />
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{background:"#15100C",borderBottom:"1px solid #3F2E22"}}>
              <tr>{["Avatar","Name","Email","Role","Joined","Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-semibold text-[11px] uppercase tracking-wider" style={{color:"#A08770"}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {users.length===0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-codex-muted">No users found</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="transition-colors duration-200" style={{borderBottom:"1px solid #3F2E22"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(232,155,61,0.02)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td className="px-5 py-3.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center text-codex-bg font-bold text-sm shadow-sm">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-codex-text">{u.name}</td>
                  <td className="px-5 py-3.5 text-[12px] text-codex-muted">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={u.role==="admin" ? {background:"rgba(139,92,246,0.15)",color:"#A78BFA",border:"1px solid rgba(139,92,246,0.2)"} : {background:"rgba(99,102,241,0.15)",color:"#818CF8",border:"1px solid rgba(99,102,241,0.2)"}}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-codex-muted">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID") : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <button onClick={()=>toggleRole(u)} className="text-[11px] px-2.5 py-1.5 rounded-lg font-semibold transition-colors" style={{background:"rgba(139,92,246,0.15)",color:"#A78BFA"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(139,92,246,0.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(139,92,246,0.15)"}>{u.role==="admin"?"→ Customer":"→ Admin"}</button>
                      <button onClick={()=>handleDelete(u.id,u.name)} className="text-[11px] px-2.5 py-1.5 rounded-lg font-semibold transition-colors" style={{background:"rgba(239,68,68,0.15)",color:"#FCA5A5"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,0.15)"}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-between items-center px-5 py-3.5" style={{borderTop:"1px solid #3F2E22",background:"#15100C"}}>
          <span className="text-xs text-codex-muted">Page {page} of {Math.ceil(total/LIMIT)||1}</span>
          <div className="flex gap-2">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all disabled:opacity-30" style={{background:"#241A14",border:"1px solid #3F2E22",color:"#D4C5B0"}} onMouseEnter={e=>e.currentTarget.style.background="#2D2118"} onMouseLeave={e=>e.currentTarget.style.background="#241A14"}>← Prev</button>
            <button onClick={()=>setPage(p=>p+1)} disabled={page*LIMIT>=total} className="text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all disabled:opacity-30" style={{background:"#241A14",border:"1px solid #3F2E22",color:"#D4C5B0"}} onMouseEnter={e=>e.currentTarget.style.background="#2D2118"} onMouseLeave={e=>e.currentTarget.style.background="#241A14"}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
