import api from '../api';
import type { TicketResaleOfferDto } from '../types/resale';

export const createResaleOffer = async (ticketId: number, sellerId: string): Promise<TicketResaleOfferDto> => {
    const response = await api.post<TicketResaleOfferDto>('/tickets/resale/offer', null, {
        params: { ticketId, sellerId },
    });
    return response.data;
};

export const listResaleOffers = async (): Promise<TicketResaleOfferDto[]> => {
    const response = await api.get<TicketResaleOfferDto[]>('/tickets/resale/offers');
    return response.data;
};

export const registerResaleInterest = async (offerId: number, buyerId: string): Promise<void> => {
    await api.post('/tickets/resale/interest', null, {
        params: { offerId, buyerId },
    });
};
