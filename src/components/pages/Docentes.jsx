import React, { useState, useEffect } from "react";
import { useUser } from '../UserContext.jsx';
import {
  Box,
  Button,
  Modal,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import supabase from "../../conexionDatabase";


function Docentes() {

  const { user, role, escuelaId } = useUser(); // Obtener el id de la escuela desde el contexto
  const [docentes, setDocentes] = useState([]);
  const [editingDocente, setEditingDocente] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newDocente, setNewDocente] = useState({
    apellido_nombre: "",
    dni: "",
    cuil: "",
    celular: "",
    correo_abc: "",
    fecha_nacimiento: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [docenteToDelete, setDocenteToDelete] = useState(null);

  // Fetch docentes on component mount
  useEffect(() => {
    const fetchDocentes = async () => {
      const { data, error } = await supabase
        .from("profesores")
        .select("*")
        .order("apellido_nombre", { ascending: true })
        .eq("escuela_id", escuelaId); // Filtrar por escuela_id

      if (error) {
        console.error("Error fetching docentes:", error);
      } else {
        setDocentes(data);
      }
    };

    fetchDocentes();
  }, []);

  const handleEdit = (docente) => {
    setEditingDocente(docente);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingDocente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    const { error } = await supabase
      .from("profesores")
      .update(editingDocente)
      .eq("id", editingDocente.id)
      .eq("escuela_id", escuelaId); // Filtrar por escuela_id

    if (error) {
      console.error("Error updating docente:", error);
    } else {
      setEditingDocente(null);
      setIsEditModalOpen(false);
      const { data } = await supabase
        .from("profesores")
        .select("*")
        .order("apellido_nombre", { ascending: true })
        .eq("escuela_id", escuelaId); // Filtrar por escuela_id

      setDocentes(data);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewDocente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewDocente = async () => {
    const { error } = await supabase.from("profesores").insert(newDocente);

    if (error) {
      console.error("Error creating docente:", error);
    } else {
      setNewDocente({
        apellido_nombre: "",
        dni: "",
        cuil: "",
        celular: "",
        correo_abc: "",
        fecha_nacimiento: "",
      });
      setIsCreateModalOpen(false);
      const { data } = await supabase
        .from("profesores")
        .select("*")
        .order("apellido_nombre", { ascending: true })
        .eq("escuela_id", escuelaId); // Filtrar por escuela_id
      setDocentes(data);
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("profesores")
      .delete()
      .eq("id", docenteToDelete.id)
      .eq("escuela_id", escuelaId); // Filtrar por escuela_id

    if (error) {
      console.error("Error deleting docente:", error);
    } else {
      setDocenteToDelete(null);
      setIsDeleteModalOpen(false);
      const { data } = await supabase
        .from("profesores")
        .select("*")
        .order("apellido_nombre", { ascending: true })
        .eq("escuela_id", escuelaId); // Filtrar por escuela_id
      setDocentes(data);
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Docentes
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsCreateModalOpen(true)}
        sx={{ marginBottom: 2 }}
      >
        Crear Nuevo Docente
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Apellido y Nombre</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>CUIL</TableCell>
              <TableCell>Celular</TableCell>
              <TableCell>Correo ABC</TableCell>
              <TableCell>Fecha de Nacimiento</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {docentes.map((docente) => (
              <TableRow key={docente.id}>
                <TableCell>{docente.id}</TableCell>
                <TableCell>{docente.apellido_nombre}</TableCell>
                <TableCell>{docente.dni}</TableCell>
                <TableCell>{docente.cuil}</TableCell>
                <TableCell>{docente.celular}</TableCell>
                <TableCell>{docente.correo_abc}</TableCell>
                <TableCell>{docente.fecha_nacimiento}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(docente)}
                    sx={{ marginRight: 1, minWidth: 95 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ minWidth: 95 }}
                    onClick={() => {
                      setDocenteToDelete(docente);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Modal para crear un nuevo docente */}
<Modal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      p: 4,
      borderRadius: 2,
      boxShadow: 24,
    }}
  >
    <Typography variant="h6" gutterBottom>
      Crear Nuevo Docente
    </Typography>
    <TextField
      fullWidth
      margin="normal"
      label="Apellido y Nombre"
      name="apellido_nombre"
      value={newDocente.apellido_nombre}
      onChange={handleCreateChange}
    />
    <TextField
      fullWidth
      margin="normal"
      label="DNI"
      name="dni"
      value={newDocente.dni}
      onChange={handleCreateChange}
    />
    <TextField
      fullWidth
      margin="normal"
      label="CUIL"
      name="cuil"
      value={newDocente.cuil}
      onChange={handleCreateChange}
    />
    <TextField
      fullWidth
      margin="normal"
      label="Celular"
      name="celular"
      value={newDocente.celular}
      onChange={handleCreateChange}
    />
    <TextField
      fullWidth
      margin="normal"
      label="Correo ABC"
      name="correo_abc"
      value={newDocente.correo_abc}
      onChange={handleCreateChange}
    />
    <TextField
      fullWidth
      margin="normal"
      label="Fecha de Nacimiento"
      name="fecha_nacimiento"
      value={newDocente.fecha_nacimiento}
      onChange={handleCreateChange}
    />
    <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveNewDocente}
        sx={{ marginRight: 1 }}
      >
        Guardar
      </Button>
      <Button
        variant="outlined"
        onClick={() => setIsCreateModalOpen(false)}
      >
        Cancelar
      </Button>
    </Box>
  </Box>
</Modal>

      {/* Modal para editar un docente */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Editar Docente
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Apellido y Nombre"
            name="apellido_nombre"
            value={editingDocente?.apellido_nombre || ""}
            onChange={handleEditChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="DNI"
            name="dni"
            value={editingDocente?.dni || ""}
            onChange={handleEditChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="CUIL"
            name="cuil"
            value={editingDocente?.cuil || ""}
            onChange={handleEditChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Celular"
            name="celular"
            value={editingDocente?.celular || ""}
            onChange={handleEditChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Correo ABC"
            name="correo_abc"
            value={editingDocente?.correo_abc || ""}
            onChange={handleEditChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Fecha de Nacimiento"
            name="fecha_nacimiento"
            value={editingDocente?.fecha_nacimiento || ""}
            onChange={handleEditChange}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
              sx={{ marginRight: 1 }}
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>

      
        
      {/* Modal de confirmación de eliminación */}
      <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Confirmar eliminación
          </Typography>
          <Typography>
            ¿Estás seguro de que deseas eliminar al docente{" "}
            <strong>{docenteToDelete?.apellido_nombre}</strong>?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{ marginRight: 1 }}
            >
              Eliminar
            </Button>
            <Button variant="outlined" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Docentes;



/* ORIGINAL
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import supabase from '../../conexionDatabase';

Modal.setAppElement('#root');

function Docentes() {
  const [docentes, setDocentes] = useState([]);
  const [editingDocente, setEditingDocente] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDocente, setNewDocente] = useState({
    apellido_nombre: '',
    dni: '',
    cuil: '',
    celular: '',
    correo_abc: '',
    fecha_nacimiento: '',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch docentes on component mount
  useEffect(() => {
    const fetchDocentes = async () => {
      const { data, error } = await supabase
        .from('profesores')
        .select('*')
        .order('apellido_nombre', { ascending: true });

      if (error) {
        console.error('Error fetching docentes:', error);
      } else {
        setDocentes(data);
      }
    };

    fetchDocentes();
  }, []);

  const handleEdit = (docente) => {
    setEditingDocente(docente);
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingDocente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    const { error } = await supabase
      .from('profesores')
      .update(editingDocente)
      .eq('id', editingDocente.id);

    if (error) {
      console.error('Error updating docente:', error);
    } else {
      setEditingDocente(null);
      setIsModalOpen(false);
      const { data } = await supabase
        .from('profesores')
        .select('*')
        .order('apellido_nombre', { ascending: true });
      setDocentes(data);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewDocente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewDocente = async () => {
    const { error } = await supabase
      .from('profesores')
      .insert(newDocente);

    if (error) {
      console.error('Error creating docente:', error);
    } else {
      setNewDocente({
        apellido_nombre: '',
        dni: '',
        cuil: '',
        celular: '',
        correo_abc: '',
        fecha_nacimiento: '',
      });
      setIsCreateModalOpen(false);
      const { data } = await supabase
        .from('profesores')
        .select('*')
        .order('apellido_nombre', { ascending: true });
      setDocentes(data);
    }
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div style={{ backgroundColor: '#F5F5F5', padding: '20px', minHeight: '100vh' }}>
      <h1>Docentes</h1>
      <button
        onClick={handleCreate}
        style={{
          padding: '10px',
          backgroundColor: '#1976D2',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Crear Nuevo Docente
      </button>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#1976D2', color: '#FFFFFF' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Apellido y Nombre</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>DNI</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>CUIL</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Celular</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Correo ABC</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Fecha de Nacimiento</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {docentes.map((docente) => (
            <tr key={docente.id} style={{ backgroundColor: '#E1F5FE', color: '#000000' }}>
              <td style={{ padding: '10px' }}>{docente.id}</td>
              <td style={{ padding: '10px' }}>{docente.apellido_nombre}</td>
              <td style={{ padding: '10px' }}>{docente.dni}</td>
              <td style={{ padding: '10px' }}>{docente.cuil}</td>
              <td style={{ padding: '10px' }}>{docente.celular}</td>
              <td style={{ padding: '10px' }}>{docente.correo_abc}</td>
              <td style={{ padding: '10px' }}>{docente.fecha_nacimiento}</td>
              <td style={{ padding: '10px' }}>
                <button
                  onClick={() => handleEdit(docente)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#1976D2',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {editingDocente && (
          <div>
            <h3>Editar Docente</h3>
      
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Apellido y Nombre:
              <input
                type="text"
                name="apellido_nombre"
                value={editingDocente.apellido_nombre}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              DNI:
              <input
                type="text"
                name="dni"
                value={editingDocente.dni}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              CUIL:
              <input
                type="text"
                name="cuil"
                value={editingDocente.cuil}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Celular:
              <input
                type="text"
                name="celular"
                value={editingDocente.celular}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Correo ABC:
              <input
                type="text"
                name="correo_abc"
                value={editingDocente.correo_abc}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Fecha de Nacimiento:
              <input
                type="date"
                name="fecha_nacimiento"
                value={editingDocente.fecha_nacimiento}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <button
              onClick={handleSaveChanges}
              style={{ width: '100%', padding: '10px', backgroundColor: '#1976D2', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
            >
              Guardar Cambios
            </button>

          </div>
        )}
      </Modal>

      
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <div>
          <h3>Crear Nuevo Docente</h3>
      
          <label style={{ display: 'block', marginBottom: '10px' }}>
          Apellido y Nombre:
          <input
            type="text"
            name="apellido_nombre"
            value={newDocente.apellido_nombre}
            onChange={handleCreateChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          DNI:
          <input
            type="text"
            name="dni"
            value={newDocente.dni}
            onChange={handleCreateChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          CUIL:
          <input
            type="text"
            name="cuil"
            value={newDocente.cuil}
            onChange={handleCreateChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Celular:
          <input
            type="text"
            name="celular"
            value={newDocente.celular}
            onChange={handleCreateChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Correo ABC:
          <input
            type="text"
            name="correo_abc"
            value={newDocente.correo_abc}
            onChange={handleCreateChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Fecha de Nacimiento:
          <input
            type="date"
            name="fecha_nacimiento"
            value={newDocente.fecha_nacimiento}
            onChange={handleCreateChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
          />
        </label>
        <button
          onClick={handleSaveNewDocente}
          style={{ width: '100%', padding: '10px', backgroundColor: '#1976D2', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
        >
          Guardar Cambios
        </button>

        </div>
      </Modal>
    </div>
  );
}

export default Docentes;
*/