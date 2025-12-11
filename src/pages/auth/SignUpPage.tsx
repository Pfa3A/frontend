import type React from "react";
import SignUpForm from "@/components/auth/SignUpForm";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/Card";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white">
      {/* subtle premium background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-28 -left-24 h-72 w-72 rounded-full blur-3xl opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.14), rgba(59,130,246,0))",
          }}
        />
        <div
          className="absolute -top-24 right-[-60px] h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.12), rgba(99,102,241,0))",
          }}
        />
        <div
          className="absolute bottom-[-140px] left-1/3 h-80 w-80 rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.10), rgba(16,185,129,0))",
          }}
        />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col md:flex-row items-center gap-10 px-4 py-12 md:py-20">
        {/* Left side: hero text */}
        <section className="w-full md:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-slate-900" />
            Rejoignez la plateforme de billetterie nouvelle génération
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
            Créez votre compte et accédez à une{" "}
            <span className="underline decoration-slate-300 underline-offset-4">
              billetterie moderne, équitable et sécurisée
            </span>
            .
          </h1>

          <p className="text-slate-600 text-base md:text-lg">
            Profitez d’un système de vente transparent, protégé contre les bots,
            et basé sur la blockchain et les NFT pour garantir l’authenticité et
            la traçabilité de vos tickets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-slate-900">
                Transparence & équité
              </p>
              <p className="mt-1 text-slate-600">
                Une logique de vente claire pour offrir à chaque utilisateur les mêmes
                chances d’achat.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-slate-900">
                Sécurité renforcée
              </p>
              <p className="mt-1 text-slate-600">
                Traçabilité blockchain, tickets infalsifiables et protection contre la fraude.
              </p>
            </div>
          </div>
        </section>

        {/* Right side: sign up card */}
        <section className="w-full md:w-1/2">
          <Card>
            <div className="p-6 md:p-8 space-y-6">
              {/* Brand */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-bold">
                  TC
                </div>

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
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline transition"
                >
                  ← Retour à l’accueil
                </button>
              </div>
            </div>
          </Card>

          <p className="mt-4 text-center text-[11px] text-slate-500">
            En créant un compte, vous acceptez nos conditions et notre politique de confidentialité.
          </p>
        </section>
      </div>
    </main>
  );
};

export default SignUpPage;
