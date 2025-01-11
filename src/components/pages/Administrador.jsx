import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AdminDocentes from "./AdminDocentes.jsx"; 
import AdminUsuarios from "./AdminUsuarios"; 
import AdminCarreras from "./AdminCarreras";
import AdminHorarios from "./AdminHorarios";


const Administrador = () => {
  const [activeSection, setActiveSection] = useState("Usuarios");

  // Lista de secciones
  const sections = ["Usuarios", "Carreras", "Horarios", "Docentes"];

  
  const renderSection = () => {
    switch (activeSection) {
      case "Usuarios":
        return <AdminUsuarios/>;
      case "Carreras":
        return <AdminCarreras/>;
      case "Horarios":
        return <AdminHorarios/>;
      case "Docentes":
        return <AdminDocentes/>;
      default:
        return <Typography>Selecciona una sección</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Barra lateral */}
      <Box
        sx={{
          width: "300px",
          height: "600px",
          backgroundColor: "grey.400",
          color: "white",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          overflowY: "auto",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Panel de Administración
        </Typography>
        {["Usuarios", "Carreras", "Horarios", "Docentes"].map((section) => (
          <Button
            key={section}
            onClick={() => setActiveSection(section)}
            variant="contained"
            sx={{
              backgroundColor: "primary.dark",
              color: "grey.200",
              "&:hover": { backgroundColor: "primary.main" },
            }}
          >
            {section}
          </Button>
        ))}
      </Box>

      {/* Contenido principal */}
      <Box
        sx={{
          flex: 1,
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {renderSection()}
      </Box>
    </Box>
  );
};

export default Administrador;


