import supabase from "../conexionDatabase";


const pedirHorariosCompleto = async () => {
    try {
        // Consulta con Supabase usando joins
        const { data, error } = await supabase
            .from('horarios')
            .select(`
                *,
                profesores (apellido_nombre),
                carreras (nombre_carrera)
            `)
        

        // Manejo de errores en la consulta
        if (error) {
            console.error("Error en la consulta:", error.message);
            throw new Error("Error al obtener los horarios");
        }

        // Verificar si hay datos
        if (data.length === 0) {
            return { message: "No se encontraron horarios", data: [] };
        }

        return { message: "Horarios encontrados", data };

    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export default pedirHorariosCompleto;
