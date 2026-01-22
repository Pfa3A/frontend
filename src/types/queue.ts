export type QueueState = 'NONE' | 'WAITING' | 'CAN_BUY';

export interface QueueStatusResponse {
    eventId: number;
    eventName?: string | null;
    venueName?: string | null;
    city?: string | null;
    state: QueueState;
    position?: number | null; // 1-based
    peopleAhead?: number | null;
    orderId?: string | null; // public order id (when CAN_BUY)
    expiresAt?: string | null;
    reservedTickets?: number | null;
    imageUrl?: string | null;
}
