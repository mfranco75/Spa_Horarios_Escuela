import React, { useState, useEffect } from 'react';
import supabase from '../../conexionDatabase';

const Administrador = () => {
    const [docentes, setDocentes] = useState([]);
    const [filteredDocentes, setFilteredDocentes] = useState([]);
    const [filters, setFilters] = useState({ carrera: '', nivel: '', materia: '' });
    const [carreras, setCarreras] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [editingDocente, setEditingDocente] = useState(null);

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
    );
};

export default Administrador;
