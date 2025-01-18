
import React, { useState, useEffect } from 'react';
import supabase from '../../conexionDatabase.js';
import { useUser } from '../UserContext.jsx';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Dialog,
    Modal,
    DialogActions,
    DialogContent,
    DialogTitle,  
  } from '@mui/material';
  

const AdminHorarios = () => {
    const [docentes, setDocentes] = useState([]);
    const [filteredDocentes, setFilteredDocentes] = useState([]);
    const [filters, setFilters] = useState({ carrera: '', nivel: '', materia: '' });
    const [carreras, setCarreras] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [editingDocente, setEditingDocente] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const { user, role, escuelaId } = useUser(); // Obtener el id de la escuela desde el contexto

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [horarioToDelete, sethorarioToDelete] = useState(null);

    const [newHorario, setNewHorario] = useState({
        nivel: "",
        materia: "",
        comision: "",
        dia: "",
        hora_inicio: "",
        hora_fin: "",
        aula: "",
        profesor_id: "",
        carrera_id: "",
        escuela_id: escuelaId, // Agregar el id de la escuela al nuevo horario
      });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    

    useEffect(() => {
        const fetchDocentes = async () => {
            const { data, error } = await supabase
                .from('horarios')
                .select(`
                    id,
                    nivel,
                    materia,
                    comision,
                    dia,
                    hora_inicio,
                    hora_fin,
                    aula,
                    profesores(id, apellido_nombre),
                    carreras(id, nombre_carrera)
                `)
                .eq('escuela_id', escuelaId);

            if (error) {
                console.error('Error fetching docentes:', error);
            } else {
                const sortedData = data.sort((a, b) => {
                    const docenteA = a.profesores.apellido_nombre.toLowerCase();
                    const docenteB = b.profesores.apellido_nombre.toLowerCase();
                    const carreraA = a.carreras.nombre_carrera.toLowerCase();
                    const carreraB = b.carreras.nombre_carrera.toLowerCase();
                    const nivelA = a.nivel;
                    const nivelB = b.nivel;

                    if (docenteA !== docenteB) return docenteA.localeCompare(docenteB);
                    if (carreraA !== carreraB) return carreraA.localeCompare(carreraB);
                    return nivelA - nivelB;
                });

                setDocentes(sortedData);
                setFilteredDocentes(sortedData);
            }
        };

        const fetchCarreras = async () => {
            const { data, error } = await supabase.from('carreras')
                                      .select('id, nombre_carrera')
                                      .eq('escuela_id', escuelaId);
            if (error) {
                console.error('Error fetching carreras:', error);
            } else {
                setCarreras(data);
            }
        };

        const fetchProfesores = async () => {
            const { data, error } = await supabase.from('profesores')
                                      .select('id, apellido_nombre')
                                      .eq('escuela_id', escuelaId);
            if (error) {
                console.error('Error fetching profesores:', error);
            } else {
                setProfesores(data);
            }
        };

        fetchDocentes();
        fetchCarreras();
        fetchProfesores();
    }, []);



    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        let filtered = docentes;
        if (filters.carrera) {
            filtered = filtered.filter((docente) => docente.carreras.nombre_carrera === filters.carrera);
        }
        if (filters.nivel) {
            filtered = filtered.filter((docente) => docente.nivel === parseInt(filters.nivel));
        }
        if (filters.materia) {
            filtered = filtered.filter((docente) => docente.materia.toLowerCase().includes(filters.materia.toLowerCase()));
        }
        setFilteredDocentes(filtered);
    };

    const handleEditClick = (docente) => {
        setEditingDocente({
            ...docente,
            profesor_id: docente.profesores.id,
            carrera_id: docente.carreras.id,
        });
        setOpenEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingDocente((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        const { error } = await supabase
            .from('horarios')
            .update({
                nivel: editingDocente.nivel,
                materia: editingDocente.materia,
                comision: editingDocente.comision,
                dia: editingDocente.dia,
                hora_inicio: editingDocente.hora_inicio,
                hora_fin: editingDocente.hora_fin,
                aula: editingDocente.aula,
                profesor_id: parseInt(editingDocente.profesor_id),
                carrera_id: parseInt(editingDocente.carrera_id),
            })
            .eq('id', editingDocente.id)
            .eq('escuela_id', escuelaId);

    
        if (error) {
            console.error('Error updating docente:', error);
        } else {
            setEditingDocente(null);
            setOpenEditModal(false);
    
            // Refrescar datos desde la base de datos
            const { data, error: fetchError } = await supabase
                .from('horarios')
                .select(`
                    id,
                    nivel,
                    materia,
                    comision,
                    dia,
                    hora_inicio,
                    hora_fin,
                    aula,
                    profesores(id, apellido_nombre),
                    carreras(id, nombre_carrera)
                `)
                .eq('escuela_id', escuelaId);

    
            if (fetchError) {
                console.error('Error fetching updated docentes:', fetchError);
            } else {
                const sortedData = data.sort((a, b) => {
                    const docenteA = a.profesores.apellido_nombre.toLowerCase();
                    const docenteB = b.profesores.apellido_nombre.toLowerCase();
                    const carreraA = a.carreras.nombre_carrera.toLowerCase();
                    const carreraB = b.carreras.nombre_carrera.toLowerCase();
                    const nivelA = a.nivel;
                    const nivelB = b.nivel;
    
                    if (docenteA !== docenteB) return docenteA.localeCompare(docenteB);
                    if (carreraA !== carreraB) return carreraA.localeCompare(carreraB);
                    return nivelA - nivelB;
                });
    
                setDocentes(sortedData);
                setFilteredDocentes(sortedData);
            }
        }
    };


    //CREATE HORARIO
    const handleCreateChange = (e) => {
      const { name, value } = e.target;
      setNewHorario((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveNewHorario = async () => {
      const horarioToInsert = { ...newHorario, escuela_id: escuelaId };
      const { error } = await supabase.from("horarios").insert(horarioToInsert);
  
      if (error) {
        console.error("Error creating horario:", error);
      } else {
        setNewHorario({
          nivel: "",
          materia: "",
          comision: "",
          dia: "",
          hora_inicio: "",
          hora_fin: "",
          aula: "",
          profesor_id: "",
          carrera_id: "",
          escuela_id: escuelaId, // Agregar el id de la escuela al nuevo horario
        });
        setIsCreateModalOpen(false);
        const { data, error } = await supabase
                .from('horarios')
                .select(`
                    id,
                    nivel,
                    materia,
                    comision,
                    dia,
                    hora_inicio,
                    hora_fin,
                    aula,
                    profesores(id, apellido_nombre),
                    carreras(id, nombre_carrera)
                `)
                .eq('escuela_id', escuelaId);

            if (error) {
                console.error('Error fetching horarios:', error);
            } else {
                const sortedData = data.sort((a, b) => {
                    const docenteA = a.profesores.apellido_nombre.toLowerCase();
                    const docenteB = b.profesores.apellido_nombre.toLowerCase();
                    const carreraA = a.carreras.nombre_carrera.toLowerCase();
                    const carreraB = b.carreras.nombre_carrera.toLowerCase();
                    const nivelA = a.nivel;
                    const nivelB = b.nivel;

                    if (docenteA !== docenteB) return docenteA.localeCompare(docenteB);
                    if (carreraA !== carreraB) return carreraA.localeCompare(carreraB);
                    return nivelA - nivelB;
                });

                setDocentes(sortedData);
                setFilteredDocentes(sortedData);
            }
        };

        
      
    };
  
    const handleDelete = async () => {
      const { error } = await supabase
        .from('horarios')
        .delete()
        .eq('id', horarioToDelete.id)
        .eq('escuela_id', escuelaId);

      if (error) {
        console.error('Error deleting horario:', error);
      } else {
        setIsDeleteModalOpen(false);
        sethorarioToDelete(null);

        const { data, error: fetchError } = await supabase
          .from('horarios')
          .select(`
            id,
            nivel,
            materia,
            comision,
            dia,
            hora_inicio,
            hora_fin,
            aula,
            profesores(id, apellido_nombre),
            carreras(id, nombre_carrera)
          `)
          .eq('escuela_id', escuelaId);

        if (fetchError) {
          console.error('Error fetching updated horarios:', fetchError);
        } else {
          const sortedData = data.sort((a, b) => {
            const docenteA = a.profesores.apellido_nombre.toLowerCase();
            const docenteB = b.profesores.apellido_nombre.toLowerCase();
            const carreraA = a.carreras.nombre_carrera.toLowerCase();
            const carreraB = b.carreras.nombre_carrera.toLowerCase();
            const nivelA = a.nivel;
            const nivelB = b.nivel;

            if (docenteA !== docenteB) return docenteA.localeCompare(docenteB);
            if (carreraA !== carreraB) return carreraA.localeCompare(carreraB);
            return nivelA - nivelB;
          });

          setDocentes(sortedData);
          setFilteredDocentes(sortedData);
        }
      }
    };

    
    // DELETE HORARIO

    const getColorByNivel = (nivel) => {
      const colors = [
          '#FFCDD2', // Color 1 PARA NIVEL 0
          '#F8BBD0', // Color 2
          '#E1BEE7', // Color 3
          '#D1C4E9', // Color 4
          '#C5CAE9', // Color 5
          '#BBDEFB', // Color 6 
          '#B2EBF2', // Color 7 
          '#C8E6C9', // Color 8 
          '#DCEDC8'  // Color 9 
      ];
      return colors[nivel] || '#CFD8DC'; // Retorna un color por nivel o el predeterminado
  };
  

   
    return (
        <Box sx={{ backgroundColor: '#F5F5F5', p: 3, minHeight: '100vh' }}>
          <Box display="flex">
            {/* Panel de filtros */}
            <Box
              sx={{
                width: '220px',
                p: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Filtrar
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Carrera</InputLabel>
                <Select
                  name="carrera"
                  value={filters.carrera}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {carreras.map((carrera) => (
                    <MenuItem key={carrera.id} value={carrera.nombre_carrera}>
                      {carrera.nombre_carrera}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
    
              <FormControl fullWidth margin="normal">
                <InputLabel>Nivel</InputLabel>
                <Select
                  name="nivel"
                  value={filters.nivel}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((nivel) => (
                    <MenuItem key={nivel} value={nivel}>
                      {nivel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
    
              <TextField
                fullWidth
                margin="normal"
                label="Materia"
                name="materia"
                value={filters.materia}
                onChange={handleFilterChange}
                placeholder="Ej: Historia"
              />
    
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2, backgroundColor: '#1976D2', color: '#FFFFFF' }}
                onClick={handleApplyFilters}
              >
                Aplicar Filtros
              </Button>
            </Box>
    
            {/* Tabla de horaios */}
            <Box sx={{ ml: 3 }}>
              <Typography variant="h4" gutterBottom>
                Horarios
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsCreateModalOpen(true)}
                sx={{ marginBottom: 2 }}
              >
                Crear Nuevo Horario
              </Button>

              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#1976D2' }}>
                      {['Docente', 'Carrera', 'Nivel', 'Materia', 'Comisión', 'Día', 'Hora de inicio', 'Hora de fin', 'Aula', 'Acciones'].map(
                        (header) => (
                          <TableCell key={header} sx={{ color: '#FFFFFF' }}>
                            {header}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDocentes.map((docente) => (
                      <TableRow
                        key={docente.id}
                        sx={{ backgroundColor: getColorByNivel(docente.nivel) }}
                      >
                        <TableCell>{docente.profesores.apellido_nombre}</TableCell>
                        <TableCell>{docente.carreras.nombre_carrera}</TableCell>
                        <TableCell align="center">{docente.nivel}</TableCell>
                        <TableCell>{docente.materia}</TableCell>
                        <TableCell>{docente.comision}</TableCell>
                        <TableCell>{docente.dia}</TableCell>
                        <TableCell>{docente.hora_inicio}</TableCell>
                        <TableCell>{docente.hora_fin}</TableCell>
                        <TableCell>{docente.aula}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: '#1976D2', color: '#FFFFFF' }}
                            onClick={() => handleEditClick(docente)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            sx={{ minWidth: 95 }}
                            onClick={() => {
                              sethorarioToDelete(docente);
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
            </Box>
          </Box>

          {/* Modal de creación */}

                    <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} fullWidth>
                      <DialogTitle>Crear Nuevo Horario</DialogTitle>
                      <DialogContent>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Docente</InputLabel>
                          <Select
                            name="profesor_id"
                            value={newHorario.profesor_id}
                            onChange={handleCreateChange}
                          >
                            {profesores.map((profesor) => (
                              <MenuItem key={profesor.id} value={profesor.id}>
                                {profesor.apellido_nombre}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Carrera</InputLabel>
                          <Select
                            name="carrera_id"
                            value={newHorario.carrera_id}
                            onChange={handleCreateChange}
                          >
                            {carreras.map((carrera) => (
                              <MenuItem key={carrera.id} value={carrera.id}>
                                {carrera.nombre_carrera}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Nivel</InputLabel>
                          <Select
                            name="nivel"
                            value={newHorario.nivel}
                            onChange={handleCreateChange}
                          >
                            {[0, 1, 2, 3, 4].map((nivel) => (
                              <MenuItem key={nivel} value={nivel}>
                                {nivel}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Materia"
                          name="materia"
                          value={newHorario.materia}
                          onChange={handleCreateChange}
                        />
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Comisión"
                          name="comision"
                          value={newHorario.comision}
                          onChange={handleCreateChange}
                        />
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Día"
                          name="dia"
                          value={newHorario.dia}
                          onChange={handleCreateChange}
                        />
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Hora de inicio"
                          name="hora_inicio"
                          type="time"
                          value={newHorario.hora_inicio}
                          onChange={handleCreateChange}
                        />
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Hora de fin"
                          name="hora_fin"
                          type="time"
                          value={newHorario.hora_fin}
                          onChange={handleCreateChange}
                        />
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Aula"
                          name="aula"
                          value={newHorario.aula}
                          onChange={handleCreateChange}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setIsCreateModalOpen(false)} color="secondary">
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveNewHorario} color="primary">
                          Guardar
                        </Button>
                      </DialogActions>
                    </Dialog>



          
          {/* Modal de edición */}
          <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} fullWidth>
            <DialogTitle>Editar Docente</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <InputLabel>Docente</InputLabel>
                <Select
                  name="profesor_id"
                  value={editingDocente?.profesor_id || ''}
                  onChange={handleEditChange}
                >
                  {profesores.map((profesor) => (
                    <MenuItem key={profesor.id} value={profesor.id}>
                      {profesor.apellido_nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Carrera</InputLabel>
                <Select
                  name="carrera_id"
                  value={editingDocente?.carrera_id || ''}
                  onChange={handleEditChange}
                >
                  {carreras.map((carrera) => (
                    <MenuItem key={carrera.id} value={carrera.id}>
                      {carrera.nombre_carrera}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Nivel</InputLabel>
                <Select
                  name="nivel"
                  value={editingDocente?.nivel || ''}
                  onChange={handleEditChange}
                >
                  {[0, 1, 2, 3, 4].map((nivel) => (
                    <MenuItem key={nivel} value={nivel}>
                      {nivel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                label="Materia"
                name="materia"
                value={editingDocente?.materia || ''}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Comisión"
                name="comision"
                value={editingDocente?.comision || ''}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Día"
                name="dia"
                value={editingDocente?.dia || ''}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Hora de inicio"
                name="hora_inicio"
                type="time"
                value={editingDocente?.hora_inicio || ''}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Hora de fin"
                name="hora_fin"
                type="time"
                value={editingDocente?.hora_fin || ''}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Aula"
                name="aula"
                value={editingDocente?.aula || ''}
                onChange={handleEditChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEditModal(false)} color="secondary">
                Cancelar
              </Button>
              <Button onClick={handleSaveChanges} color="primary">
                Guardar
              </Button>
            </DialogActions>
          </Dialog>

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
            ¿Estás seguro de que deseas eliminar el horario{" "}
            <strong>{horarioToDelete?.materia}</strong>?
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
    };
    
    export default AdminHorarios;

  