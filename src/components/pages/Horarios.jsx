import React, { useState, useEffect } from "react";
import pedirDocentes from "../../functions/pedirDocentes";
import "../../styles/Horarios.css"

function Horarios({ CalendarComponent }) {
  const [docentes, setDocentes] = useState([]);
  const [selectedDocenteId, setSelectedDocenteId] = useState(null);

  // Fetch the list of docentes from the API
  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        const docentes = await pedirDocentes();
        setDocentes(docentes); // Actualiza el estado con los datos obtenidos
      } catch (error) {
        console.error("Error fetching docentes:", error);
      }
    };
    fetchDocentes();
    
  }, []);

  // Handle selection of a docente
  const handleDocenteClick = (id) => {
    setSelectedDocenteId(id);
  };

  return (
    <div className="horarios-container">
      <aside className="sidebar">
        <h2>Lista de Docentes</h2>
        <ul>
          {docentes.map((docente) => (
            <li
              key={docente.id}
              className={docente.id === selectedDocenteId ? "active" : ""}
              onClick={() => handleDocenteClick(docente.id)}
              
            >
              {docente.apellido_nombre}
            
            </li>
          ))}
        </ul>
      </aside>
      <main className="calendar-container">
        <CalendarComponent docenteId={selectedDocenteId} />
      </main>
    </div>
  );
}

export default Horarios;


/*
// Fetch docentes desde el Backend de Node js
  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_ENDPOINT_PROFESORES);
        const data = await response.json();
        setDocentes(data);
      } catch (error) {
        console.error("Error fetching docentes:", error);
      }
    };
    fetchDocentes();
    
  }, []);

  */


