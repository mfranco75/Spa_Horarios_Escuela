import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Aquí puedes manejar lógica adicional si necesitas (por ejemplo, cargar datos del usuario)
    console.log('El usuario ha llegado desde el enlace de Supabase');

    // Redirigir al usuario al dashboard o página principal
    navigate('/'); // Home
  }, [navigate]);

  return (
    <div>
      <p>Procesando... Serás redirigido en breve.</p>
    </div>
  );
}

export default AuthCallback;
