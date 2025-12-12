import type { OrderTicketRequest, TicketOrderResponse } from "@/pages/EventPages/EventDetailsPage";
import api from "@/api";
import type { TicketPaymentResponse } from "@/pages/clientPages/PaymentPage";
import type { PaymentRequest } from "@/pages/clientPages/PaymentPage";


export const orderTickets = async (request: OrderTicketRequest): Promise<TicketOrderResponse> => {
    try {
        const response = await api.post("api/v1/tickets/order", request);
        const data: TicketOrderResponse = response.data;
        return data;
    } catch (error) {
        console.error(error)
        console.log(error)
        throw error;
    }
}


export const buyTickets = async (request: PaymentRequest): Promise<TicketPaymentResponse> => {
    try {
        const response = await api.post("api/v1/tickets/order", request);
        const data: TicketPaymentResponse = response.data;
        return data;

    } catch (error) {
        console.error(error)
        console.log(error);
        throw error;
    }
}