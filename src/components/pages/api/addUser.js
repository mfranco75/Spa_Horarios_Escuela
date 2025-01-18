import { createClient } from "@supabase/supabase-js";

// Configura Supabase con tu clave de servicio (service_role key)
// Esta clave NUNCA debe ser expuesta en el frontend.
const supabase = createClient(
  "https://ksiyrzymdgkmzuyxeuqv.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, apellido_nombre, role = "user", escuela_id } = req.body;

    if (!email || !apellido_nombre || !escuela_id) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
      return;
    }

    try {
      // Crear usuario en Supabase Auth
      const { data: user, error: authError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true, // Envía automáticamente el correo de invitación
      });

      if (authError) throw authError;

      // Insertar datos adicionales en la tabla `users`
      const { error: insertError } = await supabase.from("users").insert({
        id: user.id, // ID del usuario creado en Auth
        email,
        apellido_nombre,
        role,
        escuela_id,
      });

      if (insertError) throw insertError;

      res.status(200).json({ message: "Usuario creado con éxito" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
