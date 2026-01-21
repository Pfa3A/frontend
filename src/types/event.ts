export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "ENDED" | string;

export type EventDto = {
  id: number | string;
  name: string;
  description?: string;
  startDate?: string; // ISO
  endDate?: string; // ISO
  status?: EventStatus;
  venueName?: string;
  city?: string;
  country?: string;
  imageUrl?: string | null;
};

export type VenueDto = {
  id: number;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  postalCode: string;
};

export type OrganizerDto = {
  id: string;
  companyName: string;
  phoneNumber: string;
  website?: string;
  contactEmail: string;
};

export type EventDetailsDto = {
  id: number;
  name: string;
  description: string;
  date: string; // ISO
  ticketPrice: number;
  totalSeats: number;
  maxTicketsPerPerson: number;
  status: EventStatus;
  imageUrl?: string;
  venue: VenueDto;
  organizer: OrganizerDto;
};