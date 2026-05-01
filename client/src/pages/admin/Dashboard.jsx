import { useState, useEffect } from "react";
import { getDashboardStats } from "../../api";

const StatusBadge = ({ status }) => {
  const cls = { pending: "badge-pending", processing: "badge-processing", completed: "badge-completed", cancelled: "badge-cancelled" };
  return <span className={cls[status] || "badge-pending"}>{status}</span>;
};

const StatCard = ({ label, value, icon, sub, color = "from-codex-accent/10 to-codex-accent/5" }) => (
  <div className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-500 group relative overflow-hidden">
    <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${color} rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-codex-dark to-codex-warm flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform duration-300">
          {icon}
        </div>
        {sub && (
          <span className="text-[10px] text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-semibold ring-1 ring-amber-100">
            {sub}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-codex-dark mt-1">{value}</p>
      <p className="text-codex-muted text-xs mt-1 uppercase tracking-wider font-medium">{label}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((r) => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  if (loading) return (
    <div className="p-8 grid grid-cols-2 lg:grid-cols-4 gap-5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-36 glass-card rounded-2xl animate-pulse">
          <div className="p-6 space-y-4">
            <div className="w-11 h-11 bg-gray-200/60 rounded-xl" />
            <div className="h-6 bg-gray-200/60 rounded-lg w-2/3" />
            <div className="h-3 bg-gray-200/40 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-8 relative">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-codex-dark">Dashboard</h1>
        <p className="text-codex-muted text-sm mt-1">Welcome to Codex Coffee admin panel</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📦" label="Total Orders" value={stats?.totalOrders ?? 0} color="from-blue-100/50 to-blue-50/30" />
        <StatCard icon="💰" label="Revenue" value={fmt(stats?.totalRevenue ?? 0)} color="from-emerald-100/50 to-emerald-50/30" />
        <StatCard icon="☕" label="Products" value={stats?.totalProducts ?? 0} color="from-amber-100/50 to-amber-50/30" />
        <StatCard icon="👥" label="Customers" value={stats?.totalUsers ?? 0} color="from-purple-100/50 to-purple-50/30" />
        <StatCard icon="⏳" label="Pending" value={stats?.pendingOrders ?? 0} sub="Needs action" color="from-orange-100/50 to-orange-50/30" />
      </div>

      <div className="glass-card rounded-2xl p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-codex-dark flex items-center justify-center text-sm">📋</div>
          <h2 className="font-bold text-codex-dark text-lg">Recent Orders</h2>
        </div>
        {stats?.recentOrders?.length === 0 ? (
          <div className="text-codex-muted text-sm text-center py-12 flex flex-col items-center">
            <span className="text-3xl mb-3 opacity-30">📦</span>
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["#ID", "Customer", "Total", "Type", "Status"].map(h => (
                    <th key={h} className="text-left pb-3 font-semibold text-codex-muted/70 text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-codex-accent/[0.02] transition-colors duration-200">
                    <td className="py-3.5 font-mono text-codex-muted text-xs">#{o.id}</td>
                    <td className="py-3.5 font-medium text-codex-dark">{o.customer_name}</td>
                    <td className="py-3.5 text-codex-accent font-semibold">{fmt(o.total_amount)}</td>
                    <td className="py-3.5 capitalize text-codex-muted">{o.order_type}</td>
                    <td className="py-3.5"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
