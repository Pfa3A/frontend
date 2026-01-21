import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMediaUrl } from "@/lib/urlUtils";
import { getEventDetails2 } from "@/services/eventService";
import type { MyEventDetailsDto } from "@/types/Event";

/** =========================
 *  SERVICE (API CALLS)
 *  ========================= */
async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      Accept: "*/*",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Erreur API (HTTP ${res.status})`);
  }

  return (await res.json()) as T;
}

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const fetchDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const d = await getEventDetails2(eventId!);
      setData(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s’est produite");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [eventId]);

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
      </header>

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
