import type React from "react";
import SignUpForm from "@/components/auth/SignUpForm";
import { Link } from "react-router-dom";
import { Card } from "@/components/Card";

const SignUpPage: React.FC = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-col md:flex-row items-center gap-12 px-4">
      {/* Left side: hero text */}
      <section className="w-full md:w-1/2 space-y-8 hidden md:block">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Rejoignez l'aventure.
          </h1>
          <p className="text-slate-600 text-lg">
            Créez votre compte dès maintenant et accédez à une nouvelle façon
            d'acheter et de vivre vos événements.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white/50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Transparence Totale
            </h3>
            <p className="text-slate-500 text-sm mt-1">Fini les frais cachés et les arnaques.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-white/50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Expérience Premium
            </h3>
            <p className="text-slate-500 text-sm mt-1">Une interface fluide pensée pour vous.</p>
          </div>
        </div>
      </section>

      {/* Right side: sign up card */}
      <section className="w-full md:w-1/2 max-w-md mx-auto">
        <Card className="border-slate-200/60 shadow-xl">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Créer un compte</h2>
              <p className="text-sm text-slate-500">
                Remplissez le formulaire ci-dessous pour commencer.
              </p>
            </div>

            <SignUpForm />

            <div className="text-center text-sm">
              <span className="text-slate-500">Déjà inscrit ? </span>
              <Link to="/login" className="font-semibold text-slate-900 hover:underline">
                Se connecter
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default SignUpPage;
