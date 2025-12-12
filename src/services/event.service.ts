import type { CreateEventDto , MyEventDto} from "../types/Event";
import type { CreateVenueDto, CreatedVenueDto } from "../types/Venue";

async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers || {}),
    },
    // If you use cookie-based auth, uncomment:
    // credentials: "include",
  });

  if (!res.ok) {
    const msg = `Erreur API (HTTP ${res.status})`;
    throw new Error(msg);
  }

  // some endpoints might return empty body; be safe
  const text = await res.text();
  return (text ? (JSON.parse(text) as T) : (undefined as T));
}

export const VenueService = {
  createVenue(dto: CreateVenueDto) {
    return requestJson<CreatedVenueDto>("/api/venues", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },
};

export const EventService = {
  createEvent(dto: CreateEventDto) {
    return requestJson<unknown>("/api/v1/event", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  getMyEvents() {
    return requestJson<MyEventDto[]>("/api/v1/event/me", { method: "GET" });
  },
};



