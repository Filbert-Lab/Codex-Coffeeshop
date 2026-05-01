import { useState, useEffect } from "react";
import { getDashboardStats } from "../../api";

const StatusBadge = ({ status }) => {
  const cls = { pending: "badge-pending", processing: "badge-processing", completed: "badge-completed", cancelled: "badge-cancelled" };
  return <span className={cls[status] || "badge-pending"}>{status}</span>;
};

const StatCard = ({ label, value, icon, sub }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
    <div className="flex justify-between items-start mb-3">
      <span className="text-3xl">{icon}</span>
      {sub && <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full font-semibold">{sub}</span>}
    </div>
    <p className="text-3xl font-bold text-codex-dark">{value}</p>
    <p className="text-codex-muted text-sm mt-1">{label}</p>
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
      {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-7">
        <h1 className="text-3xl font-display font-bold text-codex-dark">Dashboard</h1>
        <p className="text-codex-muted mt-1">Welcome to Codex Coffee admin panel</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon="📦" label="Total Orders" value={stats?.totalOrders ?? 0} />
        <StatCard icon="💰" label="Revenue (Completed)" value={fmt(stats?.totalRevenue ?? 0)} />
        <StatCard icon="☕" label="Products" value={stats?.totalProducts ?? 0} />
        <StatCard icon="👥" label="Customers" value={stats?.totalUsers ?? 0} />
        <StatCard icon="⏳" label="Pending Orders" value={stats?.pendingOrders ?? 0} sub="Needs action" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-codex-dark text-lg mb-4">Recent Orders</h2>
        {stats?.recentOrders?.length === 0 ? (
          <p className="text-codex-muted text-sm text-center py-6">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-codex-muted border-b">
                  <th className="text-left pb-3 font-semibold">#ID</th>
                  <th className="text-left pb-3 font-semibold">Customer</th>
                  <th className="text-left pb-3 font-semibold">Total</th>
                  <th className="text-left pb-3 font-semibold">Type</th>
                  <th className="text-left pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((o) => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                    <td className="py-3 font-mono text-codex-muted">#{o.id}</td>
                    <td className="py-3 font-medium">{o.customer_name}</td>
                    <td className="py-3 text-codex-accent font-semibold">{fmt(o.total_amount)}</td>
                    <td className="py-3 capitalize">{o.order_type}</td>
                    <td className="py-3"><StatusBadge status={o.status} /></td>
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
