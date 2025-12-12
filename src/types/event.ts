export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "ENDED" | string;

export type EventDto = {
  id: number | string;
  name:string;
  title: string;
  description?: string;
  startDate?: string; // ISO
  endDate?: string; // ISO
  status?: EventStatus;
  venueName?: string;
  city?: string;
  country?: string;
  coverImageUrl?: string | null;
};