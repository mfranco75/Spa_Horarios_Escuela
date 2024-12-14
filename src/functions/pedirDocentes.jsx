import supabase from "../conexionDatabase";

const pedirDocentes = async () => {
  try {
    const { data, error } = await supabase.from("profesores").select("*");

    if (error) {
      throw new Error("Error al obtener los datos: " + error.message);
    }

    return data; // Devuelve directamente los datos
  } catch (error) {
    console.error("Error al obtener datos:", error);
    throw error;
  }
};

export default pedirDocentes