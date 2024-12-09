import { Link } from "react-router-dom";

import "../styles/Navbar.css"

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Gestión de Escuela</div>
      <ul className="navbar-menu">
        <li><Link to="/">Login</Link></li>
        <li><Link to="/horarios">Horarios</Link></li>
        <li><Link to="/docentes">Docentes</Link></li>
        <li><Link to="/alumnos">Alumnos</Link></li>
        <li><Link to="/informes">Informes</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
