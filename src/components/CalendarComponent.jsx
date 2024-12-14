import React, { useEffect } from "react";
import Calendario from "./Calendario";
import pedirHorarios from "../functions/pedirHorarios";


function CalendarComponent({ docenteId }) {
  useEffect(() => {
    if (docenteId) {
      // Fetch and update calendar data based on docenteId
      pedirHorarios(docenteId)
      console.log(`Updating calendar for docente ID: ${docenteId}`);
    }
  }, [docenteId]);

  return (
    <div>
      <h2>Calendario</h2>
      <p>{docenteId ? `Mostrando horarios para el docente ID: ${docenteId}` : "Selecciona un docente para ver su calendario."}</p>
      <Calendario id={docenteId}/>
    </div>
  );
}

export default CalendarComponent;
