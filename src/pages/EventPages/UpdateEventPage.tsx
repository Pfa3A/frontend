import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { CreateEventDto } from "../../types/Event";
import { getEventDetails2, updateEvent } from "@/services/eventService";
import { getMediaUrl } from "@/lib/urlUtils";

export default function UpdateEventPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [eventData, setEventData] = useState({
        name: "",
        description: "",
        date: "",
        ticketPrice: 0,
        totalSeats: 0,
        maxTicketsPerPerson: 1,
        venueId: 0 as number | undefined,
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            setIsLoading(true);
            try {
                const data = await getEventDetails2(eventId!);
                // Convert LocalDateTime string to HTML datetime-local format (YYYY-MM-DDTHH:mm)
                const formattedDate = data.date ? data.date.substring(0, 16) : "";

                setEventData({
                    name: data.name,
                    description: data.description,
                    date: formattedDate,
                    ticketPrice: data.ticketPrice,
                    totalSeats: data.totalSeats,
                    maxTicketsPerPerson: data.maxTicketsPerPerson,
                    venueId: data.venue.id,
                });

                if (data.imageUrl) {
                    setImagePreview(getMediaUrl(data.imageUrl));
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erreur lors du chargement de l'événement");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setEventData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const validate = () => {
        if (!eventData.name.trim()) return "Le nom de l’événement est obligatoire";
        if (!eventData.description.trim()) return "La description de l’événement est obligatoire";
        if (!eventData.date) return "La date de l’événement est obligatoire";
        if (eventData.ticketPrice < 0) return "Le prix du ticket ne peut pas être négatif";
        if (eventData.totalSeats <= 0) return "Le nombre total de places doit être supérieur à 0";
        if (eventData.maxTicketsPerPerson <= 0)
            return "Le nombre max de tickets par personne doit être supérieur à 0";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const vErr = validate();
        if (vErr) {
            setError(vErr);
            return;
        }

        setIsSubmitting(true);
        try {
            const dto: CreateEventDto = {
                name: eventData.name,
                description: eventData.description,
                date: eventData.date,
                ticketPrice: eventData.ticketPrice,
                totalSeats: eventData.totalSeats,
                maxTicketsPerPerson: eventData.maxTicketsPerPerson,
                venueId: eventData.venueId as number,
            };

            await updateEvent(eventId!, dto, image || undefined);
            setSuccess(true);
            setTimeout(() => navigate(`/organizer/events/${eventId}`), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la mise à jour");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-slate-600">Chargement de l'événement...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                    >
                        ← Retour
                    </button>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Modifier l'événement
                    </h1>
                    <p className="mt-2 text-slate-600">Mettez à jour les informations de votre événement.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section Informations générales */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-xl font-bold text-slate-900">
                            Détails de l'événement
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Nom de l'événement *
                                </label>
                                <input
                                    name="name"
                                    value={eventData.name}
                                    onChange={handleChange}
                                    placeholder="Ex: Conférence Tech 2024"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-900/10"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={eventData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Décrivez votre événement en quelques lignes..."
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-900/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Date et heure *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="date"
                                    value={eventData.date}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-900/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Image (laisser vide pour conserver l'actuelle)
                                </label>
                                <label className="flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                                    <span>{image ? image.name : "Choisir une nouvelle image"}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {imagePreview && (
                                <div className="sm:col-span-2">
                                    <p className="mb-2 text-sm font-semibold text-slate-700">
                                        Aperçu de l'image
                                    </p>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-48 w-full rounded-xl object-cover ring-1 ring-slate-200"
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Section Billetterie */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-xl font-bold text-slate-900">Billetterie</h2>
                        <div className="grid gap-6 sm:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Prix (MAD) *
                                </label>
                                <input
                                    type="number"
                                    name="ticketPrice"
                                    value={eventData.ticketPrice}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-900/10"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Nombre de places *
                                </label>
                                <input
                                    type="number"
                                    name="totalSeats"
                                    value={eventData.totalSeats}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-900/10"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Max / personne *
                                </label>
                                <input
                                    type="number"
                                    name="maxTicketsPerPerson"
                                    value={eventData.maxTicketsPerPerson}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-900/10"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Feedback Messages */}
                    {error && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                            Événement mis à jour avec succès ! Redirection...
                        </div>
                    )}

                    {/* Validation */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-slate-900 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? "Mise à jour..." : "Enregistrer les modifications"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
