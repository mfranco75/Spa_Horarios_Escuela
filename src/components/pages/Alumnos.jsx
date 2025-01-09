import React, { useState, useEffect } from "react";
import { TextField, Box, Select, MenuItem, List, ListItem, ListItemButton, ListItemText, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import pedirCarreras from "../../functions/pedirCarreras";
import CalendarComponentAlumnos from "../CalendarComponentAlumnos";
import { useUser } from "../UserContext";

function Alumnos() {
  const { escuelaId } = useUser(); // Obtén escuelaId del contexto
  const [carreras, setCarreras] = useState([]);
  const [filteredCarreras, setFilteredCarreras] = useState([]);
  const [selectedCarreraId, setSelectedCarreraId] = useState(null);
  const [selectedNivel, setSelectedNivel] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch the list of carreras from the API
  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const carreras = await pedirCarreras(escuelaId);
        setCarreras(carreras);
        setFilteredCarreras(carreras);
        console.log("Carreras:", carreras);
      } catch (error) {
        console.error("Error fetching carreras:", error);
      }
    };
    fetchCarreras();
  }, []);

  // Handle selection of a carrera
  const handleCarreraClick = (id) => {
    setSelectedCarreraId(id);
  };

  const niveles = [0, 1, 2, 3, 4];
  const handleNivelChange = (event) => {
    setSelectedNivel(event.target.value);
  };

  

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 2,
        p: 2,
      }}
    >
      {/* Lista de carreras */}
      <Box
        sx={{
          flex: isMobile ? "none" : "1",
          maxWidth: isMobile ? "100%" : "300px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          maxHeight: isMobile ? "auto" : "100%",
          overflowY: isMobile ? "visible" : "auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Sombra aplicada
          borderRadius: "8px", // Bordes redondeados opcionales
          p: 2, // Espaciado interno para que se vea mejor
        }}
      >
        <Typography variant="h6" gutterBottom>
          Lista de Carreras
        </Typography>
        
        <List
          sx={{
            maxHeight: "600px", // Limita la altura visible de la lista
            overflowY: "auto", // Activa el desplazamiento si hay más de 10 carreras
          }}
        >
          {filteredCarreras.map((carrera) => (
            <ListItem key={carrera.id} disablePadding>
              <ListItemButton
                selected={carrera.id === selectedCarreraId}
                onClick={() => handleCarreraClick(carrera.id)}
              >
                <ListItemText primary={carrera.nombre_carrera} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* menu de niveles y Calendario */}
      <Box
        sx={{
          flex: "3",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 2,
          }}
        >
        <Typography variant="h6" gutterBottom>
        Seleccionar Nivel
      </Typography>
          <TextField
            label="Nivel"
            variant="outlined"
            select
            value={selectedNivel || ""}
            onChange={handleNivelChange}
            fullWidth
          >
            {niveles.map((nivel) => (
              <MenuItem key={nivel} value={nivel}>
                {nivel}
              </MenuItem>
            ))}
          </TextField>  
        </Box>
          <CalendarComponentAlumnos carreraId= {selectedCarreraId} nivel= {selectedNivel} escuelaId= {escuelaId}/>
        </Box>
    </Box>
  );
}

export default Alumnos;
