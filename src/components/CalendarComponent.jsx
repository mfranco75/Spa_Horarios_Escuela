import React, { useEffect } from "react";
import Calendario from "../ejemplos_del_curso/Calendario";


function CalendarComponent({ docenteId }) {
  useEffect(() => {
    if (docenteId) {
      // Fetch and update calendar data based on docenteId
      console.log(`Updating calendar for docente ID: ${docenteId}`);
    }
  }, [docenteId]);

  return (
    <div>
      <h2>Calendario</h2>
      <p>{docenteId ? `Mostrando horarios para el docente ID: ${docenteId}` : "Selecciona un docente para ver su calendario."}</p>
      <Calendario/>
    </div>
  );
}

export default CalendarComponent;
