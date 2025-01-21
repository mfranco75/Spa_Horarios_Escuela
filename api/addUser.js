import { createClient } from "@supabase/supabase-js";

// Configura Supabase con tu clave de servicio (service_role key)
// Esta clave NUNCA debe ser expuesta en el frontend.
const supabase = createClient(
  "https://ksiyrzymdgkmzuyxeuqv.supabase.co",
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    console.log("Datos recibidos en el body:", req.body);  // BORAR ESTA LÍNEA

    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ error: "Método no permitido. Usa POST." });
    }
  
    const { email, apellido_nombre, role = "user", escuela_id } = req.body;
    console.log("Campos desestructurados:", { email, apellido_nombre, role, escuela_id }); // BORRAR ESTA LÍNEA 
  
    // Validar datos de entrada
    if (!email || !apellido_nombre || !escuela_id) {
        console.error("Faltan datos obligatorios"); // BORRAR ESTA LÍNEA
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios: email, apellido_nombre, escuela_id." });
    }
  
    try {
      // Crear el usuario en Supabase Auth
      const { data: user, error: authError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true, // Enviar correo de invitación
      });
  
      if (authError) {
        console.error("Error al crear el usuario en Auth:", authError);
        throw authError;
      }
  
      // Insertar en la tabla `users`
      const { error: insertError } = await supabase.from("users").insert({
        id: user.id, // ID del usuario creado en Auth
        email,
        apellido_nombre,
        role,
        escuela_id,
      });
  
      if (insertError) {
        console.error("Error al insertar en la tabla users:", insertError);
        throw insertError;
      }
  
      // Respuesta exitosa
      return res.status(200).json({ message: "Usuario creado con éxito", user });
    } catch (error) {
      console.error("Error inesperado:", error);
      return res.status(500).json({ error: error.message });
    }
  }