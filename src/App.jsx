import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import supabase from "./conexionDatabase.js";
import { UserProvider } from "./components/UserContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./components/pages/Login";

import Horarios from "./components/pages/Horarios.jsx";
import Docentes from "./components/pages/Docentes.jsx";
import Alumnos from "./components/pages/Alumnos.jsx";
import Informes from "./components/pages/Informes.jsx";
import Administrador from "./components/pages/Administrador.jsx";
import CalendarComponent from "./components/CalendarComponent.jsx";
import Home from "./components/pages/Home.jsx"; // Asegúrate de tener este componente

import "./styles/App.css";
import Navbar from "./components/Navbar.jsx";

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Cambia el color principal
    },
    secondary: {
      main: '#f50057', // Cambia el color secundario
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Fuente de MUI
  },
});


function App() {
  const [user, setUser] = useState(null);  
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Router>
          <CssBaseline />
          <MainApp user={user} setUser={setUser} />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

function MainApp({ user, setUser }) {
  
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
    console.log(user)
  
  };

  return (
    <>
      {/* Barra de navegación */}
      
      <Navbar user={user} handleLogout={handleLogout} />

      {/* Contenido principal */}
      <Container sx={{ marginTop: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/horarios"
            element={
              <ProtectedRoute>
                <Horarios CalendarComponent={CalendarComponent} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/docentes"
            element={
              <ProtectedRoute requiredRole="admin">
                <Docentes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alumnos"
            element={
              <ProtectedRoute>
                <Alumnos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/informes"
            element={
              <ProtectedRoute>
                <Informes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/administrador"
            element={
              <ProtectedRoute requiredRole="admin">
                <Administrador />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#3f51b5",
          color: "white",
          padding: "10px 0",
          marginTop: "auto",
        }}
      >
        <Typography variant="body2" align="center">
          © 2024 Mi Aplicación - Todos los derechos reservados.
        </Typography>
      </Box>
    </>
  );
}

export default App;
