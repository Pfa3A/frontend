import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, type FormEvent } from "react";
import { type StripeCardElementOptions } from "@stripe/stripe-js";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { buyTickets } from "@/services/ticket.service";

export interface PaymentRequest {
    eventId: number,
    orderId: string,
    createTicketRequest: CreateTicketRequest,
    price: number;
    method: string;
    numberOfTickets: number;
    paymentMethodId: string;
    idempotencyKey: string;
}

export interface CreateTicketRequest {
    eventId: number,
    userId: string
}


export interface TicketPaymentResponse {
    message: string,
    qrCodes: String[]
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
                color: "#424770",
                "::placeholder": {
                    color: "#aab7c4",
                },
            },
            invalid: { color: "#9e2146" },
        },
    };

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

        setLoading(true);

        try {
            const {
                error: pmError,
                paymentMethod,
            } = await stripe.createPaymentMethod({
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

            const totalPrice = price * tickets;
            if (!orderId) {
                setError("Missing orderId. Refresh or start the purchase again.");
                return;
            }

            const createTicketRequest: CreateTicketRequest = { eventId: eventId, userId: userId };


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
                console.log("QR codes:", data.qrCodes);

                navigate(`/client/events/${eventId}/tickets-success`, {
                    state: { qrCodes: data.qrCodes }
                });
            } else {
                setError(response.message || "Le paiement a échoué.");
            }


        } catch (err) {
            console.error(err);
            setError("Erreur réseau. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    const title = "Paiement du ticket";

    const buttonLabel = `Payer le ticket – ${price.toFixed(2)} MAD`;

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg space-y-6">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                            {title}
                        </h1>
                        <p className="text-sm text-slate-500">
                            Saisissez vos informations et validez votre paiement sécurisé
                            FastBus.
                        </p>
                    </div>

                    <div className="inline-flex items-center rounded-full bg-sky-50 px-4 py-1 text-xs font-medium text-[#0071BC] border border-sky-100">
                        Étape 2 : Paiement sécurisé
                    </div>
                </header>

                {/* Card */}
                <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-md p-6 md:p-7">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Nom complet
                            </label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC] focus:border-[#0071BC]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Adresse e-mail
                            </label>
                            <input
                                type="email"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071BC] focus:border-[#0071BC]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Informations de carte
                            </label>
                            <div className="p-3 border border-slate-300 rounded-lg bg-slate-50">
                                <CardElement options={cardElementOptions} />
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 font-medium">{error}</p>
                        )}
                        {success && (
                            <p className="text-sm text-green-600 font-medium">
                                Paiement effectué avec succès !
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={!stripe || loading}
                            className="w-full inline-flex items-center justify-center rounded-full bg-[#0071BC] text-white py-3 text-sm font-semibold hover:bg-[#005c96] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Traitement en cours..." : buttonLabel}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default CheckoutForm;