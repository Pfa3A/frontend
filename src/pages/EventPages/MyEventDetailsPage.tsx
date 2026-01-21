import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMediaUrl } from "@/lib/urlUtils";
import { getEventDetails2, getEventStatistics, updateEventStatus } from "@/services/eventService";
import type { EventStatisticsDto, MyEventDetailsDto } from "@/types/Event";
import { TrendingUp, Users, Ticket, Clock, CheckCircle2 } from "lucide-react";

/** =========================
 *  UI HELPERS
 *  ========================= */
function formatDate(iso?: string) {
  if (!iso) return "Date à confirmer";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Date à confirmer";

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function statusPill(status?: string) {
  const s = (status ?? "UNKNOWN").toUpperCase();
  const base = "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold";
  switch (s) {
    case "ACTIVE":
      return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`;
    case "INACTIVE":
      return `${base} bg-slate-50 text-slate-700 ring-1 ring-slate-200`;
    case "CANCELLED":
      return `${base} bg-rose-50 text-rose-700 ring-1 ring-rose-200`;
    case "ENDED":
      return `${base} bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200`;
    default:
      return `${base} bg-amber-50 text-amber-700 ring-1 ring-amber-200`;
  }
}

function moneyMAD(value?: number) {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return `${n.toFixed(2)} MAD`;
}

function buildCoverGradient(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  const h2 = (h + 24) % 360;
  return `linear-gradient(135deg, hsl(${h} 72% 92%), hsl(${h2} 72% 96%))`;
}

/** =========================
 *  PAGE
 *  ========================= */
export const MyEventDetailsPage = () => {
  const [data, setData] = useState<MyEventDetailsDto | null>(null);
  const [stats, setStats] = useState<EventStatisticsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  // Status update state
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const fetchDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const d = await getEventDetails2(eventId!);
      setData(d);

      const s = await getEventStatistics(eventId!);
      setStats(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s’est produite");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [eventId]);

  const handleStatusChange = (newStatus: string) => {
    setPendingStatus(newStatus);
    setShowStatusConfirm(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus || !eventId) return;

    setIsUpdatingStatus(true);
    setStatusError(null);
    setStatusSuccess(false);
    setShowStatusConfirm(false);

    try {
      await updateEventStatus(eventId, pendingStatus);
      setStatusSuccess(true);
      // Refresh event data
      await fetchDetails();
      setTimeout(() => setStatusSuccess(false), 3000);
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : "Échec de la mise à jour du statut");
    } finally {
      setIsUpdatingStatus(false);
      setPendingStatus(null);
    }
  };

  const cancelStatusChange = () => {
    setShowStatusConfirm(false);
    setPendingStatus(null);
  };

  const venueLine = useMemo(() => {
    if (!data?.venue) return "Lieu à confirmer";
    const v = data.venue;

    const parts = [
      v.name,
      v.addressLine1,
      v.addressLine2 ?? "",
      v.postalCode ?? "",
      v.city,
      v.country,
    ]
      .map((x) => (x ?? "").trim())
      .filter(Boolean);

    return parts.join(", ");
  }, [data]);

  return (
    <div className="min-h-screen bg-white">
      {/* décor de fond premium subtil */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-32 -left-24 h-80 w-80 rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.18), rgba(59,130,246,0))",
          }}
        />
        <div
          className="absolute -top-24 right-0 h-72 w-72 rounded-full blur-3xl opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.16), rgba(99,102,241,0))",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.14), rgba(16,185,129,0))",
          }}
        />
      </div>

      <header className="mx-auto max-w-5xl px-4 pt-10 pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-500">
              Billetterie NFT
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Mon événement
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/organizer/events/${eventId}/edit`)}
              className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Modifier l'événement
            </button>
            <button
              type="button"
              onClick={fetchDetails}
              disabled={isLoading}
              className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Chargement..." : "Rafraîchir"}
            </button>
          </div>
        </div>

        {/* Status Update Section */}
        {data && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">Statut de l'événement</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className={statusPill(data.status)}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                    {data.status}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={data.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdatingStatus}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="ENDED">ENDED</option>
                </select>
              </div>
            </div>

            {/* Status feedback messages */}
            {statusError && (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
                ❌ {statusError}
              </div>
            )}
            {statusSuccess && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                ✅ Statut mis à jour avec succès
              </div>
            )}
            {isUpdatingStatus && (
              <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-700">
                ⏳ Mise à jour du statut en cours...
              </div>
            )}
          </div>
        )}
      </header>

      {/* Confirmation Modal */}
      {showStatusConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Confirmer le changement de statut</h3>
            <p className="mt-2 text-sm text-slate-600">
              Êtes-vous sûr de vouloir changer le statut de <span className="font-semibold">{data?.status}</span> à{" "}
              <span className="font-semibold">{pendingStatus}</span> ?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={cancelStatusChange}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmStatusChange}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 pb-12">
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm font-semibold text-rose-700">{error}</p>
          </div>
        )}

        {isLoading && !error && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <p className="text-sm text-slate-600">Chargement des détails…</p>
          </div>
        )}

        {!isLoading && !error && !data && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <h3 className="text-base font-semibold text-slate-900">
              Aucun événement trouvé
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Ton compte ne semble pas avoir d’événement associé.
            </p>
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* Statistics Dashboard */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm ring-1 ring-blue-50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Ticket size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Billets vendus</p>
                    <p className="text-2xl font-bold text-slate-900">{stats?.totalSoldTickets ?? 0}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-blue-600">{stats?.remainingSeats ?? 0}</span> billets restants
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm ring-1 ring-emerald-50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenu Total</p>
                    <p className="text-2xl font-bold text-slate-900">{moneyMAD(stats?.totalRevenue ?? 0)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-emerald-600">Prix unitaire:</span> {moneyMAD(data.ticketPrice)}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm ring-1 ring-amber-50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Réservations</p>
                    <p className="text-2xl font-bold text-slate-900">{stats?.reservedTickets ?? 0}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  En attente de paiement
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm ring-1 ring-indigo-50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">File d'attente</p>
                    <p className="text-2xl font-bold text-slate-900">{stats?.waitlistCount ?? 0}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  Personnes en attente
                </div>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm ring-1 ring-purple-50 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Taux de présence</p>
                    <p className="text-2xl font-bold text-slate-900">{(stats?.attendanceRate ?? 0).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-purple-600"
                    style={{ width: `${stats?.attendanceRate ?? 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <div
                className="h-48 w-full bg-cover bg-center"
                style={{
                  backgroundImage: data.imageUrl
                    ? `url("${getMediaUrl(data.imageUrl)}")`
                    : buildCoverGradient(String(data.id)),
                }}
                aria-hidden="true"
              />
              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-2xl font-bold text-slate-900">{data.name}</h2>
                    <p className="mt-2 text-sm text-slate-600">{formatDate(data.date)}</p>
                  </div>
                  <div className={statusPill(data.status)}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                    {data.status}
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-700">{data.description}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-600">Prix</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {moneyMAD(data.ticketPrice)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-600">Places totales</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {data.totalSeats}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-600">Max / personne</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {data.maxTicketsPerPerson}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
              <h3 className="text-lg font-bold text-slate-900">Lieu</h3>
              <p className="mt-2 text-sm text-slate-700">{venueLine}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
              <h3 className="text-lg font-bold text-slate-900">Organisateur</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-600">Entreprise</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {data.organizer.companyName}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-600">Email de contact</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {data.organizer.contactEmail ?? "Non renseigné"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-600">Téléphone</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {data.organizer.phoneNumber ?? "Non renseigné"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-600">Site web</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {data.organizer.website ?? "Non renseigné"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
