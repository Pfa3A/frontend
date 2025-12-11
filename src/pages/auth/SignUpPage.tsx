import type React from "react";
import SignUpForm from "@/components/auth/SignUpForm";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/Card";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">
      <div className="mx-auto flex max-w-6xl flex-col md:flex-row items-center gap-10 px-4 py-12 md:py-20">
        
        {/* Left side: hero text */}
        <section className="w-full md:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-[#0071BC] shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-[#0071BC]" />
            Rejoignez la plateforme de billetterie nouvelle génération
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
            Créez votre compte et accédez à une{" "}
            <span className="text-[#0071BC]">billetterie moderne, équitable et sécurisée.</span>
          </h1>

          <p className="text-slate-600 text-base md:text-lg">
            Profitez d’un système de vente transparent, protégé contre les bots,
            et basé sur des technologies avancées telles que la blockchain et les NFT
            pour garantir l’authenticité et la traçabilité de vos tickets.
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900">
                Transparence & équité
              </p>
              <p>
                Un algorithme de vente structuré pour offrir à chaque utilisateur les mêmes chances d’achat.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900">
                Sécurité renforcée
              </p>
              <p>
                Traçabilité blockchain, tickets infalsifiables et protection avancée
                contre les fraudes et les reventes abusives.
              </p>
            </div>
          </div>
        </section>

        {/* Right side: sign up card */}
        <section className="w-full md:w-1/2">
          <Card>
            <div className="p-6 md:p-8 space-y-6">

              {/* Logo + brand */}
              <div className="flex flex-col items-center gap-2">
                <img alt="Logo Plateforme" className="h-12 w-auto" />
                <span className="text-xl font-semibold tracking-tight text-slate-900">
                  TicketChain
                </span>
                <p className="text-xs text-slate-500 text-center">
                  Créez votre compte pour accéder à une billetterie sécurisée et innovante.
                </p>
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold text-slate-900">
                  Créer un compte
                </p>
              </div>

              {/* Form */}
              <SignUpForm />

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

export default SignUpPage;
