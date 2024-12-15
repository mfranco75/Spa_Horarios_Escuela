import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../conexionDatabase.js';
import "../styles/Navbar.css"

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
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




/*import { Link } from "react-router-dom";

import "../styles/Navbar.css"

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Gestión de Escuela</div>
      <ul className="navbar-menu">
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/horarios">Horarios</Link></li>
        <li><Link to="/docentes">Docentes</Link></li>
        <li><Link to="/alumnos">Alumnos</Link></li>
        <li><Link to="/informes">Informes</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
*/
