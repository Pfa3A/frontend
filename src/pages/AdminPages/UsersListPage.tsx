import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllUsers } from "@/services/admin.service";
import type { User } from "@/types/user";

const PAGE_SIZE = 10;

function rolePill(role: string) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold";
  switch (role) {
    case "ADMIN":
      return `${base} bg-purple-50 text-purple-700 ring-1 ring-purple-200`;
    case "ORGANIZER":
      return `${base} bg-blue-50 text-blue-700 ring-1 ring-blue-200`;
    case "CLIENT":
      return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`;
    default:
      return `${base} bg-slate-50 text-slate-700 ring-1 ring-slate-200`;
  }
}

function statusPill(activated: boolean) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold";
  return activated
    ? `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`
    : `${base} bg-amber-50 text-amber-700 ring-1 ring-amber-200`;
}

export const UsersListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get("page") ?? "1");
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const pageIndex = currentPage - 1;

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") ?? "ALL");

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = (searchParams.get("q") ?? "").trim().toLowerCase();
    const role = searchParams.get("role") ?? "ALL";

    let result = users;

    if (role !== "ALL") {
      result = result.filter((u) => u.role === role);
    }

    if (q) {
      result = result.filter((u) => {
        const hay = `${u.firstName} ${u.lastName} ${u.username} ${u.email}`.toLowerCase();
        return hay.includes(q);
      });
    }

    return result;
  }, [users, searchParams]);

  const totalElements = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / PAGE_SIZE));
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const pagedUsers = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageIndex]);

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    organizers: users.filter((u) => u.role === "ORGANIZER").length,
    clients: users.filter((u) => u.role === "CLIENT").length,
    activated: users.filter((u) => u.accountActivated).length,
  };

  const title = totalElements > 0 ? `Utilisateurs (${totalElements})` : "Utilisateurs";

  function goToPage(p: number) {
    const next = Math.min(Math.max(1, p), totalPages);
    const sp = new URLSearchParams();
    sp.set("page", String(next));
    const q = searchParams.get("q");
    const role = searchParams.get("role");
    if (q) sp.set("q", q);
    if (role && role !== "ALL") sp.set("role", role);
    setSearchParams(sp);
  }

  function onSubmitSearch(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    sp.set("page", "1");
    if (query.trim()) sp.set("q", query.trim());
    if (roleFilter !== "ALL") sp.set("role", roleFilter);
    setSearchParams(sp);
  }

  return (
    <div className="min-h-screen bg-white">
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

      <header className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-500">
              Administration
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Gérer tous les utilisateurs de la plateforme
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/create-organizer")}
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 active:scale-[0.99]"
          >
            + Ajouter un organisateur
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold text-slate-500">Total</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 shadow-[0_8px_30px_rgba(168,85,247,0.06)]">
            <p className="text-xs font-semibold text-purple-700">Admins</p>
            <p className="mt-1 text-2xl font-bold text-purple-900">{stats.admins}</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-[0_8px_30px_rgba(59,130,246,0.06)]">
            <p className="text-xs font-semibold text-blue-700">Organisateurs</p>
            <p className="mt-1 text-2xl font-bold text-blue-900">{stats.organizers}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-[0_8px_30px_rgba(16,185,129,0.06)]">
            <p className="text-xs font-semibold text-emerald-700">Clients</p>
            <p className="mt-1 text-2xl font-bold text-emerald-900">{stats.clients}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold text-slate-600">Activés</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.activated}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <form onSubmit={onSubmitSearch} className="w-full">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <span className="select-none text-slate-400">⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher par nom, email, username…"
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

          <div className="flex flex-wrap gap-2">
            {["ALL", "ADMIN", "ORGANIZER", "CLIENT"].map((role) => (
              <button
                key={role}
                onClick={() => {
                  setRoleFilter(role);
                  const sp = new URLSearchParams();
                  sp.set("page", "1");
                  if (query.trim()) sp.set("q", query.trim());
                  if (role !== "ALL") sp.set("role", role);
                  setSearchParams(sp);
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  roleFilter === role
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {role === "ALL" ? "Tous" : role}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm font-semibold text-rose-700">{error}</p>
          </div>
        )}

        {isLoading && !error && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <p className="text-sm text-slate-600">Chargement des utilisateurs…</p>
          </div>
        )}

        {/* Users Table */}
        <section>
          {!isLoading && pagedUsers.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <h3 className="text-base font-semibold text-slate-900">
                Aucun utilisateur trouvé
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Essaie de modifier ta recherche ou tes filtres.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setRoleFilter("ALL");
                  setSearchParams(new URLSearchParams({ page: "1" }));
                }}
                className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                      Utilisateur
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                      Rôle
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pagedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            @{user.username}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-700">{user.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className={rolePill(user.role)}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                          {user.role}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={statusPill(user.accountActivated)}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                          {user.accountActivated ? "Activé" : "En attente"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Pagination */}
        {!isLoading && pagedUsers.length > 0 && (
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