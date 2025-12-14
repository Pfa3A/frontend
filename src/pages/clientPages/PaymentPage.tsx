import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, type FormEvent } from "react";
import { type StripeCardElementOptions } from "@stripe/stripe-js";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { buyTickets } from "@/services/ticket.service";

export interface PaymentRequest {
  eventId: number;
  orderId: string;
  createTicketRequest: CreateTicketRequest;
  price: number;
  method: string;
  numberOfTickets: number;
  paymentMethodId: string;
  idempotencyKey: string;
}

export interface CreateTicketRequest {
  eventId: number;
  userId: string;
}

export interface TicketPaymentResponse {
  message: string;
  qrCodes: String[];
}

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const userId = user?.id || "";
  const [searchParams] = useSearchParams();
  const { id: eventIdParam } = useParams();

  const eventId = Number(eventIdParam);
  const orderId = searchParams.get("orderId")!;
  const tickets = Number(searchParams.get("tickets") || "0");
  const price = parseFloat(searchParams.get("price") || "0");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const cardElementOptions: StripeCardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#0f172a",
        "::placeholder": { color: "#94a3b8" },
      },
      invalid: { color: "#9e2146" },
    },
  };

  const totalPrice = price * tickets;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!stripe || !elements) {
      setError("Stripe n'est pas chargé.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Le champ de carte bancaire est introuvable.");
      return;
    }

    if (!orderId) {
      setError("Missing orderId. Refresh or start the purchase again.");
      return;
    }

    setLoading(true);

    try {
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: customerName,
          email: customerEmail,
        },
      });

      if (pmError) {
        setError(pmError.message || "La création du moyen de paiement a échoué.");
        return;
      }

      if (!paymentMethod) {
        setError("Le moyen de paiement est indisponible.");
        return;
      }

      const createTicketRequest: CreateTicketRequest = { eventId, userId };

      const paymentRequest: PaymentRequest = {
        orderId,
        eventId,
        createTicketRequest,
        price: totalPrice,
        numberOfTickets: tickets,
        method: "CREDIT_CARD",
        paymentMethodId: paymentMethod.id,
        idempotencyKey: crypto.randomUUID(),
      };

      const response = await buyTickets(paymentRequest);
      const data = response as TicketPaymentResponse;

      if (data.message === "Ticket is Bought Successfully") {
        setSuccess(true);

        navigate(`/client/events/${eventId}/tickets-success`, {
          state: { qrCodes: data.qrCodes },
        });
      } else {
        // @ts-ignore (depending on your service return type)
        setError((response as any)?.message || "Le paiement a échoué.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Background decoration (same as ProfilePage) */}
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
      </div>

      {/* Header (same structure) */}
      <header className="mx-auto max-w-4xl px-4 pt-10 pb-6">
        <div>
          <p className="text-sm font-semibold tracking-wide text-slate-500">
            NFT Ticketing
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Paiement
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Saisissez vos informations et validez votre paiement sécurisé.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-12">
        <div className="space-y-6">
          {/* Error Message (same style as ProfilePage) */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-700">{error}</p>
            </div>
          )}

          {/* Success Message (matching style) */}
          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-700">
                Paiement effectué avec succès !
              </p>
            </div>
          )}

          {/* Section 1: Payment details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
                1
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Informations de paiement
                </h2>
                <p className="text-sm text-slate-600">
                  Paiement par carte bancaire
                </p>
              </div>
            </div>

            {/* Summary row */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Total à payer
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {Number.isFinite(totalPrice) ? totalPrice.toFixed(2) : "0.00"}{" "}
                  MAD
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                {tickets} ticket(s) × {price.toFixed(2)} MAD
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-[#0071BC]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-[#0071BC]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900">
                  Informations de carte
                </label>

                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <CardElement options={cardElementOptions} />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Vos informations sont sécurisées et traitées par Stripe.
                </p>
              </div>

              <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Traitement en cours..." : `Payer ${totalPrice.toFixed(2)} MAD`}
              </button>
            </form>
          </div>

          {/* Section 2: Optional help / info (same “step” styling) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
                2
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Récapitulatif
                </h2>
                <p className="text-sm text-slate-600">
                  Vérifiez avant de confirmer
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-semibold text-slate-900">
                  Event ID
                </span>
                <span className="text-sm text-slate-700">{eventId}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-semibold text-slate-900">
                  Order ID
                </span>
                <span className="text-sm text-slate-700 font-mono">{orderId}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-semibold text-slate-900">
                  Nombre de tickets
                </span>
                <span className="text-sm text-slate-700">{tickets}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutForm;