interface Sales {
    ticketsSold : number,
    revenue : number
}

export interface RecentSales {
    todaySales : Sales,
    weekSales : Sales,
    monthSales : Sales[]
}

export interface Metrics {
    totalEvents : number,
    revenue : number,
    totalAttendees : number,
    totalSoldTickets : number
}