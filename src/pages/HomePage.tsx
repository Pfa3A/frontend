import { Card } from "../components/Card";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Ticket, Users } from "lucide-react";

export const HomePage = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12 md:py-20">

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Left side : Text */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
            Billetterie nouvelle génération
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            Achetez vos billets{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              en toute sécurité
            </span>
            .
          </h1>

          <p className="text-slate-600 text-lg leading-relaxed">
            La première plateforme de billetterie équitable, sécurisée par la blockchain.
            Oubliez les faux billets et les prix exorbitants du marché noir.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:translate-y-[-2px] transition-all"
            >
              Voir les événements
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              Créer un compte
            </Link>
          </div>
        </div>

        {/* Right side : Visual/Card */}
        <div className="w-full md:w-1/2">
          <div className="relative">
            {/* Decorative elements behind the card */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-lg"></div>

            <Card className="relative bg-white/80 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600" />

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mb-2">
                      En Vente
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">Summer Vibes Festival 2026</h3>
                    <p className="text-sm text-slate-500 mt-1">15 Juillet 2026 • 20:00</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-bold text-lg">
                    15
                    <span className="text-[10px] font-normal absolute mt-8 text-slate-500">JUD</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                      <span className="text-xs">📍</span>
                    </div>
                    <span>Grand Stade, Casablanca</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                      <span className="text-xs">💰</span>
                    </div>
                    <span className="font-semibold text-slate-900">450 MAD</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Organisé par Morocco Events</span>
                    <button className="text-xs font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div className="h-10 w-10 text-blue-600 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Sécurité Maximale</h3>
          <p className="text-slate-600 text-sm">Chaque billet est un NFT unique sécurisé par la blockchain, rendant la falsification impossible.</p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div className="h-10 w-10 text-purple-600 mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Marché Secondaire Équitable</h3>
          <p className="text-slate-600 text-sm">Revendez vos billets en toute sécurité avec des prix plafonnés pour éviter la spéculation.</p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div className="h-10 w-10 text-indigo-600 mb-4">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Transparence Totale</h3>
          <p className="text-slate-600 text-sm">Suivez l'historique complet de chaque billet depuis son émission jusqu'à votre poche.</p>
        </div>
      </section>

    </div>
  );
};