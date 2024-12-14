import { useEffect, useState } from "react";
import pedirDocentes from "../../functions/pedirDocentes";

function Docentes() {
  const [docentes, setDocentes] = useState([]); // Estado para almacenar los docentes
  const [selectedDocenteId, setSelectedDocenteId] = useState(null); // Estado para el docente seleccionado

  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        const profes = await pedirDocentes();
        setDocentes(profes); // Actualiza el estado con los datos obtenidos
      } catch (error) {
        console.error("Error al obtener los docentes:", error);
      }
    };

    fetchDocentes(); // Llama a la función para obtener los docentes
  }, []);

  const handleDocenteClick = (id) => {
    setSelectedDocenteId(id); // Actualiza el docente seleccionado
  };

  return (
    <div>
      <h1>Página de Docentes</h1>
      <p>Buscar Docentes</p>
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
    </div>
  );
}

export default Docentes;
