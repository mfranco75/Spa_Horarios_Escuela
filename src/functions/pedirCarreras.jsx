import supabase from "../conexionDatabase";


const pedirCarreras = async (escuelaId) => {
  
  try {
    const { data, error } = await supabase.from("carreras")
    .select("*")
    .eq("escuela_id", escuelaId);

    if (error) {
      throw new Error("Error al obtener los datos: " + error.message);
    }

    return data; // Devuelve directamente los datos
  } catch (error) {
    console.error("Error al obtener datos:", error);
    throw error;
  }
};

export default pedirCarreras