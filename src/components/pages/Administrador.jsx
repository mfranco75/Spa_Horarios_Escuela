import React, { useState } from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AdminDocentes from "./AdminDocentes.jsx"; 
import AdminUsuarios from "./AdminUsuarios"; 
import AdminCarreras from "./AdminCarreras";
import AdminHorarios from "./AdminHorarios";


const Administrador = () => {
  const [activeSection, setActiveSection] = useState("Usuarios");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  

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
    <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 2, p: 2 }}>
      {/* Barra lateral */}
      <Box
        sx={{
          width: "300px",
          height: "600px",
          backgroundColor: "primary.main",
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
              color: "white",
              "&:hover": { backgroundColor: "primary.main" },
            }}
          >
            {section}
          </Button>
        ))}
      </Box>

      {/* Contenido principal */}
      <Box
        
      >
        {renderSection()}
      </Box>
    </Box>
  );
};

export default Administrador;


