import { useState, useEffect } from "react";
import { getDashboardStats } from "../../api";

const fmt = (n) => new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR", minimumFractionDigits:0 }).format(n);
const fmtShort = (n) => {
  if (n >= 1000000) return `Rp ${(n/1000000).toFixed(1)}M`;
  if (n >= 1000) return `Rp ${(n/1000).toFixed(0)}K`;
  return fmt(n);
};

const S = { // shared inline styles
  card: { background:"#FFFFFF", border:"1px solid #E8DCC4", boxShadow:"0 1px 3px rgba(61,40,23,0.06), 0 8px 20px rgba(61,40,23,0.06)" },
  cardHover: { background:"#FFFBF3", border:"1px solid rgba(156,107,63,0.25)", boxShadow:"0 4px 12px rgba(61,40,23,0.1), 0 16px 32px rgba(61,40,23,0.12)" },
  divider: { borderTop:"1px solid #E8DCC4" },
  muted: { color:"#8C7458" },
};

const StatusBadge = ({ status }) => {
  const cls = { pending:"badge-pending", processing:"badge-processing", completed:"badge-completed", cancelled:"badge-cancelled" };
  return <span className={cls[status] || "badge-pending"}>{status}</span>;
};

function StatCard({ label, value, icon, gradient }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden transition-all duration-500 cursor-default"
      style={hovered ? S.cardHover : S.card}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 transition-opacity duration-500"
        style={{ background:gradient, filter:"blur(20px)", opacity: hovered ? 0.35 : 0.15 }} />
      <div className="relative z-10">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-md mb-3 transition-transform duration-300"
          style={{ background:gradient, transform: hovered ? "scale(1.1) rotate(3deg)" : "scale(1)" }}>
          {icon}
        </div>
        <p className="text-2xl font-bold text-codex-text tracking-tight">{value}</p>
        <p className="text-[11px] uppercase tracking-wider font-semibold mt-0.5" style={S.muted}>{label}</p>
      </div>
    </div>
  );
}

function BarChart({ data, maxHeight = 140 }) {
  if (!data || data.length === 0) return (
    <div className="flex items-center justify-center h-32 text-codex-muted text-sm">No data available</div>
  );
  const maxVal = Math.max(...data.map(d => Number(d.revenue)), 1);
  const days = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
  return (
    <div className="flex items-end justify-between gap-3 px-2" style={{ height:maxHeight }}>
      {data.map((d, i) => {
        const h = Math.max((Number(d.revenue) / maxVal) * (maxHeight - 30), 6);
        const day = new Date(d.date).getDay();
        return (
          <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
            <div className="relative w-full flex justify-center">
              <div className="w-full max-w-[36px] rounded-xl transition-all duration-300 relative overflow-hidden"
                style={{ height:`${h}px`, background:"linear-gradient(to top, #9C6B3F, #F0B865)" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[9px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg z-10"
                style={{ background:"#F4ECDF", color:"#2A1B0E", border:"1px solid #E8DCC4" }}>
                {fmtShort(Number(d.revenue))}
              </div>
            </div>
            <span className="text-[10px] font-medium" style={S.muted}>{days[day]}</span>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ data }) {
  if (!data || data.length === 0) return <div className="flex items-center justify-center h-32 text-codex-muted text-sm">No data</div>;
  const total = data.reduce((s, d) => s + Number(d.count), 0);
  const colors = { pending:"#F59E0B", processing:"#6366F1", completed:"#10B981", cancelled:"#EF4444" };
  const labels = { pending:"Pending", processing:"Processing", completed:"Completed", cancelled:"Cancelled" };
  let cum = 0;
  const segs = data.map(d => {
    const pct = (Number(d.count) / total) * 100;
    const start = cum; cum += pct;
    return { ...d, pct, start, color: colors[d.status] || "#9CA3AF" };
  });
  const grad = segs.map(s => `${s.color} ${s.start}% ${s.start + s.pct}%`).join(", ");
  return (
    <div className="flex items-center gap-5">
      <div className="relative w-28 h-28 shrink-0">
        <div className="w-full h-full rounded-full" style={{ background:`conic-gradient(${grad})` }} />
        <div className="absolute inset-4 rounded-full flex items-center justify-center" style={{ background:"#FFFFFF" }}>
          <div className="text-center">
            <span className="text-lg font-bold text-codex-text block">{total}</span>
            <span className="text-[9px] uppercase tracking-wider" style={S.muted}>Total</span>
          </div>
        </div>
      </div>
      <div className="space-y-2 flex-1">
        {segs.map(s => (
          <div key={s.status} className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor:s.color }} />
            <span className="text-xs flex-1 text-codex-text-soft">{labels[s.status] || s.status}</span>
            <span className="text-xs font-bold text-codex-text">{Number(s.count)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopProducts({ products }) {
  if (!products || products.length === 0) return (
    <div className="flex flex-col items-center justify-center py-8 text-codex-muted">
      <span className="text-2xl mb-2 opacity-30">☕</span><p className="text-sm">No sales data yet</p>
    </div>
  );
  const max = Math.max(...products.map(p => Number(p.total_sold)), 1);
  const rankColors = ["linear-gradient(135deg,#F59E0B,#D97706)", "linear-gradient(135deg,#94A3B8,#64748B)", "linear-gradient(135deg,#F97316,#EA580C)", "linear-gradient(135deg,#E8DCC4,#FFFBF3)", "linear-gradient(135deg,#E8DCC4,#FFFBF3)"];
  return (
    <div className="space-y-3">
      {products.map((p, i) => (
        <div key={i} className="flex items-center gap-3 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-codex-bg text-[10px] font-bold shrink-0 shadow-sm" style={{ background:rankColors[i] }}>{i+1}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-codex-text truncate">{p.name}</span>
              <span className="text-[11px] font-bold text-codex-accent ml-2 shrink-0">{Number(p.total_sold)} sold</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"#E8DCC4" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width:`${(Number(p.total_sold)/max)*100}%`, background:"linear-gradient(to right, #9C6B3F, #F0B865)" }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(r => setStats(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8">
      <div className="mb-8">
        <div className="h-8 rounded-xl w-48 animate-pulse mb-2" style={{ background:"#FFFBF3" }} />
        <div className="h-4 rounded-lg w-72 animate-pulse" style={{ background:"#FFFFFF" }} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background:"#FFFFFF", border:"1px solid #E8DCC4" }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-7 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-codex-text tracking-tight">Dashboard</h1>
          <p className="text-codex-muted text-sm mt-1">Ringkasan penjualan & performa toko</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-codex-muted px-3 py-1.5 rounded-lg" style={{ background:"#FFFFFF", border:"1px solid #E8DCC4" }}>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
          Live Data
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="💰" label="Total Revenue" value={fmt(stats?.totalRevenue ?? 0)} gradient="linear-gradient(135deg,#10B981,#059669)" />
        <StatCard icon="📦" label="Total Orders" value={stats?.totalOrders ?? 0} gradient="linear-gradient(135deg,#6366F1,#4F46E5)" />
        <StatCard icon="☕" label="Products" value={stats?.totalProducts ?? 0} gradient="linear-gradient(135deg,#9C6B3F,#5A3920)" />
        <StatCard icon="👥" label="Customers" value={stats?.totalUsers ?? 0} gradient="linear-gradient(135deg,#8B5CF6,#7C3AED)" />
      </div>

      {/* Today Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label:"Hari Ini", value:fmt(stats?.todayRevenue ?? 0), sub:`${stats?.todayOrders ?? 0} pesanan`, accent:"#9C6B3F" },
          { label:"Rata-rata Order", value:fmt(stats?.avgOrderValue ?? 0), sub:"per transaksi", accent:"#6366F1" },
          { label:"Perlu Diproses", value:stats?.pendingOrders ?? 0, sub:"pesanan pending", accent:"#F59E0B" },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl p-5 relative overflow-hidden transition-all duration-300"
            style={{ ...S.card, borderLeft:`3px solid ${item.accent}` }}>
            <p className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={S.muted}>{item.label}</p>
            <p className="text-2xl font-bold text-codex-text">{item.value}</p>
            <p className="text-xs mt-0.5" style={S.muted}>{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 rounded-2xl p-6" style={S.card}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ background:"rgba(156,107,63,0.1)", border:"1px solid rgba(156,107,63,0.15)" }}>📈</div>
            <div>
              <h3 className="font-bold text-codex-text text-sm">Revenue 7 Hari Terakhir</h3>
              <p className="text-[11px] text-codex-muted">Pendapatan harian dari pesanan selesai</p>
            </div>
          </div>
          <BarChart data={stats?.dailyRevenue || []} maxHeight={140} />
        </div>
        <div className="rounded-2xl p-6" style={S.card}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.15)" }}>📊</div>
            <div>
              <h3 className="font-bold text-codex-text text-sm">Status Pesanan</h3>
              <p className="text-[11px] text-codex-muted">Distribusi status</p>
            </div>
          </div>
          <DonutChart data={stats?.statusBreakdown || []} />
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl p-6" style={S.card}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.15)" }}>🏆</div>
            <div>
              <h3 className="font-bold text-codex-text text-sm">Produk Terlaris</h3>
              <p className="text-[11px] text-codex-muted">Berdasarkan jumlah terjual</p>
            </div>
          </div>
          <TopProducts products={stats?.topProducts || []} />
        </div>

        <div className="rounded-2xl p-6" style={S.card}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.15)" }}>🚀</div>
            <div>
              <h3 className="font-bold text-codex-text text-sm">Tipe Pesanan</h3>
              <p className="text-[11px] text-codex-muted">Pickup vs Delivery</p>
            </div>
          </div>
          {stats?.orderTypeBreakdown?.length > 0 ? (
            <div className="space-y-3">
              {stats.orderTypeBreakdown.map((t, i) => (
                <div key={i} className="rounded-xl p-4 transition-colors duration-200" style={{ background:"#F4ECDF", border:"1px solid #E8DCC4" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{t.order_type === "pickup" ? "🏪" : "🛵"}</span>
                      <span className="text-sm font-semibold text-codex-text capitalize">{t.order_type}</span>
                    </div>
                    <span className="text-xs font-bold text-codex-accent">{Number(t.count)} orders</span>
                  </div>
                  <p className="text-xs text-codex-muted">{fmt(Number(t.revenue))} revenue</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-codex-muted">
              <span className="text-2xl mb-2 opacity-30">📦</span><p className="text-sm">No completed orders yet</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl p-6" style={S.card}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.15)" }}>📋</div>
            <div>
              <h3 className="font-bold text-codex-text text-sm">Pesanan Terbaru</h3>
              <p className="text-[11px] text-codex-muted">5 pesanan terakhir</p>
            </div>
          </div>
          {stats?.recentOrders?.length > 0 ? (
            <div className="space-y-2">
              {stats.recentOrders.map((o) => (
                <div key={o.id} className="flex items-center gap-3 p-2.5 rounded-xl transition-colors duration-200 group"
                  style={{ background:"transparent" }}
                  onMouseEnter={e => e.currentTarget.style.background="#F4ECDF"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono transition-colors duration-200"
                    style={{ background:"#F4ECDF", border:"1px solid #E8DCC4", color:"#8C7458" }}>
                    #{o.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-codex-text truncate">{o.customer_name}</p>
                    <p className="text-[10px] text-codex-muted">{fmt(o.total_amount)}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-codex-muted">
              <span className="text-2xl mb-2 opacity-30">📦</span><p className="text-sm">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
