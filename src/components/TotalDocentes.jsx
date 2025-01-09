import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import supabase from "../conexionDatabase";
import { useUser } from "./UserContext";

const TotalDocentes = () => {
  const [data, setData] = useState([]);
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#a4de6c", "#d8854d", "#83a6ed", "#8dd1e1"];
  const { escuelaId } = useUser();

  const fetchTotalDocentes = async () => {
    try {
      const { data, error } = await supabase
        .from("horarios")
        .select("carrera_id, profesor_id, carreras(nombre_carrera)")
        .eq("escuela_id", escuelaId);

      if (error) throw new Error(error.message);

      const uniqueProfessors = {};
      data.forEach(({ carrera_id, profesor_id, carreras }) => {
        if (!uniqueProfessors[carrera_id]) {
          uniqueProfessors[carrera_id] = {
            nombre_carrera: carreras.nombre_carrera,
            profesores: new Set(),
          };
        }
        uniqueProfessors[carrera_id].profesores.add(profesor_id);
      });

      const result = Object.entries(uniqueProfessors)
        .map(([carrera_id, { nombre_carrera, profesores }]) => ({
          carrera_id,
          nombre_carrera,
          total: profesores.size,
        }))
        .sort((a, b) => b.total - a.total); // Ordenar de mayor a menor

      setData(result);
    } catch (error) {
      console.error("Error fetching total docentes:", error);
    }
  };

  useEffect(() => {
    fetchTotalDocentes();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Cantidad Total de Docentes por Carrera
      </Typography>
      {/* Gráfico de barras verticales */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombre_carrera" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {/* Gráfico de barras horizontales */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          Vista Horizontal: Total de Docentes por Carrera (Ordenado de Mayor a Menor)
        </Typography>
        <ResponsiveContainer width="100%" height={550}>
          <BarChart data={data} layout="vertical" barCategoryGap={25}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="nombre_carrera" type="category" width={200} />
            <Tooltip />
            <Bar dataKey="total">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default TotalDocentes;

