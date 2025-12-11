import type React from "react";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import type { UserSignUpRequest } from "@/types/auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SignUpForm: React.FC = () => {
  const [user, setUser] = useState<UserSignUpRequest>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
  });

  const [error, setError] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
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

    if (user.password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError(undefined);
    setLoading(true);

    try {
      await signup(user);
      navigate("/login");
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message || err?.response?.data;
      setError(
        backendMessage ||
          "L'inscription a échoué. Veuillez vérifier vos informations et réessayer."
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

      {/* First/Last name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Prénom</label>
          <Input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            placeholder="Votre prénom"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Nom</label>
          <Input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            placeholder="Votre nom"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700">
          Adresse e-mail
        </label>
        <Input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="ex: utilisateur@email.com"
          required
        />
      </div>

      {/* Username */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700">Username</label>
        <Input
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
          placeholder="ex: zakariae_anna"
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700">
          Mot de passe (sécurisé)
        </label>
        <Input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
      </div>

      {/* Confirm password */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700">
          Confirmer le mot de passe
        </label>
        <Input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Création en cours..." : "Créer mon compte sécurisé"}
      </Button>

      {/* Footer */}
      <p className="pt-2 text-center text-xs text-slate-600">
        Vous avez déjà un compte ?{" "}
        <RouterLink
          to="/login"
          className="font-semibold text-slate-900 hover:underline"
        >
          Se connecter
        </RouterLink>
      </p>
    </form>
  );
};

export default SignUpForm;
