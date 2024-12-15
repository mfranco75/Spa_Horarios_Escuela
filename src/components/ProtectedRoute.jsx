import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../conexionDatabase.js';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;



/*import React from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../conexionDatabase.js';

const ProtectedRoute = ({ children }) => {
  const user = supabase.auth.getUser().then(({ data }) => data.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
*/