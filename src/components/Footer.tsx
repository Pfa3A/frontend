import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export const Footer: React.FC = () => {
    return (
        <footer className="w-full border-t border-slate-200 bg-white py-12 text-sm text-slate-500">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
                <Logo classNameImage="h-8" className="gap-2" />

                <nav className="flex gap-6">
                    <Link to="#" className="hover:text-slate-900 transition">
                        À propos
                    </Link>
                    <Link to="#" className="hover:text-slate-900 transition">
                        Confidentialité
                    </Link>
                    <Link to="#" className="hover:text-slate-900 transition">
                        Termes
                    </Link>
                    <Link to="#" className="hover:text-slate-900 transition">
                        Contact
                    </Link>
                </nav>

                <p>© {new Date().getFullYear()} TicketChain. Tous droits réservés.</p>
            </div>
        </footer>
    );
};
