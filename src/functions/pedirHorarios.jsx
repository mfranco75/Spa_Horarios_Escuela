const pedirHorarios = async (profesorId) => {
    try {
        //const response = await fetch(import.meta.VITE_ENDPOINT_HORARIOS_PROFESOR , {
          const response = await fetch("http://localhost:3000/api/v1/horarios/buscap/", {
            method: 'POST', // Cambiado a POST
            headers: {
                'Content-Type': 'application/json', // Indicamos que el cuerpo es JSON
            },
            body: JSON.stringify({ profesor_id: String(profesorId) }), // Enviamos el ID como JSON
            
        });

        console.log("Cuerpo enviado:", JSON.stringify({ profesor_id: String(profesorId) }));

        if (!response.ok) {
            throw new Error("Error en la carga de datos");
        }

        const data = await response.json();
        console.log(data)
        return data;

    } catch (error) {
        console.error("Error al obtener los horarios:", profesorId);
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

