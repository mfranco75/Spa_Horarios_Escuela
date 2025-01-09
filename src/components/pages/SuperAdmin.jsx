import React from 'react';

const SuperAdmin = () => {
    return (
        <div>
            <h1>Super Admin Page</h1>
            <p>Welcome to the Super Admin page!</p>
        </div>
    );
};

export default SuperAdmin;

/*
estructura de la tabla ESCUELAS

CREATE TABLE escuelas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  direccion VARCHAR(255),
  telefono VARCHAR(20),
  cue VARCHAR(20),
  clave_establecimiento VARCHAR (15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/
