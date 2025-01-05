import supabase from "../conexionDatabase";

const pedirHorariosCarreraNivel = async (carreraId, nivel) => {
  try {
    // Validación de parámetros
    if (!carreraId || nivel === null || nivel === undefined) {
      throw new Error("El ID de la carrera y el nivel son requeridos");
    }
    
    // Consulta con Supabase usando joins
    const { data, error } = await supabase
      .from("horarios")
      .select(`
        *,
        profesores (apellido_nombre),
        carreras (nombre_carrera)
      `)
      .eq("carrera_id", carreraId)
      .eq("nivel", nivel);

    // Manejo de errores en la consulta
    if (error) {
      console.error("Error en la consulta:", error.message);
      throw new Error("Error al obtener los horarios");
    }

    // Verificar si hay datos
    if (data.length === 0) {
      return { message: "No se encontraron horarios para la carrera y nivel especificados", data: [] };
    }
    
    return { message: "Horarios encontrados", data };
  } catch (error) {
    console.error(`Error al obtener los horarios para carrera ID ${carreraId}:`, error.message);
    throw error;
  }
};

export default pedirHorariosCarreraNivel;

