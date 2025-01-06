import { useState } from "react";
import supabase from "../../conexionDatabase";

import { Box, TextField, Button, Typography, CircularProgress, Alert } from "@mui/material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Crear usuario en el sistema de autenticación de Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      // Iniciar sesión automáticamente después del registro
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      const user = signInData.user;

      if (!user) {
        throw new Error("No se pudo obtener el usuario autenticado después del inicio de sesión.");
      }

      // Insertar usuario en la tabla `users` con rol predeterminado
      const { error: insertError } = await supabase.from("users").insert([
        { id: user.id, email, role: "user" }, // Rol predeterminado
      ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      setMessage("¡Usuario registrado y autenticado exitosamente!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Registro de Usuario
      </Typography>
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
      </form>
      {message && (
        <Alert severity={message.startsWith("Error") ? "error" : "success"}>{message}</Alert>
      )}
    </Box>
  );
};

export default Register;


  /*  
  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
*/