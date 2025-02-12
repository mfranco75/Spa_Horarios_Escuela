import React from "react";
import { Button, Alert } from "@mui/material";
import supabase from "../conexionDatabase.js";

const CargarDatosDemo = () => {
  const escuelaIdDemo = 0; // ID de la escuela demo

  const cargarDatos = async () => {
    try {
      // Insertar carreras
      const { data: carrerasData, error: carrerasError } = await supabase
        .from("carreras")
        .insert([
          { nombre_carrera: "INGENIERÍA EN SISTEMAS", cantidad_de_niveles: 5, escuela_id: escuelaIdDemo },
          { nombre_carrera: "CONTADURÍA PÚBLICA", cantidad_de_niveles: 4, escuela_id: escuelaIdDemo },
          { nombre_carrera: "DISEÑO GRÁFICO", cantidad_de_niveles: 3, escuela_id: escuelaIdDemo },
        ])
        .select();

      if (carrerasError) throw carrerasError;

      const carreras = carrerasData;

      // Insertar profesores
      const profesoresFicticios = Array.from({ length: 10 }, (_, i) => ({
        apellido_nombre: `PROFESOR ${i + 1}`,
        dni: 10000000 + i,
        cuil: 20000000000 + i,
        celular: `123456789${i}`,
        correo_abc: `profesor${i + 1}@demo.com`,
        fecha_nacimiento: `197${i % 10}-01-01`,
        escuela_id: escuelaIdDemo,
      }));

      const { data: profesoresData, error: profesoresError } = await supabase
        .from("profesores")
        .insert(profesoresFicticios)
        .select();

      if (profesoresError) throw profesoresError;

      const profesores = profesoresData;

      // Insertar horarios
      const dias = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES"];
      const horariosFicticios = [];

      carreras.forEach((carrera, carreraIndex) => {
        for (let dia of dias) {
          for (let hora = 9; hora <= 17; hora += 2) {
            const profesor = profesores[(carreraIndex + hora) % profesores.length];
            horariosFicticios.push({
              profesor_id: profesor.id,
              dia,
              hora_inicio: `${hora}:00`,
              hora_fin: `${hora + 2}:00`,
              carrera_id: carrera.id,
              materia: `MATERIA ${hora / 2}`,
              comision: `COMISION ${carreraIndex + 1}`,
              nivel: (hora / 2) % carrera.cantidad_de_niveles + 1,
              aula: `AULA ${hora}`,
              escuela_id: escuelaIdDemo,
            });
          }
        }
      });

      const { error: horariosError } = await supabase
        .from("horarios")
        .insert(horariosFicticios);

      if (horariosError) throw horariosError;

      alert("Datos ficticios cargados correctamente para el modo demo.");
    } catch (error) {
      console.error("Error al cargar datos ficticios:", error);
      alert("Hubo un error al cargar los datos ficticios. Revisa la consola para más detalles.");
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={cargarDatos}>
        Cargar Datos Demo
      </Button>
    </div>
  );
};

export default CargarDatosDemo;
