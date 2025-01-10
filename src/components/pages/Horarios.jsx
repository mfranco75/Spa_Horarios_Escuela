import React, { useState, useEffect } from "react";
import { TextField, Box, List, ListItem, ListItemButton, ListItemText, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import pedirDocentes from "../../functions/pedirDocentes";
import { useUser } from "../UserContext"; // Asegúrate de importar el contexto

function Horarios({ CalendarComponent }) {
  const { escuelaId } = useUser(); // Obtén escuelaId del contexto
  const [docentes, setDocentes] = useState([]);
  const [filteredDocentes, setFilteredDocentes] = useState([]);
  const [selectedDocenteId, setSelectedDocenteId] = useState(null);
  const [filterText, setFilterText] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        const docentes = await pedirDocentes(escuelaId); // Pasa escuelaId como argumento
        const sortedDocentes = docentes.sort((a, b) =>
          a.apellido_nombre.localeCompare(b.apellido_nombre)
        );
        setDocentes(sortedDocentes);
        setFilteredDocentes(sortedDocentes);
      } catch (error) {
        console.error("Error fetching docentes:", error);
      }
    };

    if (escuelaId) {
      fetchDocentes();
    }
  }, [escuelaId]); // Vuelve a ejecutar si cambia escuelaId

  const handleDocenteClick = (id) => {
    setSelectedDocenteId(id);
  };

  const handleFilterChange = (event) => {
    const text = event.target.value.toLowerCase();
    setFilterText(text);
    setFilteredDocentes(
      docentes.filter((docente) =>
        docente.apellido_nombre.toLowerCase().includes(text)
      )
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 2, p: 2 }}>
      {/* Lista de docentes */}
      <Box
        sx={{
          flex: isMobile ? "none" : "1",
          maxWidth: isMobile ? "100%" : "300px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          maxHeight: isMobile ? "auto" : "100%",
          overflowY: isMobile ? "visible" : "auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "8px",
          p: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Lista de Docentes
        </Typography>
        <TextField
          label="Buscar docente"
          variant="outlined"
          value={filterText}
          onChange={handleFilterChange}
          fullWidth
        />
        <List
          sx={{
            maxHeight: "600px",
            overflowY: "auto",
          }}
        >
          {filteredDocentes.map((docente) => (
            <ListItem key={docente.id} disablePadding>
              <ListItemButton
                selected={docente.id === selectedDocenteId}
                onClick={() => handleDocenteClick(docente.id)}
              >
                <ListItemText primary={docente.apellido_nombre} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Calendario */}
      <Box sx={{ flex: "3", width: "100%" }}>
        <CalendarComponent docenteId={selectedDocenteId} escuelaId={escuelaId} />
      </Box>
    </Box>
  );
}

export default Horarios;


