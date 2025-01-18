import React from 'react';
import { 
  Typography, 
  Container, 
  Grid2, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Box 
} from '@mui/material';

// Importar imágenes locales
import demo1 from '../../assets/demoweb1.png';
import demo2 from '../../assets/demoweb2.png';
import demo3 from '../../assets/demoweb3.png';
import demo4 from '../../assets/demoweb4.png';

import { Link } from 'react-router-dom';
import Footer from '../Footer';

function Home() {
  return (
    <Container sx={{ width: "100%" , padding : 4 }}>
        {/* Hero Section */}
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Bienvenido a Gestión de Escuela
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Gestiona horarios, docentes, carreras y más desde una plataforma intuitiva.
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Explorar Funcionalidades
          </Button>
        </Box>

        {/* Funcionalidades Section */}
        <Typography variant="h4" gutterBottom>
          Funcionalidades Destacadas
        </Typography>
        <Grid2 container spacing={4}>
          {[
            { title: 'Gestión de Horarios', description: 'Organiza horarios de clases de forma eficiente.' },
            { title: 'Administración de Docentes', description: 'Mantén actualizada la información de tu equipo docente.' },
            { title: 'Panel de Administrador', description: 'Crea usuarios y asigna roles.' },
            { title: 'Visualización de Calendarios', description: 'Accede a calendarios interactivos con filtros personalizados.' },
            { title: 'Informes y Estadísticas', description: 'Visualiza gráficas de estadíticas y genera informes.' },
          ].map((feature, index) => (
            <Grid2 xs={12} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>

       {/* Galería Section */}
        <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
          Galería
        </Typography>
        <Grid2 
          container 
          spacing={2} 
          sx={{ justifyContent: 'center', alignItems: 'stretch' }} // Centrar y alinear correctamente
        >
          {[demo1, demo2, demo3, demo4].map((image, index) => (
            <Grid2 
              xs={12} 
              sm={6} 
              md={4} 
              lg={3} 
              key={index} 
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} // Centrar el contenido
            >
              <Box
                sx={{
                  overflow: 'hidden', // Oculta las partes que sobresalen
                  borderRadius: 2, // Bordes redondeados
                  position: 'relative', // Necesario para el hover
                  width: '100%', // Asegura que ocupe todo el ancho de la columna
                  maxWidth: '400px', // Tamaño máximo uniforme
                  height: '400px', // Altura uniforme
                  '&:hover img': {
                    transform: 'scale(1.1)', // Agrandar ligeramente al pasar el mouse
                    transition: 'transform 0.3s ease-in-out', // Transición suave
                  },
                }}
              >
                <Box
                  component="img"
                  src={image}
                  alt={`Demo ${index + 1}`}
                  sx={{
                    width: '100%', // Asegura que ocupe todo el ancho del contenedor
                    height: '100%', // Asegura que ocupe todo el alto del contenedor
                    objectFit: 'cover', // Ajusta la imagen al contenedor
                    transition: 'transform 0.3s ease-in-out', // Transición inicial
                  }}
                />
              </Box>
            </Grid2>
          ))}
        </Grid2>


        {/* Call to Action Section */}
        <Box textAlign="center" sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            ¡Empieza a gestionar tu escuela hoy!
          </Typography>
          <Button variant="contained" 
                  color="secondary" 
                  size="large"
                  component={Link}
                  to="/register">
            Registrarse
          </Button>
        </Box>

        <Footer />
      </Container>
  );
}

export default Home;
