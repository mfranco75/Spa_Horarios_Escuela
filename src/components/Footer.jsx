import React from "react";
import { Box, Grid2, Typography } from "@mui/material";
import reactLogo from "../assets/React_logo.png"; // Ruta al logo de React
import supabaseLogo from "../assets/supabase-logo-icon.png"; // Ruta al logo de Supabase
import muiLogo from "../assets/material-ui-48.png"; // Ruta al logo de MUI


const Footer = () => {
  const technologies = [
    { name: "React", logo: reactLogo },
    { name: "Supabase", logo: supabaseLogo },
    { name: "MUI", logo: muiLogo },
    
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5", // Color de fondo del footer
        padding: 4,
        mt: 6, // Espaciado superior
        textAlign: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Desarrollado en
      </Typography>
      <Grid2 container spacing={2} justifyContent="center">
        {technologies.map((tech, index) => (
          <Grid2 item xs={6} sm={3} key={index}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={tech.logo}
                alt={tech.name}
                sx={{
                  width: 50,
                  height: 50,
                  mb: 1, // Margen inferior para separar texto y logo
                }}
              />
              <Typography variant="body1">{tech.name}</Typography>
            </Box>
          </Grid2>
        ))}
      </Grid2>
      
    </Box>
  );
};

export default Footer;
