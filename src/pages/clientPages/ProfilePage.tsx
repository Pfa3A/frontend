import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Card } from "@/components/Card";
import api from "@/api";

type UserProfile = {
    qrCode: string;
    email: string;
    firstName: string;
    lastName: string;
    id: string;
};

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile>({
        qrCode: "",
        email: "user@example.com",
        firstName: "John",
        lastName: "Doe",
        id: "user_123456789",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData: any = JSON.parse(localStorage.getItem('user') || '{}');
                console.log("userData: ", userData)
                console.log("userId: ", userData.id);

                const response = await api.get(`api/v1/users/me`);
                console.log("response: ", response.data);
                const fetchedUser = response.data;
                setUser(fetchedUser);

                if (!fetchedUser.qrCode) {
                    const updateResponse = await api.put(`api/v1/users/${userData.id}/qrCode`);
                    setUser(prev => ({ ...prev, qrCode: updateResponse.data.qrCode }));
                }

                setIsLoading(false);

            } catch (err) {
                setError("Failed to load profile");
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);



    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-slate-600">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Background decoration */}


            <header className="mx-auto max-w-4xl px-4 pt-10 pb-6">
                <div>
                    <p className="text-sm font-semibold tracking-wide text-slate-500">NFT Ticketing</p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-600">
                        View and manage your account information
                    </p>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 pb-12">
                <div className="space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                            <p className="text-sm font-semibold text-rose-700">{error}</p>
                        </div>
                    )}

                    {/* Profile Information Section */}
                    <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
                                1
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                                <p className="text-sm text-slate-600">Your account details</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900">
                                    First Name
                                </label>
                                <div className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                                    {user.firstName}
                                </div>
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900">
                                    Last Name
                                </label>
                                <div className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                                    {user.lastName}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900">
                                    Email Address
                                </label>
                                <div className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                                    {user.email}
                                </div>
                            </div>

                            {/* User ID */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900">
                                    User ID
                                </label>
                                <div className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 font-mono">
                                    {user.id}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* QR Code Section */}
                    <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
                                2
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Your QR Code</h2>
                                <p className="text-sm text-slate-600">Use this code for event check-ins</p>
                            </div>
                        </div>

                        {/* QR code */}
                        <div className="mt-5 flex flex-col items-center gap-2 rounded-xl bg-sky-50/60 px-4 py-4">
                            <span className="text-xs font-medium text-slate-600">
                                QR Code du profil
                            </span>
                            <QRCodeCanvas
                                value={user.id}
                                size={180}
                                includeMargin
                                level="H"
                            />
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}