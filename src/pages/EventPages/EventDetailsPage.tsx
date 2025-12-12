import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type EventStatus = "ACTIVE" | "INACTIVE" | "CANCELLED" | "ENDED" | string;

type VenueDto = {
  id: number;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  postalCode: string;
};

type OrganizerDto = {
  id: string;
  companyName: string;
  phoneNumber: string;
  website?: string;
  contactEmail: string;
};

type EventDetailsDto = {
  id: number;
  name: string;
  description: string;
  date: string; // ISO
  ticketPrice: number;
  totalSeats: number;
  maxTicketsPerPerson: number;
  status: EventStatus;
  venue: VenueDto;
  organizer: OrganizerDto;
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "MAD",
  }).format(price);
}

function statusPill(status?: string) {
  const s = (status ?? "UNKNOWN").toUpperCase();
  const base =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold";
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

function buildCoverGradient(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  const h2 = (h + 24) % 360;
  return `linear-gradient(135deg, hsl(${h} 72% 92%), hsl(${h2} 72% 96%))`;
}

export const EventDetailsPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  
  const [event, setEvent] = useState<EventDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: Replace with your actual API base URL
        const response = await fetch(`/api/v1/event/${eventId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.statusText}`);
        }
        
        const data: EventDetailsDto = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleBuyTicket = () => {
    if (!event) return;
    // TODO: Navigate to ticket purchase page or open modal
    navigate(`/events/${event.id}/buy-ticket`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          <p className="mt-4 text-sm text-slate-600">Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Événement introuvable
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            {error || "L'événement que vous recherchez n'existe pas."}
          </p>
          <button
            onClick={() => navigate("/events")}
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  const cover = buildCoverGradient(String(event.id));
  const isAvailable = event.status === "ACTIVE";
  const availableSeats = event.totalSeats; // In a real app, subtract sold tickets

  return (
    <div className="min-h-screen bg-white">
      {/* Décor de fond premium subtil */}
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

      {/* Header avec navigation */}
      <header className="mx-auto max-w-6xl px-4 pt-6">
        <button
          onClick={() => navigate("/events")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <span>←</span> Retour aux événements
        </button>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 pb-12">
        {/* Hero Section */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] overflow-hidden">
          {/* Cover Image */}
          <div
            className="h-64 w-full bg-cover bg-center"
            style={{ backgroundImage: cover }}
            aria-hidden="true"
          />

          {/* Content */}
          <div className="p-8">
            {/* Title & Status */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {event.name}
                </h1>
                <p className="mt-2 text-base text-slate-600">
                  {formatDate(event.date)}
                </p>
              </div>
              <div className={statusPill(event.status)}>
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                {event.status}
              </div>
            </div>

            {/* Description */}
            <p className="mt-6 text-base text-slate-700 leading-relaxed">
              {event.description}
            </p>

            {/* Info Grid */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {/* Venue Info */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
                  📍 Lieu de l'événement
                </h3>
                <p className="font-semibold text-slate-900">{event.venue.name}</p>
                <p className="mt-1 text-sm text-slate-600">{event.venue.addressLine1}</p>
                {event.venue.addressLine2 && (
                  <p className="text-sm text-slate-600">{event.venue.addressLine2}</p>
                )}
                <p className="text-sm text-slate-600">
                  {event.venue.city}, {event.venue.postalCode}
                </p>
                <p className="text-sm text-slate-600">{event.venue.country}</p>
              </div>

              {/* Organizer Info */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
                  🏢 Organisateur
                </h3>
                <p className="font-semibold text-slate-900">{event.organizer.companyName}</p>
                <p className="mt-1 text-sm text-slate-600">
                  📞 {event.organizer.phoneNumber}
                </p>
                <p className="text-sm text-slate-600">
                  ✉️ {event.organizer.contactEmail}
                </p>
                {event.organizer.website && (
                  <a
                    href={event.organizer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    🌐 Site web →
                  </a>
                )}
              </div>
            </div>

            {/* Ticket Info & CTA */}
            <div className="mt-8 rounded-xl border-2 border-slate-900 bg-slate-50 p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-slate-900">
                      {formatPrice(event.ticketPrice)}
                    </span>
                    <span className="text-sm text-slate-600">par billet</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900">{availableSeats}</span>{" "}
                      places disponibles
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      Max{" "}
                      <span className="font-semibold text-slate-900">
                        {event.maxTicketsPerPerson}
                      </span>{" "}
                      billets par personne
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBuyTicket}
                  disabled={!isAvailable}
                  className="rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-900 transition"
                >
                  {isAvailable ? "Acheter un billet 🎫" : "Billets non disponibles"}
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">💡 Astuce :</span> Les billets sont sécurisés
                par NFT avec validation QR anti-fraude à l'entrée.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};