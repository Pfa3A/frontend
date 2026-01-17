import { getMetrics, getRecentSales } from "@/services/dashboard.service";
import type { Metrics, RecentSales } from "@/types/dashboard";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-MA', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatNumber(num: number) {
  return new Intl.NumberFormat('fr-MA').format(num);
}

const Dashboard = () => {
  const [recentSales, setRecentSales] = useState<RecentSales | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [salesData, metricsData] = await Promise.all([
          getRecentSales(),
          getMetrics(),
        ]);
        setRecentSales(salesData);
        setMetrics(metricsData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Une erreur s'est produite");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);



  return (
    <div className="min-h-screen bg-white">


      <header className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <div>
          <p className="text-sm font-semibold tracking-wide text-slate-500">
            Billetterie NFT
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Tableau de bord
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Vue d'ensemble de tes métriques et ventes récentes
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {/* Erreur */}
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm font-semibold text-rose-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && !error && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <p className="text-sm text-slate-600">Chargement des données…</p>
          </div>
        )}

        {/* Métriques principales */}
        {!isLoading && metrics && (
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_50px_rgba(15,23,42,0.10)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Revenus totaux
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {formatCurrency(metrics.revenue)} MAD
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-2.5 ring-1 ring-emerald-200">
                  <span className="text-lg">💰</span>
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_50px_rgba(15,23,42,0.10)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Billets vendus
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {formatNumber(metrics.totalSoldTickets)}
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 p-2.5 ring-1 ring-blue-200">
                  <span className="text-lg">🎫</span>
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_50px_rgba(15,23,42,0.10)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Événements
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {formatNumber(metrics.totalEvents)}
                  </p>
                </div>
                <div className="rounded-xl bg-indigo-50 p-2.5 ring-1 ring-indigo-200">
                  <span className="text-lg">📅</span>
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_50px_rgba(15,23,42,0.10)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Participants
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {formatNumber(metrics.totalAttendees)}
                  </p>
                </div>
                <div className="rounded-xl bg-purple-50 p-2.5 ring-1 ring-purple-200">
                  <span className="text-lg">👥</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Ventes récentes */}
        {!isLoading && recentSales && (
          <section className="grid gap-6 lg:grid-cols-2">
            {/* Ventes du jour et de la semaine */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">
                    Ventes du jour
                  </h2>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    Aujourd'hui
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Billets vendus</span>
                    <span className="text-lg font-bold text-slate-900">
                      {formatNumber(recentSales.todaySales.ticketsSold)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Revenus</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {formatCurrency(recentSales.todaySales.revenue)} MAD
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">
                    Ventes de la semaine
                  </h2>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                    7 derniers jours
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Billets vendus</span>
                    <span className="text-lg font-bold text-slate-900">
                      {formatNumber(recentSales.weekSales.ticketsSold)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Revenus</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(recentSales.weekSales.revenue)} MAD
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ventes des 30 derniers jours */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">
                  Ventes des 30 derniers jours
                </h2>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
                  {recentSales.monthSales.length} jours
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={recentSales.monthSales.map((sale, idx) => {
                      const daysAgo = recentSales.monthSales.length - idx - 1;
                      const date = new Date();
                      date.setDate(date.getDate() - daysAgo);

                      return {
                        date: new Intl.DateTimeFormat('fr-MA', {
                          day: '2-digit',
                          month: 'short'
                        }).format(date),
                        revenue: sale.revenue,
                        tickets: sale.ticketsSold,
                      };
                    })}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      stroke="#94a3b8"
                      style={{ fontSize: '11px' }}
                      tickMargin={8}
                      interval={Math.floor(recentSales.monthSales.length / 6)}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      style={{ fontSize: '11px' }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number | undefined, name: string | undefined) => {
                        if (value === undefined) return '';
                        if (name === 'revenue') {
                          return [`${formatCurrency(value)} MAD`, 'Revenus'];
                        }
                        return [`${formatNumber(value)} billets`, 'Billets vendus'];
                      }}
                      labelStyle={{ fontWeight: 600, color: '#0f172a' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ fill: '#6366f1', r: 3 }}
                      activeDot={{ r: 5, fill: '#4f46e5' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-6 rounded-full bg-indigo-500" />
                  <span className="text-xs text-slate-600">Revenus quotidiens</span>
                </div>
                <div className="text-xs text-slate-500">
                  Survole le graphique pour plus de détails
                </div>
              </div>
            </div>
          </section>
        )}

        {/* État vide */}
        {!isLoading && !metrics && !recentSales && !error && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <h3 className="text-base font-semibold text-slate-900">
              Aucune donnée disponible
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Les données apparaîtront ici une fois que tu auras des événements actifs.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;