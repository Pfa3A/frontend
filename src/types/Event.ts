export type EventStatus = "ACTIVE" | "INACTIVE" | "CANCELLED" | "ENDED" | string;

export type EventDto = {
  id: number | string;
  name: string;
  description?: string;
  date?: string; // ISO
  status?: EventStatus;
  venueName?: string;
  city?: string;
  country?: string;
  imageUrl?: string | null;
  ticketPrice?: number;
  totalSeats?: number;
};

export type VenueDto = {
  id: number;
  name: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  country: string;
  postalCode?: string | null;
};

export type OrganizerDto = {
  id: string; // UUID
  companyName: string;
  phoneNumber?: string | null;
  website?: string | null;
  contactEmail?: string | null;
};

export type CreateEventDto = {
  name: string;
  description: string;
  date: string;
  venueId: number;
  ticketPrice: number;
  totalSeats: number;
  maxTicketsPerPerson: number;
};

export type MyEventDto = {
  id: number;
  name: string;
  date: string; // ISO
  venueName: string;
  ticketPrice: number;
  status: EventStatus;
  description: string;
  imageUrl?: string;
};

export type MyEventDetailsDto = {
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

export type EventDetailsDto = MyEventDetailsDto;

export type UpdateEventStatusRequest = {
  newStatus: EventStatus;
};

export type UpdateEventStatusResponse = {
  eventId: number;
  oldStatus: EventStatus;
  newStatus: EventStatus;
  message: string;
};
