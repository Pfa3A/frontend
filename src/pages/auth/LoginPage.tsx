import type React from "react";
import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";
import { Card } from "@/components/Card";

const LoginPage: React.FC = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-col md:flex-row items-center gap-12 px-4">
      {/* Left side: hero text */}
      <section className="w-full md:w-1/2 space-y-8 hidden md:block">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Heureux de vous revoir.
          </h1>
          <p className="text-slate-600 text-lg">
            Gérez vos tickets, suivez vos transactions et profitez d'une expérience
            de billetterie sans faille.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-slate-900">Accès Instantané</h3>
              <p className="text-slate-500 text-sm">Retrouvez tous vos billets NFT en quelques clics.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-slate-900">Sécurité Blockchain</h3>
              <p className="text-slate-500 text-sm">Vos transactions sont sécurisées et immuables.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Right side: login card */}
      <section className="w-full md:w-1/2 max-w-md mx-auto">
        <Card className="border-slate-200/60 shadow-xl">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Connexion</h2>
              <p className="text-sm text-slate-500">
                Entrez vos identifiants pour accéder à votre compte.
              </p>
            </div>

            <LoginForm />

            <div className="text-center text-sm">
              <span className="text-slate-500">Pas encore de compte ? </span>
              <Link to="/sign-up" className="font-semibold text-slate-900 hover:underline">
                S'inscrire
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default LoginPage;
