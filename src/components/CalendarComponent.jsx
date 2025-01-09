import React, { useEffect } from "react";
import Calendario from "./Calendario";
import pedirHorarios from "../functions/pedirHorarios";
import "../styles/CalendarComponent.css"



function CalendarComponent({ docenteId, escuelaId }) {
  useEffect(() => {
    if (docenteId) {
      // Fetch and update calendar data based on docenteId
      pedirHorarios(docenteId, escuelaId)
      
    }
  }, [docenteId]);

  return (
    <div className="calendar-container">
      <Calendario id={docenteId} escuelaId={escuelaId}/>
    </div>
   
  );
}  
 

export default CalendarComponent;


