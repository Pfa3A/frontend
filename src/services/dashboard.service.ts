import api from "@/api";
import type { Metrics, RecentSales } from "@/types/dashboard";

export const getRecentSales = async ():Promise<RecentSales>=>{
    try{
        const response = await api.get<RecentSales>("/api/v1/event/dashboard/recent-sales");
        return response.data;
    }
    catch(e){
        console.log(e);
        throw e;
    }
}

export const getMetrics = async ():Promise<Metrics>=>{
    try{
        const response = await api.get<Metrics>("/api/v1/event/dashboard/metrics");
        return response.data;
    }
    catch(e){
        console.log(e);
        throw e;
    }
}