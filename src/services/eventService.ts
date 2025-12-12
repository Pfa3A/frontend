import type { User } from "@/types/user";
import api from "@/api";
import type { EventDto } from "@/types/event";


export const getEvents = async (): Promise<EventDto[]> => {
    try {
        const response = await api.get<EventDto[]>("/api/v1/event")
        return response.data;
    }
    catch (err: any) {
        throw err;
    }
}

export const getOrganizerEvents = async (): Promise<EventDto[]> => {
    try {
        const response = await api.get<EventDto[]>("/api/v1/event/me")
        return response.data;
    }
    catch (err: any) {
        throw err;
    }
}

export const getEventDetails = async (): Promise<EventDto[]> => {
    try {
        const response = await api.get<EventDto[]>("/api/v1/event/me")
        return response.data;
    }
    catch (err: any) {
        throw err;
    }
}

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