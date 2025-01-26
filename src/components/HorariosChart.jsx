import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const HorariosChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hora" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="LUNES" fill="#8884d8" />
        <Bar dataKey="MARTES" fill="#82ca9d" />
        <Bar dataKey="MIÉRCOLES" fill="#ffc658" />
        <Bar dataKey="JUEVES" fill="#ff8042" />
        <Bar dataKey="VIERNES" fill="#0088FE" />
        <Bar dataKey="SÁBADO" fill="#00C49F" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HorariosChart;
