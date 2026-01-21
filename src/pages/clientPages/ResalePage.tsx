import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import type { TicketResaleOfferDto } from "@/types/resale";
import { createResaleOffer, listResaleOffers, registerResaleInterest } from "@/services/resale.service";
import api from "@/api";

interface TicketResponse {
    id: number;
    eventId: number;
    userId: string;
    ticketStatus: "AVAILABLE" | "USED" | "EXPIRED" | "RESALE";
    qrCode: string;
    createdAt: string;
}

interface EventListItemDto {
    id: number;
    name: string;
    venueName: string;
    city: string;
}

type Tab = "SELL" | "BROWSE";

export const ResalePage = () => {
    const { user, getUser } = useAuth();
    const [tab, setTab] = useState<Tab>("SELL");
    const [tickets, setTickets] = useState<TicketResponse[]>([]);
    const [offers, setOffers] = useState<TicketResaleOfferDto[]>([]);
    const [eventDetails, setEventDetails] = useState<Record<number, EventListItemDto>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (user?.id) {
            fetchData();
        }
    }, [user, tab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            if (tab === "SELL") {
                const response = await api.get(`/api/v1/tickets/user/${user?.id}`);
                const data: TicketResponse[] = response.data;
                // Only AVAILABLE tickets can be put for resale
                setTickets((data || []).filter((t) => t.ticketStatus === "AVAILABLE"));

                // Fetch event details for these tickets
                const uniqueEventIds = [...new Set(data.map(t => t.eventId))];
                const details: Record<number, EventListItemDto> = { ...eventDetails };

                await Promise.all(uniqueEventIds.map(async (id) => {
                    if (!details[id]) {
                        try {
                            const eventRes = await api.get(`/api/v1/event/${id}`);
                            details[id] = eventRes.data;
                        } catch (e) {
                            console.error(`Error fetching event ${id}`, e);
                        }
                    }
                }));
                setEventDetails(details);
            } else {
                const data = await listResaleOffers();
                setOffers(data || []);
            }
        } catch (e: any) {
            console.error("Error loading resale data:", e);
            setError(e.response?.data || "Erreur lors du chargement de la revente");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOffer = async (ticket: TicketResponse) => {
        try {
            if (!user?.id) return;
            await createResaleOffer(ticket.id, user.id);
            alert("Votre billet est désormais en revente. Les acheteurs intéressés seront sélectionnés aléatoirement.");
            fetchData();
        } catch (e: any) {
            console.error("Error creating resale offer:", e);
            alert(e.response?.data || "Impossible de mettre le billet en revente");
        }
    };

    const handleRegisterInterest = async (offer: TicketResaleOfferDto) => {
        try {
            if (!user?.id) return;
            await registerResaleInterest(offer.offerId, user.id);
            alert("Vous êtes inscrit pour ce billet. Lorsqu'il y aura assez de personnes, un acheteur sera choisi aléatoirement.");
        } catch (e: any) {
            console.error("Error registering interest:", e);
            alert(e.response?.data || "Impossible de vous inscrire pour ce billet");
        }
    };

    const isSell = tab === "SELL";

    return (
        <div className="min-h-screen bg-white relative">
            <BackgroundBlobs />

            <header className="mx-auto max-w-6xl px-4 pt-10 pb-6">
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
                            Revente de billets
                        </p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                            Échanger vos billets avec la communauté
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-600">
                            Mettez vos billets en revente ou achetez un billet revendu de manière anonyme et équitable.
                        </p>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => setTab("SELL")}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${isSell
                                ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            Mettre en vente
                        </button>
                        <button
                            onClick={() => setTab("BROWSE")}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${!isSell
                                ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            Voir les billets en revente
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 pb-20">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                    </div>
                ) : error ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {isSell ? (
                            tickets.length === 0 ? (
                                <div className="col-span-full py-20 text-center">
                                    <p className="text-slate-500 font-medium">Aucun billet disponible pour la revente.</p>
                                    <p className="text-sm text-slate-400 mt-1">Tes billets disponibles apparaîtront ici.</p>
                                </div>
                            ) : (
                                tickets.map((ticket: TicketResponse) => (
                                    <div
                                        key={ticket.id}
                                        className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    {eventDetails[ticket.eventId]?.name || `Événement #${ticket.eventId}`}
                                                </h3>
                                                <p className="text-sm text-slate-500">Billet #{ticket.id}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold ring-1 ring-emerald-200">
                                                {ticket.ticketStatus}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleCreateOffer(ticket)}
                                            className="w-full mt-4 bg-slate-900 text-white font-semibold py-2.5 rounded-xl hover:bg-slate-800 transition shadow-sm active:scale-[0.98]"
                                        >
                                            Mettre en revente
                                        </button>
                                    </div>
                                ))
                            )
                        ) : offers.length === 0 ? (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-slate-500 font-medium">Aucun billet en revente pour le moment.</p>
                                <p className="text-sm text-slate-400 mt-1">Reviens plus tard pour voir les nouvelles offres.</p>
                            </div>
                        ) : (
                            offers.map((offer: TicketResaleOfferDto) => (
                                <div
                                    key={offer.offerId}
                                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500"
                                >
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {offer.eventName || "Événement"}
                                        </h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                                            📍 {offer.venueName || "Lieu"} · 🏙️ {offer.city || "Ville"}
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4 mb-4">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Prix de rachat (incluant 3% de frais)
                                        </p>
                                        <p className="text-2xl font-black text-slate-900 mt-1">
                                            {parseFloat(offer.buyerPrice).toFixed(2)} MAD
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleRegisterInterest(offer)}
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-100 active:scale-[0.98]"
                                    >
                                        Je veux acheter ce billet
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};
