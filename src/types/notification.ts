export type NotificationType = 'TURN_ARRIVED' | 'RESERVATION_CONFIRMED' | 'GENERAL';

export interface NotificationDto {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    eventId?: number;
    orderId?: string;
    createdAt: string;
}
