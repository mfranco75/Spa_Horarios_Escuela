import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../conexionDatabase.js';
import { useUser } from '../UserContext.jsx';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Container,
  Paper,
} from '@mui/material';

import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser, setRole } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        setError(userError.message);
      } else {
        setUser(data.user);
        setRole(userData.role);

        if (userData.role === 'admin') {
          navigate('/administrador');
        } else {
          navigate('/horarios');
        }
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '64px', // Ajusta según la altura de tu navbar
        right: '16px',
        width: '300px',
      }}
    >
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Iniciar Sesión
          </Button>
          
          <Button 
            fullWidth
            type="submit"
            variant="contained"
            color="secondary" 
            sx={{ mt: 3 }}
            component={Link}
            to="/register">
            Registrarse
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;

/*

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../conexionDatabase.js';
import { useUser } from '../UserContext.jsx';
import '../../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser, setRole } = useUser();  // Aquí se obtienen las funciones setUser y setRole
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      // Obtener el rol del usuario desde la tabla `users`
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        setError(userError.message);
      } else {
        setUser(data.user);  // Actualizar el estado del usuario
        setRole(userData.role);  // Actualizar el estado del rol

        // Redirigir según el rol
        if (userData.role === 'admin') {
          navigate('/administrador');
        } else {
          navigate('/horarios');
        }
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="login-button" type="submit">Iniciar Sesión</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
*/