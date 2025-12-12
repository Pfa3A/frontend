import { Card } from "../components/Card";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Background gradients */}
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

      <div className="mx-auto flex max-w-6xl flex-col-reverse md:flex-row items-center gap-10 px-4 py-12 md:py-20">
        {/* Left side : Hero section */}
        <section className="w-full md:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-slate-900" />
            Billetterie nouvelle génération
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
            Achetez vos billets{" "}
            <span className="underline decoration-slate-300 underline-offset-4">
              en toute sécurité et transparence
            </span>
            .
          </h1>

          <p className="text-slate-600 text-base md:text-lg">
            Accédez à une plateforme de billetterie moderne, équitable et
            sécurisée. Profitez d'un système transparent, protégé contre les
            bots, basé sur la blockchain et les NFT pour garantir
            l'authenticité de vos billets.
          </p>

          {/* Highlighted features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-slate-900">
                Transparence & équité
              </p>
              <p className="mt-1 text-slate-600">
                Une logique de vente claire pour offrir à chaque utilisateur
                les mêmes chances d'achat.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-slate-900">
                Sécurité renforcée
              </p>
              <p className="mt-1 text-slate-600">
                Traçabilité blockchain, billets infalsifiables et protection
                contre la fraude.
              </p>
            </div>
          </div>
        </section>

        {/* Right side : login / signup */}
        <section className="w-full md:w-1/2">
          <Card>
            <div className="p-6 md:p-8 space-y-6">
              {/* Brand */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-xl">
                  TC
                </div>

                <span className="text-xl font-semibold tracking-tight text-slate-900">
                  TicketChain
                </span>
                <p className="text-xs text-slate-500 text-center">
                  La billetterie nouvelle génération, sécurisée et transparente.
                </p>
              </div>

              <p className="text-center text-lg font-semibold text-slate-900">
                Créez votre compte pour accéder à la billetterie
              </p>

              <p className="text-slate-600 text-sm md:text-base text-center">
                Connectez-vous pour acheter vos billets, gérer vos commandes
                et profiter d'une expérience sécurisée grâce à la blockchain.
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium bg-slate-900 text-white shadow-sm hover:bg-slate-800 transition"
                >
                  Créer un compte
                </Link>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
                  >
                    Déjà un compte ? Se connecter
                  </Link>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-500 text-center">
                En créant un compte, vous acceptez nos conditions et notre
                politique de confidentialité.
              </p>
            </div>
          </Card>
        </section>
      </div>

      {/* Events / Billets disponibles */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Card>
          <div className="p-6 md:p-8 text-center space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Découvrir les événements disponibles
            </h2>

            <p className="text-slate-600 text-sm md:text-base">
              Explorez les événements à venir et achetez vos billets en toute
              sécurité grâce à notre système de billetterie blockchain.
            </p>

            <Link
              to="/events"
              className="inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-medium bg-slate-900 text-white shadow hover:bg-slate-800 transition"
            >
              Voir les événements
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
};