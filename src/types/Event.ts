export type CreateEventDto = {
  name: string;
  description: string;
  date: string;
  venueId: number;
  ticketPrice: number;
  totalSeats: number;
  maxTicketsPerPerson: number;
};


export type EventStatus = "ACTIVE" | "INACTIVE" | "CANCELLED" | "ENDED" | string;

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
