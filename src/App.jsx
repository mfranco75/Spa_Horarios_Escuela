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
      main: '#80D8FF', // Cambia el color secundario
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
    <div className="App" display="grid" gridTemplateRows="auto 1fr auto" style={{ height: "100vh" }}>
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
        <Typography variant="body2" align="right" sx={{ marginLeft: "20px" }}>
          © 2024 Gestión de Escuela - Aplicación desarrollada por{' '}
          <Box
            component="span"
            sx={{ fontWeight: 'bold', color: '#80D8FF' }} // Bordo oscuro
          >
            Mariano Franco
          </Box>
          {' '}(<Box
            component="a"
            href="mailto:marianofranco1975@gmail.com"
            sx={{ 
              fontWeight: 'bold',
              textDecoration: 'none',
              color: "white",
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            marianofranco1975@gmail.com
          </Box>)
        </Typography>
      </Box>


    </div>
  );
}

export default App;
