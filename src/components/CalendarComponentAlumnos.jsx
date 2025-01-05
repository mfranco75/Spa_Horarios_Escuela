import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // Componente de FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid"; // Vista de cuadrícula diaria
import timeGridPlugin from "@fullcalendar/timegrid"; // Vista de cuadrícula horaria
import listPlugin from '@fullcalendar/list'; // Importar el plugin de lista
import interactionPlugin from "@fullcalendar/interaction"; // Interacciones como drag & drop
import esLocale from '@fullcalendar/core/locales/es'; // Importa el idioma español
import "../styles/CalendarComponent.css";
import pedirHorariosCarreraNivel from "../functions/pedirHorariosCarreraNivel";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // Estilos para tooltips
import generarEventosCalendar from "./generarEventosCalendar";
import "../styles/Calendario.css";


function CalendarComponentAlumnos({ carreraId, nivel }) {
  const [horarios, setHorarios] = useState([]);
  const [eventos, setEventos] = useState([]);
  
  useEffect(() => {
    if ((!carreraId || nivel === null || nivel === undefined)  ) return; // No hacemos nada si no hay un id
    pedirHorariosCarreraNivel(carreraId, nivel)
      .then((res) => {
        const eventosGenerados = generarEventosCalendar(res.data);
        //console.log("Datos devueltos por Supabase:", res.data);
        setEventos(eventosGenerados); // Guardamos los eventos en el estado
      })
      .catch((err) => {
        console.error("Error al cargar los horarios:", err);
      });
  }, [carreraId, nivel]);

  // Función para generar un color aleatorio a partir del nombre de la materia
  const generateColor = (name) => {
    let hash = 0;
    for (let i=0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 4) - hash );
    }
    const color = `hsl(${hash % 360}, 60%, 45%)`;
    return color
  }


  return (
    <div className="calendar-container">
      
      <FullCalendar

        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]} // Plugins para las vistas
        initialView="timeGridWeek" // Vista inicial (semana con horarios)
        locale={esLocale} // Cambia el idioma a español
        headerToolbar={{
          left: "prev,next today", // Botones de navegación
          center: "title", // Título centrado
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek", // Cambios de vista
        }}
        height="100%" // Ajusta la altura al contenedor 
        events={eventos} // Pasamos los eventos generados
        editable={false} // NO Permitir mover eventos
        selectable={true} // Permitir selección de rangos
        nowIndicator={true} // Línea indicadora de la hora actual
        slotMinTime="09:00:00"
        allDaySlot={false}
        eventDidMount={(info) => {
          const color = generateColor(info.event.title);
          info.el.style.backgroundColor = color;
          info.el.style.borderColor = color;
        }}
        eventMouseEnter={(info) => {
          // Crear un tooltip con tippy.js
          tippy(info.el, {
            content: `
              <strong>${info.event.title}</strong><br>
              Profesor: ${info.event.extendedProps.profesor}<br>
              Carrera: ${info.event.extendedProps.carrera}<br>
              Nivel: ${info.event.extendedProps.nivel}<br>
              Comisión: ${info.event.extendedProps.comision}<br>
              Dia de la semana: ${info.event.extendedProps.dia}
            `,
            allowHTML: true,
            theme: 'light'
          });
        }}
        eventDrop={(info) => {
          alert(`El evento ${info.event.title} fue movido.`);
        }}
      />
    </div>
  );
}

export default CalendarComponentAlumnos;


