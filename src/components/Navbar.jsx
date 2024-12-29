import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useUser } from './UserContext';
import supabase from '../conexionDatabase.js';


const Navbar = () => {
  const { user, role, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Gestión de Escuela
        </Typography>

        {user ? (
          <>
            <Button color="inherit" component={Link} to="/">
              Inicio
            </Button>
            <Button color="inherit" component={Link} to="/horarios">
              Horarios
            </Button>
            {role === 'admin' && (
              <>
                <Button color="inherit" component={Link} to="/docentes">
                  Docentes
                </Button>
                <Button color="inherit" component={Link} to="/administrador">
                  Administrador
                </Button>
              </>
            )}
            <Button color="inherit" component={Link} to="/alumnos">
              Alumnos
            </Button>
            <Button color="inherit" component={Link} to="/informes">
              Informes
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Iniciar sesión
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
