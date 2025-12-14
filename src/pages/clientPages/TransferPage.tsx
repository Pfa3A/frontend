// TicketTransferPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { useAuth } from "@/contexts/AuthContext";

const PAGE_SIZE = 10;
const API_BASE_URL = "http://localhost:8080/api/v1";

interface TicketResponse {
  id: number;
  eventId: number;
  userId: string;
  ticketStatus: "AVAILABLE" | "USED" | "EXPIRED";
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

interface EventListItemDto {
  id: number;
  name: string;
  date: string;
  venueName: string;
  ticketPrice: number;
  status: string;
  description: string;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function statusPill(status: string) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold";
  switch (status) {
    case "AVAILABLE":
      return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`;
    case "USED":
      return `${base} bg-slate-50 text-slate-700 ring-1 ring-slate-200`;
    case "EXPIRED":
      return `${base} bg-rose-50 text-rose-700 ring-1 ring-rose-200`;
    default:
      return `${base} bg-amber-50 text-amber-700 ring-1 ring-amber-200`;
  }
}

export const TicketTransferPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [eventDetails, setEventDetails] = useState<Record<number, EventListItemDto>>({});
  const [selectedTicket, setSelectedTicket] = useState<TicketResponse | null>(null);
  const [recipientId, setRecipientId] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {user,getUser} = useAuth();

  useEffect(() => {
  getUser();
}, []);

useEffect(() => {
  if (user?.id) {
    fetchUserTickets();
  }
}, [user]);



  const fetchUserTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/user/${user?.id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Erreur lors du chargement des billets");

      const data: TicketResponse[] = await response.json();
      setTickets(data);

      const uniqueEventIds = [...new Set(data.map(t => t.eventId))];
      const eventDetailsMap: Record<number, EventListItemDto> = {};

      await Promise.all(
        uniqueEventIds.map(async (eventId) => {
          try {
            const eventResponse = await fetch(`${API_BASE_URL}/event/${eventId}`, {
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            });
            if (eventResponse.ok) {
              const eventData = await eventResponse.json();
              eventDetailsMap[eventId] = eventData;
            }
          } catch (err) {
            console.error(`Error fetching event ${eventId}:`, err);
          }
        })
      );

      setEventDetails(eventDetailsMap);
    } catch (err: any) {
      console.error("Error fetching tickets:", err);
      setTransferError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferTicket = async () => {
    if (!selectedTicket || !recipientId.trim()) return;

    setTransferLoading(true);
    setTransferError(null);
    setTransferSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/tickets/transfer`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          newOwnerId: recipientId.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors du transfert du billet");
      }

      setTickets(prev => prev.filter(t => t.id !== selectedTicket.id));
      setTransferSuccess(true);
      setSelectedTicket(null);
      setRecipientId("");
      
      setTimeout(() => setTransferSuccess(false), 3000);
    } catch (err: any) {
      setTransferError(err.message || "Erreur lors du transfert du billet");
    } finally {
      setTransferLoading(false);
    }
  };

  const availableTickets = tickets.filter(t => t.ticketStatus === "AVAILABLE");
  const totalPages = Math.max(1, Math.ceil(availableTickets.length / PAGE_SIZE));
  const pageIndex = currentPage - 1;
  const pagedTickets = availableTickets.slice(
    pageIndex * PAGE_SIZE,
    (pageIndex + 1) * PAGE_SIZE
  );

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
      </div>

      <header className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            ← Retour
          </button>
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-500">
              Mes Billets NFT
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Transférer un Billet
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Sélectionne un billet disponible et entre l'ID du destinataire pour effectuer le transfert.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {transferSuccess && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-[0_8px_30px_rgba(16,185,129,0.08)]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="font-semibold text-emerald-900">Transfert réussi !</h3>
                <p className="text-sm text-emerald-700">
                  Le billet a été transféré avec succès.
                </p>
              </div>
            </div>
          </div>
        )}

        {transferError && !transferLoading && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-[0_8px_30px_rgba(244,63,94,0.08)]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠</span>
              <div>
                <h3 className="font-semibold text-rose-900">Erreur</h3>
                <p className="text-sm text-rose-700">{transferError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Mes billets disponibles ({availableTickets.length})
            </h2>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <p className="text-slate-600">Chargement...</p>
              </div>
            ) : pagedTickets.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <h3 className="text-base font-semibold text-slate-900">
                  Aucun billet disponible
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Tu n'as pas de billets disponibles pour le transfert.
                </p>
                <button
                  onClick={() => navigate("/client/events")}
                  className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Parcourir les événements
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {pagedTickets.map((ticket) => {
                  const event = eventDetails[ticket.eventId];
                  const isSelected = selectedTicket?.id === ticket.id;

                  return (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`group rounded-2xl border p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_50px_rgba(15,23,42,0.10)] focus:outline-none focus:ring-2 focus:ring-slate-900/15 ${
                        isSelected
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-slate-900">
                            {event?.name || `Événement #${ticket.eventId}`}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            {event?.date ? formatDate(event.date) : "Date inconnue"}
                          </p>
                          {event?.venueName && (
                            <p className="mt-1 text-xs text-slate-500">
                              📍 {event.venueName}
                            </p>
                          )}
                        </div>
                        <div className={statusPill(ticket.ticketStatus)}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                          {ticket.ticketStatus}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                        <span className="text-xs text-slate-500">
                          Billet #{ticket.id}
                        </span>
                        {isSelected && (
                          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                            Sélectionné
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {pagedTickets.length > 0 && totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Page {currentPage} sur {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ← Précédent
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Suivant →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <h2 className="text-lg font-semibold text-slate-900">
                Détails du transfert
              </h2>

              {selectedTicket ? (
                <div className="mt-4 space-y-4">
                  <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <p className="text-xs font-semibold text-slate-500">
                      Billet sélectionné
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {eventDetails[selectedTicket.eventId]?.name || `Billet #${selectedTicket.id}`}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      ID: {selectedTicket.id}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900">
                      ID du destinataire
                    </label>
                    <input
                      type="text"
                      value={recipientId}
                      onChange={(e) => setRecipientId(e.target.value)}
                      placeholder="UUID du nouveau propriétaire"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Entre l'identifiant unique de l'utilisateur qui recevra le billet.
                    </p>
                  </div>

                  <button
                    onClick={handleTransferTicket}
                    disabled={!recipientId.trim() || transferLoading}
                    className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
                  >
                    {transferLoading ? "Transfert en cours..." : "Transférer le billet"}
                  </button>
                </div>
              ) : (
                <div className="mt-6 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <span className="text-2xl">🎫</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Sélectionne un billet pour commencer le transfert.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ===================================
// MyTicketsPage.tsx - Page with QR Code display and download
// ===================================

const QRCodeDisplay: React.FC<{ ticket: TicketResponse; eventName?: string }> = ({ ticket, eventName }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (showQR && ticket.qrCode) {
      QRCode.toDataURL(ticket.qrCode, {
        width: 300,
        margin: 2,
        color: {
          dark: "#0F172A",
          light: "#FFFFFF",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("Error generating QR code:", err));
    }
  }, [showQR, ticket.qrCode]);

  const downloadQRCode = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement("a");
    link.download = `ticket-${ticket.id}-qr.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const downloadTicketPDF = async () => {
    // Create a simple ticket HTML for download
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 40px; 
              max-width: 600px; 
              margin: 0 auto;
            }
            .ticket {
              border: 2px solid #0F172A;
              border-radius: 16px;
              padding: 32px;
              background: white;
            }
            .header { 
              text-align: center; 
              margin-bottom: 32px;
              border-bottom: 2px dashed #CBD5E1;
              padding-bottom: 24px;
            }
            .title { 
              font-size: 28px; 
              font-weight: bold; 
              color: #0F172A;
              margin: 0 0 8px 0;
            }
            .event-name {
              font-size: 20px;
              color: #475569;
              margin: 0;
            }
            .qr-container { 
              text-align: center; 
              margin: 24px 0;
            }
            .qr-container img {
              max-width: 300px;
              border: 1px solid #E2E8F0;
              border-radius: 8px;
              padding: 16px;
            }
            .info {
              margin-top: 24px;
              padding-top: 24px;
              border-top: 2px dashed #CBD5E1;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 14px;
            }
            .label {
              color: #64748B;
              font-weight: 600;
            }
            .value {
              color: #0F172A;
              font-weight: 500;
            }
            .status {
              display: inline-block;
              padding: 6px 16px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              background: #D1FAE5;
              color: #065F46;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h1 class="title">🎫 Billet NFT</h1>
              <p class="event-name">${eventName || `Événement #${ticket.eventId}`}</p>
            </div>
            
            <div class="qr-container">
              <img src="${qrDataUrl}" alt="QR Code" />
            </div>
            
            <div class="info">
              <div class="info-row">
                <span class="label">Billet ID:</span>
                <span class="value">#${ticket.id}</span>
              </div>
              <div class="info-row">
                <span class="label">Statut:</span>
                <span class="status">${ticket.ticketStatus}</span>
              </div>
              <div class="info-row">
                <span class="label">Créé le:</span>
                <span class="value">${formatDate(ticket.createdAt)}</span>
              </div>
              <div class="info-row">
                <span class="label">Code QR:</span>
                <span class="value" style="font-family: monospace; font-size: 11px;">${ticket.qrCode}</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([ticketHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `ticket-${ticket.id}.html`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-3 space-y-3">
      <button
        onClick={() => setShowQR(!showQR)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
      >
        {showQR ? "Masquer le QR Code" : "Afficher le QR Code"}
      </button>

      {showQR && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          {qrDataUrl ? (
            <>
              <div className="flex justify-center">
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="rounded-lg border border-slate-200"
                  style={{ width: "200px", height: "200px" }}
                />
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={downloadQRCode}
                  className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  📥 Télécharger QR
                </button>
                <button
                  onClick={downloadTicketPDF}
                  className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  📄 Télécharger Billet
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-slate-500">
                Code: {ticket.qrCode}
              </p>
            </>
          ) : (
            <p className="text-center text-sm text-slate-600">Génération du QR code...</p>
          )}
        </div>
      )}
    </div>
  );
};
