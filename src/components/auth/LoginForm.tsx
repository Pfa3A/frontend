import { useAuth } from "@/contexts/AuthContext";
import type { UserLoginRequest } from "@/types/auth";
import type React from "react";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
} from "@mui/material";

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
    setError("");
    setLoading(true);

    try {
      const redirectPath = await login(user);
      console.log("Redirecting to: ", redirectPath);
      navigate(redirectPath);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Échec de la connexion. Vérifiez vos identifiants ou réessayez."
      );
      console.log("Erreur pendant la connexion : ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, fontFamily: "Inter, sans-serif" }}>
      {error && (
        <Typography color="error" mb={2} textAlign="center" variant="body2">
          {error}
        </Typography>
      )}

      <TextField
        label="Adresse e-mail"
        variant="outlined"
        fullWidth
        margin="normal"
        type="email"
        value={user.email}
        name="email"
        onChange={handleChange}
        required
      />
      <TextField
        label="Mot de passe"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        value={user.password}
        name="password"
        onChange={handleChange}
        required
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          py: 1.1,
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 9999,
        }}
        disabled={loading}
      >
        {loading ? "Connexion sécurisée..." : "Se connecter"}
      </Button>

      <Typography mt={3} textAlign="center" variant="body2">
        Vous n’avez pas encore de compte ?{" "}
        <Link
          component={RouterLink}
          to="/sign-up"
          underline="hover"
          sx={{ fontWeight: 500 }}
        >
          Créer un compte
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
