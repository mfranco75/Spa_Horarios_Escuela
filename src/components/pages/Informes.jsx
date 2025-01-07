import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import TotalDocentes from "../TotalDocentes";
import AulasPorHorario from "../AulasPorHorario.jsx";

const Informes = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Informes
      </Typography>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Docentes por Carrera" />
        <Tab label="Uso de Aulas por Horario" />
      </Tabs>
      <Box sx={{ marginTop: 4 }}>
        {selectedTab === 0 && <TotalDocentes />}
        {selectedTab === 1 && <AulasPorHorario />}
      </Box>
    </Box>
  );
};

export default Informes;
