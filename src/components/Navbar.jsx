import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../conexionDatabase.js';
import "../styles/Navbar.css"
import { set } from 'date-fns/fp';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log('Usuario actual:', data?.user); // Depuración
      console.error('Error al obtener el usuario:', error); // Depuración
      if (error) {
        console.error('Error al obtener el usuario:', error);
      }
      setUser(data.user);
    };

    fetchUser();
    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    //console.log('Cambio de sesión detectado:', session?.user);
    setUser(session?.user || null);
    });
    
    
    // Limpieza de la suscripción al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Gestión de Escuela</div>
      <ul className="navbar-menu">
        <li><Link to="/horarios">Horarios</Link></li>
        <li><Link to="/docentes">Docentes</Link></li>
        <li><Link to="/alumnos">Alumnos</Link></li>
        <li><Link to="/informes">Informes</Link></li>
        {user ? (
          <li>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </li>
        ) : (
          <li><Link to="/login">Iniciar sesión</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
