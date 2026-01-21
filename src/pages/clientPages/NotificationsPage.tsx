import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import { getUserNotifications, markNotificationAsRead } from "@/services/notification.service";
import type { NotificationDto, NotificationType } from "@/types/notification";
import { Bell, Calendar, CheckCircle, Info, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem("user");
            if (!userStr) return;
            const user = JSON.parse(userStr);
            const data = await getUserNotifications(user.id);
            setNotifications(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (err: any) {
            setError("Impossible de charger les notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'TURN_ARRIVED':
                return <Bell className="text-amber-500" />;
            case 'RESERVATION_CONFIRMED':
                return <CheckCircle className="text-emerald-500" />;
            default:
                return <Info className="text-blue-500" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    return (
        <div className="min-h-screen bg-white relative">
            <BackgroundBlobs />

            <header className="mx-auto max-w-4xl px-4 pt-10 pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notifications</h1>
                <p className="mt-2 text-sm text-slate-600">Restez informé de vos réservations et événements.</p>
            </header>

            <main className="mx-auto max-w-4xl px-4 pb-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center">
                        <p className="text-sm text-rose-700">{error}</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <Mail className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <h3 className="text-base font-semibold text-slate-900">Aucune notification</h3>
                        <p className="mt-2 text-sm text-slate-600">Vous êtes à jour !</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => !n.read && handleMarkAsRead(n.id)}
                                className={`group relative flex gap-4 rounded-2xl border p-5 transition-all cursor-pointer ${n.read ? "bg-white border-slate-100 opacity-75" : "bg-white border-blue-100 shadow-sm ring-1 ring-blue-50"
                                    } hover:shadow-md`}
                            >
                                {!n.read && (
                                    <div className="absolute top-5 right-5 h-2 w-2 rounded-full bg-blue-600"></div>
                                )}
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className={`text-sm font-bold ${n.read ? "text-slate-700" : "text-slate-900"}`}>
                                            {n.title}
                                        </h3>
                                        <span className="text-[10px] font-medium text-slate-400 capitalize">
                                            {formatDate(n.createdAt)}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{n.message}</p>
                                    {(n.eventId || n.orderId) && (
                                        <div className="mt-3 flex items-center gap-3">
                                            {n.eventId && (
                                                <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-600">
                                                    <Calendar size={12} />
                                                    Événement #{n.eventId}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
