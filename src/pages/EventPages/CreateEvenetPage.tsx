import React, { useState } from "react";
import type { CreateEventDto } from "../../types/Event";
import type { CreateVenueDto, CreatedVenueDto } from "../../types/Venue";
import { EventService, VenueService } from "../../services/event.service";

export default function CreateEventPage() {
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);
  const [isSubmittingVenue, setIsSubmittingVenue] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [venueError, setVenueError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);
  const [venueSuccess, setVenueSuccess] = useState(false);

  const [createdVenue, setCreatedVenue] = useState<CreatedVenueDto | null>(null);

  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
    ticketPrice: 0,
    totalSeats: 0,
    maxTicketsPerPerson: 1,
  });

  const [venueData, setVenueData] = useState<CreateVenueDto>({
    name: "",
    addressLine1: "",
    city: "",
    country: "",
  });

  const handleEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleVenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVenueData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEvent = () => {
    if (!eventData.name.trim()) return "Le nom de l’événement est obligatoire";
    if (!eventData.description.trim()) return "La description de l’événement est obligatoire";
    if (!eventData.date) return "La date de l’événement est obligatoire";
    if (!createdVenue?.id) return "Veuillez d’abord créer un lieu (le lieu est obligatoire)";
    if (eventData.ticketPrice < 0) return "Le prix du ticket ne peut pas être négatif";
    if (eventData.totalSeats <= 0) return "Le nombre total de places doit être supérieur à 0";
    if (eventData.maxTicketsPerPerson <= 0)
      return "Le nombre max de tickets par personne doit être supérieur à 0";
    return null;
  };

  const validateVenue = () => {
    if (!venueData.name.trim()) return "Le nom du lieu est obligatoire";
    if (!venueData.addressLine1.trim()) return "L’adresse (rue) est obligatoire";
    if (!venueData.city.trim()) return "La ville est obligatoire";
    if (!venueData.country.trim()) return "Le pays est obligatoire";
    return null;
  };

  const handleCreateVenue = async () => {
    setVenueError(null);
    setVenueSuccess(false);
    setCreatedVenue(null);

    const vErr = validateVenue();
    if (vErr) {
      setVenueError(vErr);
      return;
    }

    setIsSubmittingVenue(true);
    try {
      const v = await VenueService.createVenue(venueData);
      setCreatedVenue(v);
      setVenueSuccess(true);
    } catch (err) {
      setVenueError(err instanceof Error ? err.message : "Une erreur s’est produite");
    } finally {
      setIsSubmittingVenue(false);
    }
  };

  const handleCreateEvent = async () => {
    setError(null);
    setSuccess(false);

    const eErr = validateEvent();
    if (eErr) {
      setError(eErr);
      return;
    }

    setIsSubmittingEvent(true);
    try {
      const payload: CreateEventDto = {
        name: eventData.name,
        description: eventData.description,
        date: eventData.date,
        venueId: createdVenue!.id, // injecté automatiquement
        ticketPrice: eventData.ticketPrice,
        totalSeats: eventData.totalSeats,
        maxTicketsPerPerson: eventData.maxTicketsPerPerson,
      };

      await EventService.createEvent(payload);

      setSuccess(true);
      setTimeout(() => {
        setEventData({
          name: "",
          description: "",
          date: "",
          ticketPrice: 0,
          totalSeats: 0,
          maxTicketsPerPerson: 1,
        });
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s’est produite");
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Décoration de fond */}
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

      <header className="mx-auto max-w-4xl px-4 pt-10 pb-6">
        <div>
          <p className="text-sm font-semibold tracking-wide text-slate-500">
            Billetterie NFT
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Créer un nouvel événement
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Créez d’abord un lieu (ci-dessous), puis créez votre événement.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-12">
        <div className="space-y-6">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-700">
                ✓ Événement créé avec succès !
              </p>
            </div>
          )}

          {/* Détails de l’événement */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
                1
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Détails de l’événement
                </h2>
                <p className="text-sm text-slate-600">
                  Le lieu est défini automatiquement après sa création.
                </p>
              </div>
            </div>

            {createdVenue ? (
              <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Lieu sélectionné : {createdVenue.name} (ID {createdVenue.id})
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCreatedVenue(null);
                    setVenueSuccess(false);
                  }}
                  className="mt-2 text-sm font-semibold text-slate-900 underline"
                >
                  Changer de lieu
                </button>
              </div>
            ) : (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-800">
                  Veuillez créer un lieu ci-dessous avant de créer l’événement.
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-900">
                  Nom de l’événement *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={eventData.name}
                  onChange={handleEventChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-900">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={eventData.description}
                  onChange={handleEventChange}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-slate-900">
                  Date et heure *
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleEventChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div>
                <label htmlFor="ticketPrice" className="block text-sm font-semibold text-slate-900">
                  Prix du ticket (MAD) *
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    MAD
                  </span>
                  <input
                    type="number"
                    id="ticketPrice"
                    name="ticketPrice"
                    min="0"
                    step="0.01"
                    value={eventData.ticketPrice}
                    onChange={handleEventChange}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-16 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="totalSeats" className="block text-sm font-semibold text-slate-900">
                    Nombre total de places *
                  </label>
                  <input
                    type="number"
                    id="totalSeats"
                    name="totalSeats"
                    min="1"
                    value={eventData.totalSeats}
                    onChange={handleEventChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="maxTicketsPerPerson"
                    className="block text-sm font-semibold text-slate-900"
                  >
                    Max tickets par personne *
                  </label>
                  <input
                    type="number"
                    id="maxTicketsPerPerson"
                    name="maxTicketsPerPerson"
                    min="1"
                    value={eventData.maxTicketsPerPerson}
                    onChange={handleEventChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informations du lieu */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
                2
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Informations du lieu</h2>
                <p className="text-sm text-slate-600">
                  Créez un lieu, puis l’événement l’utilisera automatiquement.
                </p>
              </div>
            </div>

          {venueError && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
                <p className="text-sm font-semibold text-rose-700">{venueError}</p>
              </div>
            )}

            {venueSuccess && createdVenue && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-700">
                  ✓ Lieu créé avec succès ! (ID {createdVenue.id})
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="venueName" className="block text-sm font-semibold text-slate-900">
                  Nom du lieu *
                </label>
                <input
                  type="text"
                  id="venueName"
                  name="name"
                  value={venueData.name}
                  onChange={handleVenueChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div>
                <label htmlFor="addressLine1" className="block text-sm font-semibold text-slate-900">
                  Adresse (rue) *
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={venueData.addressLine1}
                  onChange={handleVenueChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-slate-900">
                    Ville *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={venueData.city}
                    onChange={handleVenueChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-semibold text-slate-900">
                    Pays *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={venueData.country}
                    onChange={handleVenueChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setVenueData({
                      name: "",
                      addressLine1: "",
                      city: "",
                      country: "",
                    });
                    setVenueError(null);
                    setVenueSuccess(false);
                    setCreatedVenue(null);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 active:scale-[0.99]"
                >
                  Effacer le lieu
                </button>

                <button
                  type="button"
                  onClick={handleCreateVenue}
                  disabled={isSubmittingVenue}
                  className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
                >
                  {isSubmittingVenue ? "Création du lieu..." : "Créer le lieu"}
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setEventData({
                  name: "",
                  description: "",
                  date: "",
                  ticketPrice: 0,
                  totalSeats: 0,
                  maxTicketsPerPerson: 1,
                });
                setVenueData({
                  name: "",
                  addressLine1: "",
                  city: "",
                  country: "",
                });
                setError(null);
                setVenueError(null);
                setSuccess(false);
                setVenueSuccess(false);
                setCreatedVenue(null);
              }}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 active:scale-[0.99]"
            >
              Tout effacer
            </button>

            <button
              type="button"
              onClick={handleCreateEvent}
              disabled={isSubmittingEvent || !createdVenue}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
            >
              {isSubmittingEvent ? "Création de l’événement..." : "Créer l’événement"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
