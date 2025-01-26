import React from "react";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AulasPorHorario = () => {
  
  
  const data = [
  ];
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Uso de Aulas por Horario
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="materias"
            nameKey="periodo"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AulasPorHorario;

