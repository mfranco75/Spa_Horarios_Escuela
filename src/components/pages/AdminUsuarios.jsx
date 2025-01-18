import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Modal,
} from "@mui/material";
import supabase from "../../conexionDatabase"; // Conexión a Supabase
import { useUser } from "../UserContext.jsx";

const AdminUsuarios = () => {
  const { escuelaId } = useUser();
  const [usuarios, setUsuarios] = useState([]);
  const [newUsuario, setNewUsuario] = useState({
    email: "",
    apellido_nombre: "",
    role: "user",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [password, setPassword] = useState("");

  // Fetch de usuarios desde Supabase
  const fetchUsuarios = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("escuela_id", escuelaId);

    if (error) console.error(error);
    else setUsuarios(data);
  };

  // Agregar un nuevo usuario
  const handleAddUsuario = async () => {
    if (!newUsuario.email || !newUsuario.apellido_nombre) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    try {
      const response = await fetch("/api/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUsuario.email,
          apellido_nombre: newUsuario.apellido_nombre,
          role: newUsuario.role,
          escuela_id: escuelaId,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error);
  
      // Limpiar formulario y actualizar la lista de usuarios
      setNewUsuario({ email: "", apellido_nombre: "", role: "user" });
      fetchUsuarios();
    } catch (error) {
      console.error("Error al agregar usuario:", error.message);
      alert("Hubo un error al agregar el usuario: " + error.message);
    }
  };
  

  // Mostrar modal de confirmación antes de eliminar
  const handleOpenDeleteModal = (usuario) => {
    setSelectedUsuario(usuario);
    setModalOpen(true);
  };

  // Confirmar eliminación
  const reauthenticateAndDelete = async () => {
    try {
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", selectedUsuario.id)
        .eq("escuela_id", escuelaId);

      if (deleteError) throw deleteError;

      fetchUsuarios();
      setModalOpen(false);
      setSelectedUsuario(null);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error.message);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [escuelaId]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Email"
          value={newUsuario.email}
          onChange={(e) => setNewUsuario({ ...newUsuario, email: e.target.value })}
          sx={{ width: 300 }}
        />
        <TextField
          label="Apellido y Nombre"
          value={newUsuario.apellido_nombre}
          onChange={(e) => setNewUsuario({ ...newUsuario, apellido_nombre: e.target.value })}
          sx={{ width: 300 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddUsuario}>
          Agregar
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Apellido y Nombre</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.id}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.apellido_nombre}</TableCell>
                <TableCell>{usuario.role}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenDeleteModal(usuario)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de confirmación */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            border: "2px solid #f44336",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography id="modal-title" variant="h6" color="error">
            Confirmar Eliminación
          </Typography>
          <Typography id="modal-description" sx={{ mb: 2 }}>
            Esta acción eliminará el usuario de forma permanente. ¿Estás seguro?
          </Typography>
          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="contained"
              color="error"
              onClick={reauthenticateAndDelete}
            >
              Confirmar
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminUsuarios;
