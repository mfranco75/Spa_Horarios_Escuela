import React from "react";
import useFetchHorarios from "./useFetchHorarios";
import HorariosChart from "./HorariosChart";
import { CircularProgress, Alert } from "@mui/material";
import { useUser } from './UserContext.jsx';

const processHorariosData = (horarios) => {
  const dias = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
  const horas = Array.from({ length: 15 }, (_, i) => `${9 + i}:00`); // Horas de 09:00 a 23:00
  
  const dataPorHora = horas.map((hora) => {
    const materiasPorDia = dias.map((dia) => {
      const count = horarios.filter(
        (horario) =>
          horario.dia === dia &&
          horario.hora_inicio <= hora &&
          horario.hora_fin > hora
      ).length;
      return count;
    });

    return {
      hora,
      ...dias.reduce((acc, dia, idx) => {
        acc[dia] = materiasPorDia[idx];
        return acc;
      }, {}),
    };
  });

  // Calcular totales por día y total general
  const totalesPorDia = dias.reduce((acc, dia) => {
    acc[dia] = horarios.filter(horario => horario.dia === dia).length;
    return acc;
  }, {});

  const totalGeneral = horarios.length;

  return { dataPorHora, totalesPorDia, totalGeneral };
};

const InformeHorarios = () => {
  const { escuelaId } = useUser();
  const { horarios, loading, error } = useFetchHorarios(escuelaId);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const { dataPorHora, totalesPorDia, totalGeneral } = processHorariosData(horarios);

  return (
    <div>
      <h2>Informe de Horarios</h2>
      <HorariosChart data={dataPorHora} />
      <h3>Totales por Día</h3>
      <ul>
        {Object.entries(totalesPorDia).map(([dia, total]) => (
          <li key={dia}>
            {dia}: {total} horas
          </li>
        ))}
      </ul>
      <h3>Total General</h3>
      <p>{totalGeneral} horas</p>
    </div>
  );
};

export default InformeHorarios;


/*import React from "react";
import useFetchHorarios from "./useFetchHorarios";
import HorariosChart from "./HorariosChart";
import { CircularProgress, Alert } from "@mui/material";
import { useUser } from './UserContext.jsx';

const processHorariosData = (horarios) => {
    const dias = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    const horas = Array.from({ length: 15 }, (_, i) => `${9 + i}:00`); // Horas de 09:00 a 23:00
  
    const dataPorHora = horas.map((hora) => {
      const materiasPorDia = dias.map((dia) => {
        const count = horarios.filter(
          (horario) =>
            horario.dia === dia &&
            horario.hora_inicio <= hora &&
            horario.hora_fin > hora
        ).length;
        return count;
      });
  
      return {
        hora,
        ...dias.reduce((acc, dia, idx) => {
          acc[dia] = materiasPorDia[idx];
          return acc;
        }, {}),
      };
    });
    
    return dataPorHora;
  };
  

const InformeHorarios = () => {
  const { escuelaId } = useUser();
  const { horarios, loading, error } = useFetchHorarios(escuelaId);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const data = processHorariosData(horarios);

  return (
    <div>
      <h2>Informe de Horarios</h2>
      <HorariosChart data={data} />
    </div>
  );
};

export default InformeHorarios;

*/