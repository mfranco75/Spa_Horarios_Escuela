import { useState, useEffect } from 'react';
import pedirHorarios from './pedirHorarios';
import ListaDeHorarios from './ListaDeHorarios';
import generarEventosCalendar from './generarEventosCalendar.jsx';

const FullCalendarContainer = () => {
  const [horarios, setHorarios] = useState([]);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datos = await pedirHorarios();
        setHorarios(datos);
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
        // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (horarios.length > 0) { // Verificar si horarios tiene datos
      const nuevosEventos = generarEventosCalendar(horarios);
      setEventos(nuevosEventos);
    }
  }, [horarios]);

  return (
    <div>
      <ListaDeHorarios horarios={horarios} eventos={eventos} />
    </div>
  );
};

export default FullCalendarContainer;