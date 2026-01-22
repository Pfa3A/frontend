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

export const MyTicketsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [eventDetails, setEventDetails] = useState<Record<number, EventListItemDto>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "USED" | "EXPIRED">("ALL");


  const { user, getUser } = useAuth();

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
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = filter === "ALL"
    ? tickets
    : tickets.filter(t => t.ticketStatus === filter);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE));
  const pageIndex = currentPage - 1;
  const pagedTickets = filteredTickets.slice(
    pageIndex * PAGE_SIZE,
    (pageIndex + 1) * PAGE_SIZE
  );

  const stats = {
    total: tickets.length,
    available: tickets.filter(t => t.ticketStatus === "AVAILABLE").length,
    used: tickets.filter(t => t.ticketStatus === "USED").length,
    expired: tickets.filter(t => t.ticketStatus === "EXPIRED").length,
  };

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
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-500">
              Mes Billets NFT
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Mes Billets ({tickets.length})
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Consulte tous tes billets, vérifie leur statut, affiche les QR codes et transfère-les à d'autres utilisateurs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <p className="text-xs font-semibold text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-[0_8px_30px_rgba(16,185,129,0.06)]">
              <p className="text-xs font-semibold text-emerald-700">Disponibles</p>
              <p className="mt-1 text-2xl font-bold text-emerald-900">{stats.available}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <p className="text-xs font-semibold text-slate-600">Utilisés</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.used}</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-[0_8px_30px_rgba(244,63,94,0.06)]">
              <p className="text-xs font-semibold text-rose-700">Expirés</p>
              <p className="mt-1 text-2xl font-bold text-rose-900">{stats.expired}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="mx-auto max-w-6xl px-4 pb-6">
        <div className="flex flex-wrap gap-2">
          {(["ALL", "AVAILABLE", "USED", "EXPIRED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition
                ${filter === status
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
            >
              {status === "ALL"
                ? "Tous"
                : status === "AVAILABLE"
                  ? "Disponibles"
                  : status === "USED"
                    ? "Utilisés"
                    : "Expirés"}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets list */}
      <main className="mx-auto max-w-6xl px-4 pb-20">
        {loading ? (
          <p className="text-center text-slate-600">Chargement des billets...</p>
        ) : pagedTickets.length === 0 ? (
          <p className="text-center text-slate-500">
            Aucun billet trouvé pour ce filtre.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {pagedTickets.map((ticket) => {
              const event = eventDetails[ticket.eventId];

              return (
                <div
                  key={ticket.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      {event?.name || `Événement #${ticket.eventId}`}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Billet #{ticket.id}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold
                        ${ticket.ticketStatus === "AVAILABLE"
                          ? "bg-emerald-100 text-emerald-800"
                          : ticket.ticketStatus === "USED"
                            ? "bg-slate-200 text-slate-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                    >
                      {ticket.ticketStatus}
                    </span>

                    <button
                      onClick={() => navigate(`/client/events/${ticket.eventId}`)}
                      className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                      Voir événement →
                    </button>
                  </div>

                  {/* QR Code */}
                  {ticket.ticketStatus === "AVAILABLE" && (
                    <QRCodeDisplay
                      ticket={ticket}
                      eventName={event?.name}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-9 w-9 rounded-lg text-sm font-semibold
                  ${currentPage === i + 1
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
