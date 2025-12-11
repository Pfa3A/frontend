import type React from "react";
import LoginForm from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/Card";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">
      <div className="mx-auto flex max-w-6xl flex-col md:flex-row items-center gap-10 px-4 py-12 md:py-20">

        {/* Left side: hero text */}
        <section className="w-full md:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-[#0071BC] shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-[#0071BC]" />
            Accédez à votre espace TicketChain
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
            Retrouvez vos{" "}
            <span className="text-[#0071BC]">tickets authentifiés</span> et{" "}
            <span className="text-[#0071BC]">transactions sécurisées</span>.
          </h1>

          <p className="text-slate-600 text-base md:text-lg">
            Connectez-vous pour gérer vos achats, vérifier l’authenticité de vos tickets
            grâce à la blockchain et accéder à une billetterie transparente, équitable et
            protégée contre les bots.
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900">
                Sécurité renforcée
              </p>
              <p>
                Vos tickets sont traçables, infalsifiables et protégés grâce aux NFT et à la blockchain.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900">
                Données centralisées
              </p>
              <p>
                Consultez vos achats, historiques de revente et transactions en un seul endroit.
              </p>
            </div>
          </div>
        </section>

        {/* Right side: login card */}
        <section className="w-full md:w-1/2">
          <Card>
            <div className="p-6 md:p-8 space-y-6">

              {/* Logo + brand */}
              <div className="flex flex-col items-center gap-2">
                <img alt="Logo TicketChain" className="h-12 w-auto" />
                <span className="text-xl font-semibold tracking-tight text-slate-900">
                  TicketChain
                </span>
                <p className="text-xs text-slate-500 text-center">
                  Connectez-vous pour accéder à votre espace sécurisé.
                </p>
              </div>

              {/* Form */}
              <LoginForm />

              {/* Navigation to home */}
              <div className="text-center">
                <button
                  onClick={() => navigate("/")}
                  className="text-xs font-medium text-[#0071BC] hover:underline hover:text-[#005c96] transition"
                >
                  ← Retour à l’accueil
                </button>
              </div>

            </div>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
