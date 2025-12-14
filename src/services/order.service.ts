import api from "@/api";
import type { OrderDto } from "@/pages/clientPages/OrdersPage";



export const getOpenOrdersByUserId = async (userId:string): Promise<OrderDto[]> => {
    try {
        const response = await api.get<OrderDto[]>(`/api/v1/orders/user/${userId}`)
        return response.data;
    }
    catch (err: any) {
        throw err;
    }
}
