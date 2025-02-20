import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useUser } from './UserContext';
import supabase from '../conexionDatabase.js';
import { set } from 'date-fns';

const Navbar = () => {
  const { user, role, escuelaId, setUser } = useUser();
  const navigate = useNavigate();
  const [nombreEscuela, setNombreEscuela] = useState('');

  // Obtener el nombre de la escuela
  useEffect(() => {
    const fetchNombreEscuela = async () => {
      if (escuelaId !== null) {
        const { data, error } = await supabase
          .from('escuelas')
          .select('nombre')
          .eq('id', escuelaId)
          .single();

        if (error) {
          console.error('Error al obtener el nombre de la escuela:', error.message);
        } else if (data) {
          setNombreEscuela(data.nombre);
          
        }
      }
    };

    fetchNombreEscuela();
  }, [escuelaId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setNombreEscuela('');
    navigate('/');
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ marginRight: 1 }}>
            Gestión de Escuela
          </Typography>
          {nombreEscuela && (
            <Typography
              variant="subtitle1"
              sx={{
                color: 'secondary.main',
                fontWeight: 'bold',
              }}
            >
              {nombreEscuela}
            </Typography>
          )}
        </Box>

        {user ? (
          <>
            <Button color="inherit" component={Link} to="/">
              Inicio
            </Button>
            <Button color="inherit" component={Link} to="/horarios">
              Horarios
            </Button>
            <Button color="inherit" component={Link} to="/carreras">
              Carreras
            </Button>
            <Button color="inherit" component={Link} to="/informes">
              Informes
            </Button>
            {role === 'admin' && (
              <>
                <Button color="inherit" component={Link} to="/administrador">
                  Administrador
                </Button>
              </>
            )}
           
            <Button sx={{ color: 'secondary.main' }} onClick={handleLogout}>
              Cerrar sesión
            </Button>
            <Typography
              variant="caption"
              display="block"
              sx={{
                textTransform: 'lowercase',
                ml: 1,
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {user.email}
            </Typography>
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
