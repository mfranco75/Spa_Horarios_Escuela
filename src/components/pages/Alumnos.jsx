import React from 'react';
import Calendario from '../Calendario';

function Alumnos() {
  return (
    <div className="alumnoss-container">
      <aside className="a-sidebar">
        <h2>Lista de Docentes</h2>
        <ul>
            <li>UNO</li>
            <li>DOS</li>
            <li>TRES</li>
            <li>CUATRO</li>
            <li>CINCO</li>
        </ul>
      </aside>
      <main className="test-container">
        <Calendario />
      </main>
    </div>
  );
  }
  
  export default Alumnos;