const pedirHorarios = async (profesorId) => {
    try {
        const response = await fetch(import.meta.VITE_ENDPOINT_HORARIOS_PROFESOR, {
            method: 'GET', // Cambia a POST???
            headers: {
                'Content-Type': 'application/json', // Indica que el cuerpo es JSON
            },
            body: JSON.stringify({
                profesor_id: profesorId, // Envía el ID del profesor
            }),
        });

        if (!response.ok) {
            throw new Error("Error en la carga de datos");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los horarios:", error);
        throw error; // Maneja el error como prefieras
    }
};

export default pedirHorarios;











/*

const pedirHorarios = () => {
    return new Promise((resolve, reject) => {
        resolve(data)
    })
}

export default pedirHorarios
*/

