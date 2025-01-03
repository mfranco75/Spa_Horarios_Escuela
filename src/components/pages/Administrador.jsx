
import React, { useState, useEffect } from 'react';
import supabase from '../../conexionDatabase';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
  } from '@mui/material';
  

const Administrador = () => {
    const [docentes, setDocentes] = useState([]);
    const [filteredDocentes, setFilteredDocentes] = useState([]);
    const [filters, setFilters] = useState({ carrera: '', nivel: '', materia: '' });
    const [carreras, setCarreras] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [editingDocente, setEditingDocente] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);

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
                `);

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
            .eq('id', editingDocente.id);
    
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
                `);
    
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
    

    const getColorByNivel = (nivel) => {
        const colors = ['#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9'];
        return colors[nivel] || '#CFD8DC';
    };

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


/* 
{editingDocente && (
                <div className="edit-panel" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#FFFFFF', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <h3>Editar Docente</h3>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                        Docente:
                        <select
                            name="profesores"
                            value={editingDocente.profesor_id || ''} // Usamos el id del profesor
                            onChange={(e) =>
                                setEditingDocente((prev) => ({
                                    ...prev,
                                    profesor_id: parseInt(e.target.value), // Aseguramos que el valor sea un número
                                }))
                            }
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
                        >
                            <option value="">Seleccionar Docente</option>
                            {profesores.map((profesor) => (
                                <option key={profesor.id} value={profesor.id}>
                                    {profesor.apellido_nombre}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label style={{ display: 'block', marginBottom: '10px' }}>
                        Carrera:
                        <select
                            name="carreras"
                            value={editingDocente.carrera_id || ''} // Usamos el id de la carrera
                            onChange={(e) =>
                                setEditingDocente((prev) => ({
                                    ...prev,
                                    carrera_id: parseInt(e.target.value), // Aseguramos que el valor sea un número
                                }))
                            }
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
                        >
                            <option value="">Seleccionar Carrera</option>
                            {carreras.map((carrera) => (
                                <option key={carrera.id} value={carrera.id}>
                                    {carrera.nombre_carrera}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label style={{ display: 'block', marginBottom: '10px' }}>
                        Nivel:
                        <select
                            name="nivel"
                            value={editingDocente.nivel}
                            onChange={handleEditChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
                        >
                            <option value="">Seleccionar nivel</option>
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
                            value={editingDocente.materia}
                            onChange={handleEditChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
                        />
                    </label>
                    <label style={{ display: 'block', marginBottom: '10px' }}>
                        Comisión:
                        <input
                            type="text"
                            name="comision"
                            value={editingDocente.comision}
                            onChange={handleEditChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
                        />
                    </label>
                    <label style={{ display: 'block', marginBottom: '10px' }}>
                        Dia:
                        <input
                            type="text"
                            name="dia"
                            value={editingDocente.dia}
                            onChange={handleEditChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
                        />
                    </label>
                    <label style={{ display: 'block', marginBottom: '10px' }}>
                        Hora de inicio:
                        <input
                            type="time"
                            name="hora_inicio"
                            value={editingDocente.hora_inicio}
                            onChange={handleEditChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
                        />
                    </label>
                    <label style={{ display: 'block', marginBottom: '10px' }}>
                        Hora de fin:
                        <input
                            type="time"
                            name="hora_fin"
                            value={editingDocente.hora_fin}
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
        </div>
*/
