import { useState } from "react";
import  supabase  from "../../conexionDatabase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Crear usuario en el sistema de autenticación de Supabase
      const { user, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      // Insertar usuario en la tabla `users` con rol predeterminado
      const { error: insertError } = await supabase.from("users").insert([
        { id: user.id, email, role: "user" }, // Rol predeterminado
      ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      setMessage("¡Usuario registrado exitosamente!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
