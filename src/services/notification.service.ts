import api from "@/api";
import type { NotificationDto } from '@/types/notification';

export const getUserNotifications = async (userId: string): Promise<NotificationDto[]> => {
    const response = await api.get(`/api/v1/notifications/user/${userId}`);
    return response.data;
};

export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
    const response = await api.get(`/api/v1/notifications/user/${userId}/unread-count`);
    return response.data.count;
};

export const markNotificationAsRead = async (notificationId: string): Promise<NotificationDto> => {
    const response = await api.patch(`/api/v1/notifications/${notificationId}/read`);
    return response.data;
};
