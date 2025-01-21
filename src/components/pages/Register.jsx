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
      // Verificar si el correo ya existe en la tabla `users`
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 significa "no se encontró ningún registro", lo cual es esperado si el correo no existe
        throw new Error(checkError.message);
      }

      if (existingUser) {
        throw new Error("Este correo ya está registrado. Por favor, utiliza otro.");
      }

      // Registrar al usuario con Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      const user = signUpData.user;
      if (!user) {
        throw new Error("No se pudo obtener el usuario autenticado después del registro.");
      }

      // Actualizar la tabla `users` con el UID del usuario registrado
      const { error: updateError } = await supabase
        .from("users")
        .update({ id: user.id }) // Asignar el auth UID al registro en la tabla
        .eq("email", email); // Asegurarnos de actualizar solo el registro del email correspondiente

      if (updateError) {
        throw new Error(updateError.message);
      }

      setMessage("¡Registro completado y datos actualizados exitosamente!");
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
        Completa tu Registro
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
ORIGINAL NO VALIDA NINGUN DATO!! ES SOLO PARA HACER PRUEBAS
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

*/