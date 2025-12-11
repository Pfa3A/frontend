import type React from "react";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import type { UserLoginRequest } from "@/types/auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LoginForm: React.FC = () => {
  const [user, setUser] = useState<UserLoginRequest>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);

    try {
      const redirectPath = await login(user);
      navigate(redirectPath);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Échec de la connexion. Vérifiez vos identifiants ou réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error */}
      {error && (
        <div
          className={cn(
            "rounded-xl border border-rose-200 bg-rose-50 px-4 py-2",
            "text-sm text-rose-700 text-center"
          )}
        >
          {error}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700">
          Adresse e-mail
        </label>
        <Input
          type="email"
          name="email"
          placeholder="ex: utilisateur@email.com"
          value={user.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700">
          Mot de passe
        </label>
        <Input
          type="password"
          name="password"
          placeholder="Votre mot de passe"
          value={user.password}
          onChange={handleChange}
          required
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading}
      >
        {loading ? "Connexion sécurisée..." : "Se connecter"}
      </Button>

      {/* Footer */}
      <p className="pt-2 text-center text-xs text-slate-600">
        Vous n’avez pas encore de compte ?{" "}
        <RouterLink
          to="/sign-up"
          className="font-semibold text-slate-900 hover:underline"
        >
          Créer un compte
        </RouterLink>
      </p>
    </form>
  );
};

export default LoginForm;
