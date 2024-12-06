import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // Componente de FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid"; // Vista de cuadrícula diaria
import timeGridPlugin from "@fullcalendar/timegrid"; // Vista de cuadrícula horaria
import listPlugin from '@fullcalendar/list'; // Importar el plugin de lista
import interactionPlugin from "@fullcalendar/interaction"; // Interacciones como drag & drop
import esLocale from '@fullcalendar/core/locales/es'; // Importa el idioma español
import pedirHorarios from "./pedirHorarios";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // Estilos para tooltips
import generarEventosCalendar from "./generarEventosCalendar";

const Calendario = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    pedirHorarios()
      .then((res) => {
        const eventosGenerados = generarEventosCalendar(res);
        setEventos(eventosGenerados); // Guardamos los eventos en el estado
      })
      .catch((err) => {
        console.error("Error al cargar los horarios:", err);
      });
  }, []);

  const generateColor = (name) => {
    let hash = 0;
    for (let i=0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 25) - hash );
    }
    const color = `hsl(${hash % 360}, 60%, 45%)`;
    return color
  }

  return (
    <div className="calendar-container">
      <h1>Calendario de Horarios</h1>
      <FullCalendar class = "calendar-container"

        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]} // Plugins para las vistas
        initialView="timeGridWeek" // Vista inicial (semana con horarios)
        locale={esLocale} // Cambia el idioma a español
        headerToolbar={{
          left: "prev,next today", // Botones de navegación
          center: "title", // Título centrado
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek", // Cambios de vista
        }}
        
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
              Profesór: ${info.event.extendedProps.profesor}<br>
              Comisión: ${info.event.extendedProps.comision}
            `,
            allowHTML: true,
            theme: 'light'
          });
        }}
        eventClick={(info) => {
          alert(`Evento: ${info.event.title}`);
          console.log(info.event.extendedProps); // Muestra más detalles del evento
        }}
        eventDrop={(info) => {
          alert(`El evento ${info.event.title} fue movido.`);
        }}
      />
    </div>
  );
};

export default Calendario;