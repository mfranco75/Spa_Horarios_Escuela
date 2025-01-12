
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
            const { data, error } = await supabase.from('carreras').select('id, nombre_carrera');
            if (error) {
                console.error('Error fetching carreras:', error);
            } else {
                setCarreras(data);
            }
        };

        const fetchProfesores = async () => {
            const { data, error } = await supabase.from('profesores').select('id, apellido_nombre');
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
    
    // DELETE HORARIO



    const getColorByNivel = (nivel) => {
        const colors = ['#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9'];
        return colors[nivel] || '#CFD8DC';
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
                value={filters.materia}
                onChange={handleFilterChange}
                placeholder="Ej: Piano"
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
    
            {/* Tabla de docentes */}
            <Box sx={{ ml: 3 }}>
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#1976D2' }}>
                      {['Docente', 'Carrera', 'Nivel', 'Materia', 'Comisión', 'Día', 'Hora de inicio', 'Hora de fin', 'Acciones'].map(
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
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: '#1976D2', color: '#FFFFFF' }}
                            onClick={() => handleEditClick(docente)}
                          >
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
    
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
        </Box>
      );
    };
    
    export default AdminHorarios;

    /*
    return (
        <div style={{ backgroundColor: '#F5F5F5', padding: '20px', minHeight: '100vh' }}>
            <div className="docentes-container" style={{ display: 'flex' }}>
                <div className="filters-panel" style={{ width: '25%', padding: '20px', backgroundColor: '#FFFFFF', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h3>Filtrar</h3>
                    <label style={{ display: 'block', marginBottom: '10px' }}>
                        Carrera:
                        <select
                            name="carrera"
                            value={filters.carrera}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
                        >
                            <option value="">Todas</option>
                            {carreras.map((carrera) => (
                                <option key={carrera.id} value={carrera.nombre_carrera}>
                                {carrera.nombre_carrera}
                                </option>
                            ))}
                        </select>
                    </label>
                    
                    <label style={{ display: 'block', marginBottom: '10px' }}>
                        Nivel:
                        <select
                            name="nivel"
                            value={filters.nivel}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
                        >
                            <option value="">Todos</option>
                            {[0, 1, 2, 3, 4].map((nivel) => (
                                <option key={nivel} value={nivel}>{nivel}</option>
                            ))}
                        </select>
                    </label>
                    <label style={{ display: 'block', marginBottom: '10px' }}>
                        Materia:
                        <input
                            type="text"
                            name="materia"
                            value={filters.materia}
                            onChange={handleFilterChange}
                            placeholder="Ej: Piano"
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
                        />
                    </label>
                    
                    <button
                        onClick={handleApplyFilters}
                        style={{ width: '100%', padding: '10px', backgroundColor: '#1976D2', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
                    >
                        Aplicar Filtros
                    </button>
                </div>

                <div className="docentes-table" style={{ width: '70%', marginLeft: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFFFFF', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#1976D2', color: '#FFFFFF' }}>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Docente</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Carrera</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Nivel</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Materia</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Comisión</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Dia</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Hora de inicio</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Hora de fin</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocentes.map((docente) => (
                                <tr key={docente.id} style={{ backgroundColor: getColorByNivel(docente.nivel), color: '#000000' }}>
                                    <td style={{ padding: '10px' }}>{docente.profesores.apellido_nombre}</td>
                                    <td style={{ padding: '10px' }}>{docente.carreras.nombre_carrera}</td>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>{docente.nivel}</td>
                                    <td style={{ padding: '10px' }}>{docente.materia}</td>
                                    <td style={{ padding: '10px' }}>{docente.comision}</td>
                                    <td style={{ padding: '10px' }}>{docente.dia}</td>
                                    <td style={{ padding: '10px' }}>{docente.hora_inicio}</td>
                                    <td style={{ padding: '10px' }}>{docente.hora_fin}</td>
                                    <td style={{ padding: '10px' }}>
                                        <button onClick={() => handleEditClick(docente)} style={{ padding: '5px 10px', backgroundColor: '#1976D2', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        
          
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
                    onChange={(e) => {
                        const horaInicio = editingDocente?.hora_inicio || '';
                        const horaFin = e.target.value;
                        if (horaInicio && horaFin < horaInicio) {
                            alert("La hora de fin no puede ser menor que la hora de inicio.");
                        } else {
                            handleEditChange(e);
                        }
                    }}

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
            </div>                    
            
    );
};

export default Administrador;
*/