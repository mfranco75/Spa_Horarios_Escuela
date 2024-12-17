import React, { useEffect } from "react";
import Calendario from "./Calendario";
import pedirHorarios from "../functions/pedirHorarios";
import "../styles/CalendarComponent.css"



function CalendarComponent({ docenteId }) {
  useEffect(() => {
    if (docenteId) {
      // Fetch and update calendar data based on docenteId
      pedirHorarios(docenteId)
      
    }
  }, [docenteId]);

  return (
    <div className="calendar-wrapper">
      <h2>Calendario</h2>
      <p className="calendar-message">
        {docenteId
          ? `Mostrando horarios para el docente ID: ${docenteId}`
          : "Selecciona un docente para ver su calendario."}
      </p>
      <div className="calendar-content">
        <Calendario id={docenteId} />
      </div>
    </div>
  );
}  
 

export default CalendarComponent;


