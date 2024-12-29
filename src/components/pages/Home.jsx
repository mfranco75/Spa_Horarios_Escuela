import React from 'react';
import { Typography } from '@mui/material';

function Home() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Bienvenido a la aplicación
      </Typography>
      <Typography variant="body1">
        Aquí podrás gestionar los docentes, horarios y generar informes estadísticos.
      </Typography>
    </div>
  );
}

export default Home;
