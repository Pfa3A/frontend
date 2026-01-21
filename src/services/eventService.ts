import type { User } from "@/types/user";
import api from "@/api";
import type { CreateEventDto, EventDetailsDto, EventDto, MyEventDetailsDto, MyEventDto } from "@/types/Event";
import type { CreatedVenueDto, CreateVenueDto } from "@/types/Venue";


export const getEvents = async (): Promise<EventDto[]> => {
    try {
        const response = await api.get<EventDto[]>("/api/v1/event")
        return response.data;
    }
    catch (err: any) {
        throw err;
    }
}

export const getOrganizerEvents = async (): Promise<MyEventDto[]> => {
    try {
        const response = await api.get<MyEventDto[]>("/api/v1/event/me")
        return response.data;
    }
    catch (err: any) {
        throw err;
    }
}

export const getEventDetails = async (eventId: string
): Promise<EventDetailsDto> => {
    try {
        const id = Number(eventId);
        const response = await api.get<EventDetailsDto>(`/api/v1/event/${id}`)
        return response.data;
    }
    catch (err: any) {
        throw err;
    }
}


export const getEventDetails2 = async (eventId: string
): Promise<MyEventDetailsDto> => {
    try {
        const id = Number(eventId);
        const response = await api.get<MyEventDetailsDto>(`/api/v1/event/${id}`)
        return response.data;
    }
    catch (err: any) {
        throw err;
    }
}


export const addVenue = async (venue: CreateVenueDto): Promise<CreatedVenueDto> => {
    try {
        const response = await api.post<CreatedVenueDto>("/api/v1/venues", venue);
        return response.data;
    }
    catch (err: any) {
        throw err;
    }
}

export const createEvent = async (dto: CreateEventDto, image?: File): Promise<unknown> => {
    try {
        const formData = new FormData();
        // Wrap the DTO in a Blob with application/json type for the "data" part
        formData.append("data", JSON.stringify(dto));

        if (image) {
            formData.append("image", image);
        }

        const response = await api.post<unknown>("/api/v1/event", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (err: any) {
        throw err;
    }
};

export const updateEvent = async (eventId: number | string, dto: CreateEventDto, image?: File): Promise<unknown> => {
    try {
        const formData = new FormData();
        formData.append("data", JSON.stringify(dto));

        if (image) {
            formData.append("image", image);
        }

        const response = await api.put<unknown>(`/api/v1/event/${eventId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (err: any) {
        throw err;
    }
};

export const updateEventStatus = async (
    eventId: number | string,
    newStatus: string
): Promise<import("@/types/Event").UpdateEventStatusResponse> => {
    try {
        const response = await api.patch<import("@/types/Event").UpdateEventStatusResponse>(
            `/api/v1/event/${eventId}/status`,
            { newStatus }
        );
        return response.data;
    } catch (err: any) {
        throw err;
    }
};

export const addDriver = async (user: User): Promise<User> => {
    try {
        await api.post("/api/v1/auth/add-driver", user);
        return user;
    }
    catch (err: any) {
        throw err;
    }
}


export const removeDriver = async (userId: string): Promise<void> => {
    try {
        await api.delete(`/api/v1/auth/${userId}`);
    }
    catch (err: any) {
        throw err;
    }
}

export const editDriver = async (user: User): Promise<User> => {
    try {
        const response = await api.put<User>("/api/v1/", user);
        return response.data;
    }
    catch (err: any) {
        throw err;
    }
}

export const getEventStatistics = async (eventId: string | number): Promise<import("@/types/Event").EventStatisticsDto> => {
    try {
        const response = await api.get<import("@/types/Event").EventStatisticsDto>(`/api/v1/event/${eventId}/statistics`);
        return response.data;
    } catch (err: any) {
        throw err;
    }
};