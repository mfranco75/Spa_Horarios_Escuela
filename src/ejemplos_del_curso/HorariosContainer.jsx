import { useState, useEffect } from "react";
import pedirHorarios from "./pedirHorarios";
import ListaDeHorarios from "./ListaDeHorarios";
import generarEventosCalendar from "./generarEventosCalendar";

const HorariosContainer = () => {
  const [horarios, setHorarios] = useState([]); // Lista original de horarios
  const [eventos, setEventos] = useState([]); // Eventos transformados para FullCalendar
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(null); // Manejo de errores

  useEffect(() => {
    setLoading(true);
    pedirHorarios()
      .then((res) => {
        setHorarios(res);
        const eventosGenerados = generarEventosCalendar(res); // Generar eventos
        setEventos(eventosGenerados);
      })
      .catch((err) => {
        setError("Hubo un error al cargar los horarios.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading && <p>Cargando horarios...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <>
          <ListaDeHorarios horarios={horarios} /> {/* Lista original */}
          <pre>{JSON.stringify(eventos, null, 2)}</pre> {/* Mostrar eventos generados */}
        </>
      )}
    </div>
  );
};

export default HorariosContainer;
