import { startOfWeek, addDays, format } from "date-fns";

// Función para obtener los días de la semana (de lunes a sábado)
const getWeekDays = () => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Lunes como primer día
  return Array.from({ length: 6 }, (_, index) => format(addDays(start, index), "yyyy-MM-dd"));
};

const weekDays = getWeekDays();

const generarEventosCalendar = (horarios) => {
  if (!Array.isArray(horarios) || horarios.length === 0) {
    console.error("El array de horarios está vacío o no es válido.");
    return [];
  }

  return horarios.map((horario) => {
    let fechaBase;
    const diaDeLaSemana = horario.dia;

    // Asignamos la fecha correspondiente al día
    switch (diaDeLaSemana) {
      case "LUNES":
        fechaBase = weekDays[0];
        break;
      case "MARTES":
        fechaBase = weekDays[1];
        break;
      case "MIÉRCOLES":
        fechaBase = weekDays[2];
        break;
      case "JUEVES":
        fechaBase = weekDays[3];
        break;
      case "VIERNES":
        fechaBase = weekDays[4];
        break;
      case "SÁBADO":
        fechaBase = weekDays[5];
        break;
      default:
        console.warn(`Día de la semana inválido: ${diaDeLaSemana}`);
        return null; // Si el día no es válido, excluimos este horario
    }

    // Devolvemos el objeto de evento para FullCalendar
    return {
      title: horario.materia,
      start: `${fechaBase}T${horario.hora_inicio}`,
      end: `${fechaBase}T${horario.hora_fin}`,
      allDay: false,
      extendedProps: {
        profesor: horario.profesor_id,
        dia: horario.dia,
        comision: horario.comision,
        nivel: horario.nivel,
      },
    };
  }).filter((evento) => evento !== null); // Eliminamos los eventos nulos
};

export default generarEventosCalendar;
