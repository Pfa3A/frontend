import { getOpenOrdersByUserId } from "@/services/order.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface OrderDto {
  id: string;
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



export const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDto[]>([]);
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
        return `${base} bg-amber-50 text-amber-700 ring-1 ring-amber-200`;
      case "CLOSED":
        return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`;
      case "CANCELLED":
        return `${base} bg-rose-50 text-rose-700 ring-1 ring-rose-200`;
      default:
        return `${base} bg-slate-50 text-slate-700 ring-1 ring-slate-200`;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?.id;

        if (!userId) {
          setError("Utilisateur non connecté");
          return;
        }

        const ordersData = await getOpenOrdersByUserId(userId);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        console.log(ordersData)
        // Calculate totalPrice from numberOfTickets * ticketPrice
       

      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erreur lors du chargement des commandes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePayment = (order: OrderDto) => {
    const totalPrice = order.numberOfTickets * order.ticketPrice;
    const params = new URLSearchParams({
      orderId: order.id,
      tickets: String(order.numberOfTickets),
      price: String(totalPrice),
    });

    navigate(`/client/events/${order.eventId}/buy-ticket?${params}`);
  };

  if (loading) return <p>Chargement des commandes...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (orders.length === 0) {
    return (
      <div className="text-center p-10">
        <h2 className="text-xl font-semibold">Aucune commande disponible</h2>
        <p className="mt-2 text-gray-500">
          Vous n'avez pas encore de commandes. Découvrez nos événements pour acheter vos billets.
        </p>
        <button
          className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
          onClick={() => navigate("/client/events")}
        >
          Explorer les événements
        </button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white">
      {/* Background decoration */}
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
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-500">
              Billetterie NFT
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Mes Commandes {orders.length > 0 && `(${orders.length})`}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Finalisez vos commandes en attente pour obtenir vos billets NFT.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <p className="text-sm text-slate-600">Chargement des commandes...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <h3 className="text-base font-semibold text-rose-900">Erreur</h3>
            <p className="mt-2 text-sm text-rose-700">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <h3 className="text-base font-semibold text-slate-900">
              Aucune commande en attente
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Vos commandes apparaîtront ici une fois créées.
            </p>
            <button
              onClick={() => navigate("/client/events")}
              className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Découvrir les événements
            </button>
          </div>
        ) : (
          <section className="grid gap-4">
            {orders.map((order) => {
              const seed = String(order.eventId ?? order.eventTitle);
              const cover = buildCoverGradient(seed);

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex flex-col gap-6 md:flex-row">
                    {/* Event Image */}
                    <div
                      className="h-32 w-full md:h-40 md:w-40 shrink-0 rounded-xl border border-slate-200 bg-cover bg-center"
                      style={{ backgroundImage: cover }}
                      aria-hidden="true"
                    />

                    {/* Order Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">
                            {order.eventTitle}
                          </h2>
                        </div>
                        <div className={statusPill(order.status)}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                          {order.status}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                          📍 {order.venueName ?? "Lieu à confirmer"}
                        </span>
                        <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                          {order.city ? `🏙️ ${order.city}` : "🏙️ Ville à confirmer"}
                        </span>
                      </div>

                      {/* Order Summary */}
                      <div className="rounded-xl bg-slate-50 p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Nombre de billets</span>
                          <span className="font-semibold text-slate-900">
                            {order.numberOfTickets} × {(order.ticketPrice ?? 0).toFixed(2)} MAD
                          </span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                          <span className="font-medium text-slate-900">Total</span>
                          <span className="text-lg font-bold text-slate-900">
                            {((order.numberOfTickets ?? 0) * (order.ticketPrice ?? 0)).toFixed(2)} MAD
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handlePayment(order)}
                        className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                      >
                        Procéder au paiement
                        <span className="text-base">→</span>
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
