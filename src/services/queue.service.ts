import api from '../api';
import type { QueueStatusResponse } from '../types/queue';

export const getQueueStatusesForUser = async (userId: string): Promise<QueueStatusResponse[]> => {
    const response = await api.get<QueueStatusResponse[]>(`/api/v1/tickets/queue/user/${userId}`);
    return response.data;
};

export const getQueueStatus = async (eventId: number, userId: string): Promise<QueueStatusResponse> => {
    const response = await api.get<QueueStatusResponse>(`/api/v1/tickets/queue/status`, {
        params: { eventId, userId },
    });
    return response.data;
};
