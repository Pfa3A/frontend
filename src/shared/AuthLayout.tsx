import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";

export const AuthLayout: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex flex-col bg-white">
            <BackgroundBlobs />

            {/* Simple Header for Auth pages */}
            <header className="sticky top-0 z-40 px-6 py-4 flex justify-between items-center max-w-6xl mx-auto w-full">
                <button
                    onClick={() => navigate("/")}
                    className="focus:outline-none"
                >
                    <Logo />
                </button>

                <button
                    onClick={() => navigate("/")}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                >
                    Retour
                </button>
            </header>

            <main className="flex-1 flex flex-col justify-center py-10">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};
