import { useState } from "react";
import supabase from "../../conexionDatabase";
import { useUser } from '../UserContext.jsx';
import { Box, TextField, Button, Typography, CircularProgress, Alert, MenuItem } from "@mui/material";

const AdminInvite = ({ onClose, onUserAdded }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { escuelaId } = useUser(); // Obtener el id de la escuela desde el contexto

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Insertar datos en la tabla `invitados`
      const { error: insertError } = await supabase.from("invitados").insert([
        {
          email,
          apellido_nombre: name,
          role,
          escuela_id: escuelaId,
        },
      ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      setMessage(`¡Usuario ${name} (${email}) invitado con éxito!`);

      // Llamar al callback para actualizar la tabla de invitados
      if (onUserAdded) {
        onUserAdded();
      }

      // Cerrar el modal automáticamente después de un breve delay
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1000); // 1 segundo para que se muestre el mensaje de éxito
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
          label="Apellido y Nombre"
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
          <MenuItem value="user">Preceptor/ Equipo de Conducción</MenuItem>
          <MenuItem value="docente">Docente</MenuItem>
          <MenuItem value="estudiante">Estudiante</MenuItem>
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Guardando..." : "Guardar Usuario"}
        </Button>
      </form>
      {message && (
        <Alert severity={message.startsWith("Error") ? "error" : "success"}>{message}</Alert>
      )}
    </Box>
  );
};

export default AdminInvite;
