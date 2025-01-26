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
      // Verificar si el email existe en la tabla `invitados`
      const { data: invitadosData, error: invitadosError } = await supabase
        .from("invitados")
        .select("*")
        .eq("email", email)
        .single();

      if (invitadosError || !invitadosData) {
        throw new Error("El correo no está invitado o no se encontró.");
      }

      // Crear usuario en el sistema de autenticación de Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      // Obtener el ID del usuario registrado
      const userId = signUpData.user.id;

      // Insertar usuario en la tabla `users` con los datos de `invitados`
      const { apellido_nombre, role, escuela_id } = invitadosData;

      const { error: insertError } = await supabase.from("users").insert([
        {
          id: userId,
          email,
          apellido_nombre,
          role,
          escuela_id,
        },
      ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Eliminar el registro de la tabla `invitados`
      const { error: deleteError } = await supabase
        .from("invitados")
        .delete()
        .eq("email", email);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setMessage("¡Usuario registrado exitosamente!");
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
