import React, { useState } from "react";

type CreateEventDto = {
  name: string;
  description: string;
  date: string;
  venueId: number;
  ticketPrice: number;
  totalSeats: number;
  maxTicketsPerPerson: number;
};

type CreateVenueDto = {
  name: string;
  addressLine1: string;
  city: string;
  country: string;
};

export default function CreateEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
    ticketPrice: 0,
    totalSeats: 0,
    maxTicketsPerPerson: 1,
  });

  const [venueData, setVenueData] = useState({
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

  const handleVenueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setVenueData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    // Validation
    if (!eventData.name.trim()) {
      setError("Event name is required");
      return;
    }
    if (!eventData.description.trim()) {
      setError("Event description is required");
      return;
    }
    if (!eventData.date) {
      setError("Event date is required");
      return;
    }
    if (!venueData.name.trim()) {
      setError("Venue name is required");
      return;
    }
    if (!venueData.addressLine1.trim()) {
      setError("Street address is required");
      return;
    }
    if (!venueData.city.trim()) {
      setError("City is required");
      return;
    }
    if (!venueData.country.trim()) {
      setError("Country is required");
      return;
    }
    if (eventData.totalSeats <= 0) {
      setError("Total seats must be greater than 0");
      return;
    }
    if (eventData.maxTicketsPerPerson <= 0) {
      setError("Max tickets per person must be greater than 0");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create venue first
      const venueResponse = await fetch("/api/v1/venue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venueData),
      });

      if (!venueResponse.ok) {
        throw new Error("Failed to create venue");
      }

      const createdVenue = await venueResponse.json();
      const venueId = createdVenue.id;

      // Step 2: Create event with the venue ID
      const eventPayload: CreateEventDto = {
        name: eventData.name,
        description: eventData.description,
        date: eventData.date,
        venueId: venueId,
        ticketPrice: eventData.ticketPrice,
        totalSeats: eventData.totalSeats,
        maxTicketsPerPerson: eventData.maxTicketsPerPerson,
      };

      const eventResponse = await fetch("/api/v1/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventPayload),
      });

      if (!eventResponse.ok) {
        throw new Error("Failed to create event");
      }

      const createdEvent = await eventResponse.json();
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
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
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-32 -left-24 h-80 w-80 rounded-full blur-3xl opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.18), rgba(59,130,246,0))",
          }}
        />
        <div
          className="absolute -top-24 right-0 h-72 w-72 rounded-full blur-3xl opacity-35"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.16), rgba(99,102,241,0))",
          }}
        />
      </div>

      <header className="mx-auto max-w-4xl px-4 pt-10 pb-6">
        <div>
          <p className="text-sm font-semibold tracking-wide text-slate-500">NFT Ticketing</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Create New Event</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Fill out the form below to create a new event with NFT-backed tickets.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-12">
        <div className="space-y-6">
          {/* Success/Error Messages */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-700">✓ Event created successfully!</p>
            </div>
          )}

          {/* Event Details Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
                1
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Event Details</h2>
                <p className="text-sm text-slate-600">Basic information about your event</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Event Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-900">
                  Event Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={eventData.name}
                  onChange={handleEventChange}
                  placeholder="e.g., Casablanca Web3 Summit"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Description */}
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
                  placeholder="Provide a detailed description of your event..."
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Date & Time */}
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-slate-900">
                  Event Date & Time *
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

              {/* Ticket Price */}
              <div>
                <label htmlFor="ticketPrice" className="block text-sm font-semibold text-slate-900">
                  Ticket Price (MAD) *
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
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-16 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>

              {/* Grid for seats and max tickets */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Total Seats */}
                <div>
                  <label htmlFor="totalSeats" className="block text-sm font-semibold text-slate-900">
                    Total Seats *
                  </label>
                  <input
                    type="number"
                    id="totalSeats"
                    name="totalSeats"
                    min="1"
                    value={eventData.totalSeats}
                    onChange={handleEventChange}
                    placeholder="e.g., 500"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                {/* Max Tickets Per Person */}
                <div>
                  <label htmlFor="maxTicketsPerPerson" className="block text-sm font-semibold text-slate-900">
                    Max Tickets Per Person *
                  </label>
                  <input
                    type="number"
                    id="maxTicketsPerPerson"
                    name="maxTicketsPerPerson"
                    min="1"
                    value={eventData.maxTicketsPerPerson}
                    onChange={handleEventChange}
                    placeholder="e.g., 4"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Venue Details Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
                2
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Venue Information</h2>
                <p className="text-sm text-slate-600">Where will your event take place?</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Venue Name */}
              <div>
                <label htmlFor="venueName" className="block text-sm font-semibold text-slate-900">
                  Venue Name *
                </label>
                <input
                  type="text"
                  id="venueName"
                  name="name"
                  value={venueData.name}
                  onChange={handleVenueChange}
                  placeholder="e.g., Anfa Convention Center"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Street Address */}
              <div>
                <label htmlFor="addressLine1" className="block text-sm font-semibold text-slate-900">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={venueData.addressLine1}
                  onChange={handleVenueChange}
                  placeholder="e.g., Boulevard de la Corniche"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* City and Country */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-slate-900">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={venueData.city}
                    onChange={handleVenueChange}
                    placeholder="e.g., Casablanca"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-semibold text-slate-900">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={venueData.country}
                    onChange={handleVenueChange}
                    placeholder="e.g., Morocco"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
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
                setSuccess(false);
              }}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 active:scale-[0.99]"
            >
              Clear Form
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
            >
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}