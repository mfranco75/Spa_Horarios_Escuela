import React, { useState, useEffect } from 'react';
import supabase from '../../conexionDatabase';

const Docentes = () => {
  const [docentes, setDocentes] = useState([]);
  const [filteredDocentes, setFilteredDocentes] = useState([]);
  const [filters, setFilters] = useState({ carrera: '', nivel: '', materia: '' });
  const [carreras, setCarreras] = useState([]);

  useEffect(() => {
    const fetchDocentes = async () => {
      const { data, error } = await supabase
        .from('horarios')
        .select(`
          id,
          nivel,
          materia,
          profesores (apellido_nombre),
          carreras (nombre_carrera)
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
      const { data, error } = await supabase
        .from('carreras')
        .select('nombre_carrera');

      if (error) {
        console.error('Error fetching carreras:', error);
      } else {
        setCarreras(data.map((carrera) => carrera.nombre_carrera));
      }
    };

    fetchDocentes();
    fetchCarreras();
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
              {carreras.map((carrera, index) => (
                <option key={index} value={carrera}>{carrera}</option>
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
              </tr>
            </thead>
            <tbody>
              {filteredDocentes.map((docente) => (
                <tr key={docente.id} style={{ backgroundColor: getColorByNivel(docente.nivel), color: '#000000' }}>
                  <td style={{ padding: '10px' }}>{docente.profesores.apellido_nombre}</td>
                  <td style={{ padding: '10px' }}>{docente.carreras.nombre_carrera}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{docente.nivel}</td>
                  <td style={{ padding: '10px' }}>{docente.materia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Docentes;
