import { getOpenOrdersByUserId } from "@/services/order.service";
import { getQueueStatusesForUser } from "@/services/queue.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { QueueStatusResponse } from "@/types/queue";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";

export interface OrderDto {
  id: string;
  orderId?: string; // Some parts of the API use orderId
  eventId: number;
  eventTitle: string;
  ticketPrice: number;
  city: string;
  venueName: string;
  userId: string;
  status: string;
  totalPrice: number;
  numberOfTickets: number;
}

export const ReservationsPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [queueStatuses, setQueueStatuses] = useState<QueueStatusResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function buildCoverGradient(seed: string) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
    const h2 = (h + 24) % 360;
    return `linear-gradient(135deg, hsl(${h} 72% 92%), hsl(${h2} 72% 96%))`;
  }

  function statusPill(status: string) {
    const base =
      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold";
    switch (status) {
      case "OPEN":
      case "WAITING":
        return `${base} bg-amber-50 text-amber-700 ring-1 ring-amber-200`;
      case "CLOSED":
        return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`;
      case "CAN_BUY":
        return `${base} bg-blue-50 text-blue-700 ring-1 ring-blue-200`;
      case "CANCELLED":
        return `${base} bg-rose-50 text-rose-700 ring-1 ring-rose-200`;
      default:
        return `${base} bg-slate-50 text-slate-700 ring-1 ring-slate-200`;
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setError("Utilisateur non connecté");
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      const userId = user?.id;

      if (!userId) {
        setError("Utilisateur non connecté");
        return;
      }

      const [ordersData, queueData] = await Promise.all([
        getOpenOrdersByUserId(userId),
        getQueueStatusesForUser(userId)
      ]);

      setOrders(Array.isArray(ordersData) ? ordersData.filter(o => o.numberOfTickets > 0) : []);
      setQueueStatuses(Array.isArray(queueData) ? queueData : []);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (orderId: string, eventId: number, numTickets: number, price: number) => {
    const totalPrice = numTickets * price;
    const params = new URLSearchParams({
      orderId: orderId,
      tickets: String(numTickets),
      price: String(totalPrice),
    });

    navigate(`/client/events/${eventId}/buy-ticket?${params}`);
  };

  return (
    <div className="min-h-screen bg-white relative">
      <BackgroundBlobs />

      <header className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
              Billetterie NFT
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Mes Réservations {(orders.length > 0 || queueStatuses.length > 0) && `(${orders.length + queueStatuses.length})`}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Gérez vos places réservées et vos positions en file d'attente.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center">
            <h3 className="text-base font-semibold text-rose-900">Erreur</h3>
            <p className="mt-2 text-sm text-rose-700">{error}</p>
          </div>
        ) : orders.length === 0 && queueStatuses.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Aucune réservation en cours
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Vos réservations et positions en file d'attente apparaîtront ici.
            </p>
            <button
              onClick={() => navigate("/client/events")}
              className="mt-6 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Découvrir les événements
            </button>
          </div>
        ) : (
          <section className="grid gap-6">
            {/* Display Queue Statuses */}
            {queueStatuses.map((q, idx) => {
              const seed = String(q.eventId ?? q.eventName);
              const cover = buildCoverGradient(seed);
              return (
                <div
                  key={`queue-${idx}`}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm border-l-4 border-l-amber-400"
                >
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div
                      className="h-32 w-full md:h-40 md:w-40 shrink-0 rounded-xl border border-slate-100 bg-cover bg-center"
                      style={{ backgroundImage: cover }}
                    />
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">
                            {q.eventName || `Événement #${q.eventId}`}
                          </h2>
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                            <span>📍 {q.venueName || "Lieu à confirmer"}</span>
                            <span>🏙️ {q.city || "Ville à confirmer"}</span>
                          </div>
                        </div>
                        <div className={statusPill(q.state)}>
                          {q.state === "WAITING" ? "En file d'attente" : "Prêt pour achat"}
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        {q.state === "WAITING" ? (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 font-medium">Position dans la file</span>
                            <span className="text-xl font-bold text-slate-900">{q.peopleAhead ?? 0} personnes avant vous</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600 font-medium">Billets réservés</span>
                              <span className="font-bold text-slate-900">{q.reservedTickets || 1}</span>
                            </div>
                            <p className="text-xs text-blue-600 font-medium pt-2">
                              Votre tour est arrivé ! Vous pouvez maintenant procéder au paiement.
                            </p>
                          </div>
                        )}
                      </div>

                      {q.state === "CAN_BUY" && q.orderId && (
                        <button
                          onClick={() => handlePayment(q.orderId!, q.eventId, q.reservedTickets || 1, 0)} // Price from queue might need fetching or fallback
                          className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                        >
                          Procéder au paiement
                          <span>→</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Display Orders */}
            {orders.map((order) => {
              const seed = String(order.eventId ?? order.eventTitle);
              const cover = buildCoverGradient(seed);

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div
                      className="h-32 w-full md:h-40 md:w-40 shrink-0 rounded-xl border border-slate-100 bg-cover bg-center"
                      style={{ backgroundImage: cover }}
                    />

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">
                            {order.eventTitle}
                          </h2>
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                            <span>📍 {order.venueName || "Lieu à confirmer"}</span>
                            <span>🏙️ {order.city || "Ville à confirmer"}</span>
                          </div>
                        </div>
                        <div className={statusPill(order.status)}>
                          {order.status}
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 font-medium">Nombre de billets</span>
                          <span className="font-bold text-slate-900">
                            {order.numberOfTickets} × {(order.ticketPrice ?? 0).toFixed(2)} MAD
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                          <span className="text-slate-900 font-semibold">Total</span>
                          <span className="text-xl font-black text-slate-900">
                            {((order.numberOfTickets ?? 0) * (order.ticketPrice ?? 0)).toFixed(2)} MAD
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePayment(order.id, order.eventId, order.numberOfTickets, order.ticketPrice)}
                        className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-lg shadow-slate-100"
                      >
                        Procéder au paiement
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
};
