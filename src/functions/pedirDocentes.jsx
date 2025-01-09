import supabase from "../conexionDatabase";

const pedirDocentes = async (escuelaId) => {
  try {
    const { data, error } = await supabase
      .from("profesores")
      .select("*")
      .eq("escuela_id", escuelaId);

    if (error) {
      throw new Error("Error al obtener los datos: " + error.message);
    }

    return data;
  } catch (error) {
    console.error("Error al obtener datos:", error);
    throw error;
  }
};

export default pedirDocentes;
