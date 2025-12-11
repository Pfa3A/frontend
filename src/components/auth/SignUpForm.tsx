import { useAuth } from "@/contexts/AuthContext";
import type { UserSignUpRequest } from "@/types/auth";
import {
  Button,
  Typography,
  Link,
  Box,
  TextField,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const SignUpForm: React.FC = () => {
  const [user, setUser] = useState<UserSignUpRequest>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username:""
  });
  const [error, setError] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>("");

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

    try {
      await signup(user);
      navigate("/login");
    } catch (err: any) {
      console.log("Error during sign up: ", err);
      const backendMessage =
        err?.response?.data?.message || err?.response?.data;
      setError(
        backendMessage ||
          "L'inscription a échoué. Veuillez vérifier vos informations et réessayer."
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {error && (
        <Typography color="error" mb={2} textAlign="center" variant="body2">
          {error}
        </Typography>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Prénom"
            variant="outlined"
            fullWidth
            type="text"
            value={user.firstName}
            name="firstName"
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nom"
            variant="outlined"
            fullWidth
            type="text"
            value={user.lastName}
            name="lastName"
            onChange={handleChange}
            required
          />
        </Grid>
      </Grid>

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
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        type="text"
        value={user.username}
        name="username"
        onChange={handleChange}
        required
      />

      <TextField
        label="Mot de passe (sécurisé)"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        value={user.password}
        name="password"
        onChange={handleChange}
        required
      />

      <TextField
        label="Confirmer le mot de passe"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        value={confirmPassword}
        name="confirmPassword"
        onChange={(e) => setConfirmPassword(e.target.value)}
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
      >
        Créer mon compte sécurisé
      </Button>

      <Typography mt={3} textAlign="center" variant="body2">
        Vous avez déjà un compte ?{" "}
        <Link
          component={RouterLink}
          to="/login"
          underline="hover"
          sx={{ fontWeight: 500 }}
        >
          Se connecter
        </Link>
      </Typography>
    </Box>
  );
};

export default SignUpForm;
