export interface TicketResaleOfferDto {
    offerId: number;
    ticketId: number;
    eventId: number;
    eventName?: string | null;
    venueName?: string | null;
    city?: string | null;
    buyerPrice: string; // BigDecimal as string
    createdAt: string;
}
