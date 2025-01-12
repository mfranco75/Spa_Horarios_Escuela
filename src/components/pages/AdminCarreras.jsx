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

const AdminCarreras = () => {
  const { escuelaId } = useUser();
  const [carreras, setCarreras] = useState([]);
  const [newCarrera, setNewCarrera] = useState({
    nombre_carrera: "",
    cantidad_de_niveles: "",
    resolucion: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCarrera, setSelectedCarrera] = useState(null);
  const [password, setPassword] = useState("");

  // Fetch de carreras desde Supabase
  const fetchCarreras = async () => {
    const { data, error } = await supabase
      .from("carreras")
      .select("*")
      .eq("escuela_id", escuelaId);

    if (error) console.error(error);
    else setCarreras(data);
  };

  // Agregar una nueva carrera
  const handleAddCarrera = async () => {
    if (
      !newCarrera.nombre_carrera ||
      !newCarrera.cantidad_de_niveles ||
      !newCarrera.resolucion
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const niveles = parseInt(newCarrera.cantidad_de_niveles, 10);
    if (isNaN(niveles) || niveles < 1 || niveles > 7) {
        alert('La cantidad de niveles debe ser un número entre 1 y 7.');
        return;
    }

    const { error } = await supabase
      .from("carreras")
      .insert({ ...newCarrera, escuela_id: escuelaId });

    if (error) console.error(error);
    else {
      setNewCarrera({ nombre_carrera: "", cantidad_de_niveles: "", resolucion: "" });
      fetchCarreras();
    }
  };

  // Mostrar modal de confirmación antes de eliminar
  const handleOpenDeleteModal = (carrera) => {
    setSelectedCarrera(carrera);
    setModalOpen(true);
  };

  // Confirmar eliminación después de validar la contraseña
  const reauthenticateAndDelete = async () => {
    try {
      // Obtén el usuario actual desde Supabase
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error al obtener el usuario:", userError.message);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password,
      });

      if (signInError) {
        alert("Contraseña incorrecta. No se puede eliminar la carrera.");
        return;
      }

      // Si la autenticación es exitosa, elimina la carrera
      const { error: deleteError } = await supabase
        .from("carreras")
        .delete()
        .eq("id", selectedCarrera.id)
        .eq("escuela_id", escuelaId);

      if (deleteError) throw deleteError;

      fetchCarreras();
      setModalOpen(false);
      setSelectedCarrera(null);
      setPassword("");
    } catch (error) {
      console.error("Error al eliminar la carrera:", error.message);
    }
  };

  useEffect(() => {
    fetchCarreras();
  }, [escuelaId]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Carreras
      </Typography>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Nombre de la Carrera"
          value={newCarrera.nombre_carrera}
          onChange={(e) =>
            setNewCarrera({ ...newCarrera, nombre_carrera: e.target.value })
          }
          fullWidth
        />
        <TextField
                    label="Cantidad de Niveles"
                    value={newCarrera.cantidad_de_niveles}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^[1-7]$/.test(value) || value === '') {
                            setNewCarrera({ ...newCarrera, cantidad_de_niveles: value });
                        }
                    }}
                    helperText="Debe ser un número entre 1 y 7"
                />
        <TextField
          label="Número de Resolución"
          value={newCarrera.resolucion}
          onChange={(e) =>
            setNewCarrera({ ...newCarrera, resolucion: e.target.value })
          }
          autoComplete="off"
        />
        <Button variant="contained" color="primary" onClick={handleAddCarrera}>
          Agregar
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Cant. de Niveles</TableCell>
              <TableCell>N° de Resolución</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carreras.map((carrera) => (
              <TableRow key={carrera.id}>
                <TableCell>{carrera.id}</TableCell>
                <TableCell>{carrera.nombre_carrera}</TableCell>
                <TableCell>{carrera.cantidad_de_niveles}</TableCell>
                <TableCell>{carrera.resolucion}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenDeleteModal(carrera)}
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
            Esta acción eliminará la carrera y puede afectar al sistema si hay
            docentes cargados. Ingresa tu contraseña para confirmar.
          </Typography>
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
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

export default AdminCarreras;




/*
import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper } from '@mui/material';
import supabase from '../../conexionDatabase'; // Asegúrate de tener configurado Supabase
import { useUser } from '../UserContext.jsx';

const AdminCarreras = () => {
    const { escuelaId } = useUser();
    const [carreras, setCarreras] = useState([]);
    const [newCarrera, setNewCarrera] = useState({
        nombre_carrera: '',
        cantidad_de_niveles: '',
        resolucion: ''
    });

    const fetchCarreras = async () => {
        try {
            const { data, error } = await supabase
                .from('carreras')
                .select('*')
                .eq('escuela_id', escuelaId);

            if (error) throw error;
            setCarreras(data);
        } catch (error) {
            console.error('Error al obtener las carreras:', error.message);
        }
    };

    const handleAddCarrera = async () => {
        if (!newCarrera.nombre_carrera || !newCarrera.cantidad_de_niveles || !newCarrera.resolucion) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Validación de cantidad de niveles
        const niveles = parseInt(newCarrera.cantidad_de_niveles, 10);
        if (isNaN(niveles) || niveles < 1 || niveles > 7) {
            alert('La cantidad de niveles debe ser un número entre 1 y 7.');
            return;
        }

        try {
            const { error } = await supabase
                .from('carreras')
                .insert({
                    ...newCarrera,
                    escuela_id: escuelaId,
                });

            if (error) throw error;

            setNewCarrera({ nombre_carrera: '', cantidad_de_niveles: '', resolucion: '' });
            fetchCarreras();
        } catch (error) {
            console.error('Error al agregar carrera:', error.message);
        }
    };

    const handleDeleteCarrera = async (id) => {
        try {
            const { error } = await supabase
                .from('carreras')
                .delete()
                .eq('id', id)
                .eq('escuela_id', escuelaId);

            if (error) throw error;

            fetchCarreras();
        } catch (error) {
            console.error('Error al eliminar la carrera:', error.message);
        }
    };

    useEffect(() => {
        fetchCarreras();
    }, [escuelaId]);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Gestión de Carreras
            </Typography>
            <Box display="flex" gap={2} mb={3}>
                <TextField
                    label="Nueva Carrera"
                    value={newCarrera.nombre_carrera}
                    onChange={(e) => setNewCarrera({ ...newCarrera, nombre_carrera: e.target.value })}
                />
                <TextField
                    label="Cantidad de Niveles"
                    value={newCarrera.cantidad_de_niveles}
                    onChange={(e) => {
                        const value = e.target.value;
                        // Permitir solo números entre 1 y 7
                        if (/^[1-7]$/.test(value) || value === '') {
                            setNewCarrera({ ...newCarrera, cantidad_de_niveles: value });
                        }
                    }}
                    helperText="Debe ser un número entre 1 y 7"
                />
                <TextField
                    label="Número de Resolución"
                    value={newCarrera.resolucion}
                    onChange={(e) => setNewCarrera({ ...newCarrera, resolucion: e.target.value })}
                />
                <Button variant="contained" color="primary" onClick={handleAddCarrera}>
                    Agregar
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Cant. de Niveles</TableCell>
                            <TableCell>N° de Resolución</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {carreras.map((carrera) => (
                            <TableRow key={carrera.id}>
                                <TableCell>{carrera.id}</TableCell>
                                <TableCell>{carrera.nombre_carrera}</TableCell>
                                <TableCell>{carrera.cantidad_de_niveles}</TableCell>
                                <TableCell>{carrera.resolucion}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeleteCarrera(carrera.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminCarreras;

*/