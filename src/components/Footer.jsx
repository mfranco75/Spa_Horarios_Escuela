import React from "react";
import "../styles/Footer.css"; // Importa el archivo CSS para el footer

function Footer() {
  return (
    <footer className="footer">
      <p>
        Desarrollado por <strong>Mariano Franco</strong> &copy; 2024
      </p>
      <p>
        Contacto:{" 223-518-7508 "}
        <a href="mailto:marianofranco1975@gmail.com">marianofranco1975@gmail.com</a>
      </p>
    </footer>
  );
}

export default Footer;
