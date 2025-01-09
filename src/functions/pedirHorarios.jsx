import supabase from "../conexionDatabase";
import { useUser } from "../components/UserContext";

const pedirHorarios = async (profesorId, escuelaId) => {
    
    try {
        // Validación del ID del profesor
        if (!profesorId) {
            throw new Error("El ID del profesor es requerido");
        }
        //console.log("ID del profesor recibido:", profesorId);


        // Consulta con Supabase usando joins
        const { data, error } = await supabase
            .from('horarios')
            .select(`
                *,
                profesores (apellido_nombre),
                carreras (nombre_carrera)
            `)
            .eq('profesor_id', profesorId)
            .eq('escuela_id', escuelaId);

        // Manejo de errores en la consulta
        if (error) {
            console.error("Error en la consulta:", error.message);
            throw new Error("Error al obtener los horarios");
        }

        // Verificar si hay datos
        if (data.length === 0) {
            return { message: "No se encontraron horarios para el profesor especificado", data: [] };
        }

        return { message: "Horarios encontrados", data };

    } catch (error) {
        console.error(`Error al obtener los horarios del profesor con ID ${profesorId}:`, error.message);
        throw error;
    }
};

export default pedirHorarios;

