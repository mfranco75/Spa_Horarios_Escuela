import { useEffect, useState } from "react";
import supabase from "../conexionDatabase";

const useFetchHorarios = (escuelaId) => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const { data, error } = await supabase
          .from("horarios")
          .select("*")
          .eq("escuela_id", escuelaId);

        if (error) throw error;

        setHorarios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (escuelaId) fetchHorarios();
  }, [escuelaId]);

  return { horarios, loading, error };
};

export default useFetchHorarios;
