import { getEvents } from "@/services/eventService";
import type { EventDto } from "@/types/event";
import { Card } from "@/components/Card";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMediaUrl } from "@/lib/urlUtils";

const PAGE_SIZE = 10;



// ✅ DONNÉES MOCK (à remplacer plus tard par le backend)


function formatDateRange(start?: string, end?: string) {
  if (!start && !end) return "Date à confirmer";
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));

  if (start && end) return `${fmt(start)} · ${fmt(end)}`;
  if (start) return fmt(start);
  return fmt(end!);
}

function statusPill(status?: string) {
  const s = (status ?? "UNKNOWN").toUpperCase();
  const base =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold";
  switch (s) {
    case "PUBLISHED":
      return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`;
    case "DRAFT":
      return `${base} bg-slate-50 text-slate-700 ring-1 ring-slate-200`;
    case "CANCELLED":
      return `${base} bg-rose-50 text-rose-700 ring-1 ring-rose-200`;
    case "ENDED":
      return `${base} bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200`;
    default:
      return `${base} bg-amber-50 text-amber-700 ring-1 ring-amber-200`;
  }
}

function clampText(text?: string, max = 140) {
  if (!text) return "";
  const t = text.trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

function buildCoverGradient(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  const h2 = (h + 24) % 360;
  return `linear-gradient(135deg, hsl(${h} 72% 92%), hsl(${h2} 72% 96%))`;
}

export const AllEventsListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<EventDto[]>([]);

  const pageParam = Number(searchParams.get("page") ?? "1");
  const currentPage =
    Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const pageIndex = currentPage - 1;

  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  // ✅ Recherche + filtre (côté client pour le mock)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;

    return events.filter((e) => {
      const hay = `${e.name} ${e.venueName ?? ""} ${e.city ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [events, query]);


  // ✅ Pagination (côté client pour le mock)
  const totalElements = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / PAGE_SIZE));
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const pagedEvents = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageIndex]);

  const title = totalElements > 0 ? `Événements (${totalElements})` : "Événements";

  function goToPage(p: number) {
    const next = Math.min(Math.max(1, p), totalPages);
    const q = searchParams.get("q");
    const sp = new URLSearchParams();
    sp.set("page", String(next));
    if (q) sp.set("q", q);
    setSearchParams(sp);
  }

  function onSubmitSearch(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    sp.set("page", "1");
    if (query.trim()) sp.set("q", query.trim());
    setSearchParams(sp);
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);


  return (
    <div className="min-h-screen bg-white">
      {/* décor de fond premium subtil */}


      <header className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-500">
              Billetterie NFT
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Données mock pour le moment. Clique sur un événement pour aller vers la page de détails.
            </p>
          </div>

          <form onSubmit={onSubmitSearch} className="w-full md:w-[420px]">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <span className="select-none text-slate-400">⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher par titre, lieu, ville…"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 active:scale-[0.99]"
              >
                Rechercher
              </button>
            </div>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {/* Liste */}
        <section className="grid gap-4">
          {pagedEvents.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <h3 className="text-base font-semibold text-slate-900">
                Aucun événement trouvé
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Essaie de modifier ta recherche.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setSearchParams(new URLSearchParams({ page: "1" }));
                }}
                className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Effacer la recherche
              </button>
            </div>
          ) : (
            pagedEvents.map((ev) => {
              const seed = String(ev.id ?? ev.name);
              const cover = ev.imageUrl
                ? `url("${getMediaUrl(ev.imageUrl)}")`
                : buildCoverGradient(seed);

              return (
                <Card className="group border border-slate-200 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_50px_rgba(15,23,42,0.10)]">
                  <button
                    onClick={() => navigate(`/client/events/${ev.id}`)}
                    className="flex gap-4 w-full text-left"
                  >
                    <div
                      className="h-20 w-20 shrink-0 rounded-xl border border-slate-200 bg-cover bg-center"
                      style={{ backgroundImage: cover }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <h2 className="truncate text-base font-semibold text-slate-900 group-hover:text-slate-950">
                            {ev.name}
                          </h2>
                          <p className="mt-1 text-sm text-slate-600">
                            {formatDateRange(ev.startDate, ev.endDate)}
                          </p>
                        </div>

                        <div className={statusPill(ev.status)}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                          {ev.status ?? "UNKNOWN"}
                        </div>
                      </div>

                      <p className="mt-2 text-sm text-slate-600">
                        {clampText(ev.description, 160)}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                          📍 {ev.venueName ?? "Lieu à confirmer"}
                        </span>
                        <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                          {ev.city ? `🏙️ ${ev.city}` : "🏙️ Ville à confirmer"}
                        </span>
                        <span className="ml-auto inline-flex items-center gap-1 font-semibold text-slate-900">
                          Voir les détails{" "}
                          <span className="transition group-hover:translate-x-0.5">
                            →
                          </span>
                        </span>
                      </div>
                    </div>
                  </button>
                </Card>
              );
            })
          )}
        </section>

        {/* Pagination */}
        {pagedEvents.length > 0 && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              Page{" "}
              <span className="font-semibold text-slate-900">{currentPage}</span>{" "}
              sur{" "}
              <span className="font-semibold text-slate-900">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={!canPrev}
                onClick={() => goToPage(currentPage - 1)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ← Précédent
              </button>

              <button
                disabled={!canNext}
                onClick={() => goToPage(currentPage + 1)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Suivant →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
