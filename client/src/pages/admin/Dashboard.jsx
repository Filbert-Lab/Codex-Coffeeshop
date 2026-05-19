import { useState, useEffect } from "react";
import { getDashboardStats } from "../../api";

const StatusBadge = ({ status }) => {
  const cls = { pending: "badge-pending", processing: "badge-processing", completed: "badge-completed", cancelled: "badge-cancelled" };
  return <span className={cls[status] || "badge-pending"}>{status}</span>;
};

const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
const fmtShort = (n) => {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `Rp ${(n / 1000).toFixed(0)}K`;
  return fmt(n);
};

const StatCard = ({ label, value, icon, sub, color = "bg-codex-accent/10", iconBg = "from-codex-accent to-codex-accent-dark" }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100/80 hover:border-codex-accent/20 hover:shadow-lg transition-all duration-500 group relative overflow-hidden shadow-soft">
    <div className={`absolute -top-8 -right-8 w-24 h-24 ${color} rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-500`} />
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center text-lg shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          {icon}
        </div>
        {sub && (
          <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-semibold ring-1 ring-amber-100">
            {sub}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-codex-dark mt-1 tracking-tight">{value}</p>
      <p className="text-gray-500 text-[11px] mt-0.5 uppercase tracking-wider font-semibold">{label}</p>
    </div>
  </div>
);

// Bar chart component
const MiniBarChart = ({ data, maxHeight = 140 }) => {
  if (!data || data.length === 0) return (
    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No data available</div>
  );
  const maxVal = Math.max(...data.map(d => Number(d.revenue)), 1);
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div className="flex items-end justify-between gap-3 px-2" style={{ height: maxHeight }}>
      {data.map((d, i) => {
        const height = Math.max((Number(d.revenue) / maxVal) * (maxHeight - 30), 6);
        const dayName = new Date(d.date).getDay();
        return (
          <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
            <div className="relative w-full flex justify-center">
              <div
                className="w-full max-w-[36px] rounded-xl bg-gradient-to-t from-codex-accent to-codex-accent-light group-hover:from-codex-accent-dark group-hover:to-codex-accent transition-all duration-300 relative overflow-hidden shadow-sm"
                style={{ height: `${height}px` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -trangray-x-1/2 bg-codex-dark text-white text-[9px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg z-10">
                {fmtShort(Number(d.revenue))}
                <div className="absolute top-full left-1/2 -trangray-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-codex-dark" />
              </div>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">{days[dayName]}</span>
          </div>
        );
      })}
    </div>
  );
};

// Donut chart for order status
const DonutChart = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No data</div>
  );

  const total = data.reduce((s, d) => s + Number(d.count), 0);
  const colors = {
    pending: "#F59E0B",
    processing: "#6366F1",
    completed: "#10B981",
    cancelled: "#EF4444",
  };
  const labels = {
    pending: "Pending",
    processing: "Processing",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  let cumulativePercent = 0;
  const segments = data.map(d => {
    const percent = (Number(d.count) / total) * 100;
    const start = cumulativePercent;
    cumulativePercent += percent;
    return { ...d, percent, start, color: colors[d.status] || "#9CA3AF" };
  });

  const gradientStops = segments.map(s => `${s.color} ${s.start}% ${s.start + s.percent}%`).join(", ");

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-28 h-28 shrink-0">
        <div
          className="w-full h-full rounded-full shadow-inner"
          style={{ background: `conic-gradient(${gradientStops})` }}
        />
        <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-sm">
          <div className="text-center">
            <span className="text-lg font-bold text-codex-dark block">{total}</span>
            <span className="text-[9px] text-gray-400 uppercase tracking-wider">Total</span>
          </div>
        </div>
      </div>
      <div className="space-y-2 flex-1">
        {segments.map(s => (
          <div key={s.status} className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-gray-600 flex-1">{labels[s.status] || s.status}</span>
            <span className="text-xs font-bold text-codex-dark">{Number(s.count)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Top products list
const TopProductsList = ({ products }) => {
  if (!products || products.length === 0) return (
    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
      <span className="text-2xl mb-2 opacity-30">☕</span>
      <p className="text-sm">No sales data yet</p>
    </div>
  );

  const maxSold = Math.max(...products.map(p => Number(p.total_sold)), 1);

  return (
    <div className="space-y-3">
      {products.map((p, i) => (
        <div key={i} className="flex items-center gap-3 group">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm ${
            i === 0 ? "bg-gradient-to-br from-amber-400 to-amber-500" :
            i === 1 ? "bg-gradient-to-br from-gray-400 to-gray-500" :
            i === 2 ? "bg-gradient-to-br from-orange-400 to-orange-500" :
            "bg-gradient-to-br from-gray-300 to-gray-400"
          }`}>
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-codex-dark truncate">{p.name}</span>
              <span className="text-[11px] font-bold text-codex-accent ml-2 shrink-0">{Number(p.total_sold)} sold</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-codex-accent to-codex-accent-light rounded-full transition-all duration-700"
                style={{ width: `${(Number(p.total_sold) / maxSold) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((r) => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8">
      <div className="mb-8">
        <div className="h-8 bg-gray-200/60 rounded-xl w-48 animate-pulse mb-2" />
        <div className="h-4 bg-gray-100 rounded-lg w-72 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse">
            <div className="p-5 space-y-3">
              <div className="w-11 h-11 bg-gray-100 rounded-xl" />
              <div className="h-6 bg-gray-100 rounded-lg w-2/3" />
              <div className="h-3 bg-gray-50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />
        <div className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="p-8 relative">
      {/* Header */}
      <div className="mb-7 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-codex-dark tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Ringkasan penjualan & performa toko</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
          Live Data
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="💰" label="Total Revenue" value={fmt(stats?.totalRevenue ?? 0)} color="bg-emerald-100/50" iconBg="from-emerald-500 to-emerald-600" />
        <StatCard icon="📦" label="Total Orders" value={stats?.totalOrders ?? 0} color="bg-blue-100/50" iconBg="from-blue-500 to-blue-600" />
        <StatCard icon="☕" label="Products" value={stats?.totalProducts ?? 0} color="bg-amber-100/50" iconBg="from-amber-500 to-amber-600" />
        <StatCard icon="👥" label="Customers" value={stats?.totalUsers ?? 0} color="bg-purple-100/50" iconBg="from-purple-500 to-purple-600" />
      </div>

      {/* Today's Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 border-l-4 border-l-codex-accent relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Hari Ini</p>
          <p className="text-2xl font-bold text-codex-dark">{fmt(stats?.todayRevenue ?? 0)}</p>
          <p className="text-xs text-gray-400 mt-0.5">{stats?.todayOrders ?? 0} pesanan</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 border-l-4 border-l-blue-500 relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Rata-rata Order</p>
          <p className="text-2xl font-bold text-codex-dark">{fmt(stats?.avgOrderValue ?? 0)}</p>
          <p className="text-xs text-gray-400 mt-0.5">per transaksi</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 border-l-4 border-l-amber-500 relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Perlu Diproses</p>
          <p className="text-2xl font-bold text-codex-dark">{stats?.pendingOrders ?? 0}</p>
          <p className="text-xs text-gray-400 mt-0.5">pesanan pending</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-codex-accent/10 to-codex-accent/5 flex items-center justify-center text-base border border-codex-accent/10">📈</div>
              <div>
                <h3 className="font-bold text-codex-dark text-sm">Revenue 7 Hari Terakhir</h3>
                <p className="text-[11px] text-gray-400">Pendapatan harian dari pesanan selesai</p>
              </div>
            </div>
          </div>
          <MiniBarChart data={stats?.dailyRevenue || []} maxHeight={140} />
        </div>

        {/* Order Status Donut */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center text-base border border-blue-100">📊</div>
            <div>
              <h3 className="font-bold text-codex-dark text-sm">Status Pesanan</h3>
              <p className="text-[11px] text-gray-400">Distribusi status</p>
            </div>
          </div>
          <DonutChart data={stats?.statusBreakdown || []} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 flex items-center justify-center text-base border border-amber-100">🏆</div>
            <div>
              <h3 className="font-bold text-codex-dark text-sm">Produk Terlaris</h3>
              <p className="text-[11px] text-gray-400">Berdasarkan jumlah terjual</p>
            </div>
          </div>
          <TopProductsList products={stats?.topProducts || []} />
        </div>

        {/* Order Type Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 flex items-center justify-center text-base border border-purple-100">🚀</div>
            <div>
              <h3 className="font-bold text-codex-dark text-sm">Tipe Pesanan</h3>
              <p className="text-[11px] text-gray-400">Pickup vs Delivery</p>
            </div>
          </div>
          {stats?.orderTypeBreakdown?.length > 0 ? (
            <div className="space-y-3">
              {stats.orderTypeBreakdown.map((t, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100/80 transition-colors duration-200 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{t.order_type === "pickup" ? "🏪" : "🛵"}</span>
                      <span className="text-sm font-semibold text-codex-dark capitalize">{t.order_type}</span>
                    </div>
                    <span className="text-xs font-bold text-codex-accent">{Number(t.count)} orders</span>
                  </div>
                  <p className="text-xs text-gray-400">{fmt(Number(t.revenue))} revenue</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <span className="text-2xl mb-2 opacity-30">📦</span>
              <p className="text-sm">No completed orders yet</p>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 flex items-center justify-center text-base border border-emerald-100">📋</div>
            <div>
              <h3 className="font-bold text-codex-dark text-sm">Pesanan Terbaru</h3>
              <p className="text-[11px] text-gray-400">5 pesanan terakhir</p>
            </div>
          </div>
          {stats?.recentOrders?.length > 0 ? (
            <div className="space-y-2">
              {stats.recentOrders.map((o) => (
                <div key={o.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors duration-200 group">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-mono text-gray-500 group-hover:bg-codex-accent/10 group-hover:text-codex-accent group-hover:border-codex-accent/20 transition-colors duration-200">
                    #{o.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-codex-dark truncate">{o.customer_name}</p>
                    <p className="text-[10px] text-gray-400">{fmt(o.total_amount)}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <span className="text-2xl mb-2 opacity-30">📦</span>
              <p className="text-sm">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
