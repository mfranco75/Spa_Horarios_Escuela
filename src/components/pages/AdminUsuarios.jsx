import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
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
import AdminInvite from "./AdminInvite"; // Importa el componente AdminInvite

import { useUser } from "../UserContext.jsx";

const AdminUsuarios = () => {
  const { escuelaId } = useUser();
  const [usuarios, setUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false); // Nuevo estado para AdminInvite
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  // Fetch de usuarios desde Supabase
  const fetchUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("escuela_id", escuelaId);

      if (error) throw error;

      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error.message);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, [escuelaId]);

  // Mostrar modal de confirmación antes de eliminar
  const handleOpenDeleteModal = (usuario) => {
    setSelectedUsuario(usuario);
    setModalOpen(true);
  };

  // Confirmar eliminación
  const reauthenticateAndDelete = async () => {
    try {
      // Eliminar usuario de Supabase Auth
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        selectedUsuario.id
      );

      if (deleteError) throw deleteError;

      // Refrescar la lista de usuarios
      fetchUsuarios();
      setModalOpen(false);
      setSelectedUsuario(null);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error.message);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>
      
      {/* Botón para abrir el formulario de invitación */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setInviteModalOpen(true)}
        sx={{ mb: 3 }}
      >
        Invitar Nuevo Usuario
      </Button>

      {/* Tabla de usuarios */}
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
                    color="error"
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

      {/* Modal de AdminInvite */}
      <Modal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        aria-labelledby="invite-modal-title"
        aria-describedby="invite-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <AdminInvite
            onClose={() => setInviteModalOpen(false)}
            onUserAdded={fetchUsuarios} // Callback para refrescar la lista
          />
        </Box>
      </Modal>

      {/* Modal de confirmación de eliminación */}
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
