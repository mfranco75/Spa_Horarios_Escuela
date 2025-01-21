import { useState } from "react";
import supabase from "../../conexionDatabase";
import { Box, TextField, Button, Typography, CircularProgress, Alert, MenuItem } from "@mui/material";

const AdminInvite = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Crear usuario en el sistema de autenticación de Supabase
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: "https://gestion-de-escuela.vercel.app/register", // URL donde el usuario completará su registro
      });

      if (inviteError) {
        throw new Error(inviteError.message);
      }

      // Insertar datos preliminares en la tabla `users` con rol y email
      const { error: insertError } = await supabase.from("users").insert([
        { email, role, name, escuela_id: null }, // Escuela será asignada luego si corresponde
      ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      setMessage(`¡Invitación enviada a ${email} con éxito!`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "auto",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Invitar Usuario
      </Typography>
      <form onSubmit={handleInvite} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <TextField
          label="Nombre"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Rol"
          select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          fullWidth
        >
          <MenuItem value="admin">Administrador</MenuItem>
          <MenuItem value="teacher">Docente</MenuItem>
          <MenuItem value="student">Estudiante</MenuItem>
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Enviando..." : "Enviar Invitación"}
        </Button>
      </form>
      {message && (
        <Alert severity={message.startsWith("Error") ? "error" : "success"}>{message}</Alert>
      )}
    </Box>
  );
};

export default AdminInvite;
