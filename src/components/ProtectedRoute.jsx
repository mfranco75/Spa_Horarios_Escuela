import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role } = useUser();

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si el rol no coincide con el rol requerido, redirigir a otra página
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/horarios" />;
  }

  return children;
};

export default ProtectedRoute;



/*import React from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../conexionDatabase.js';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [userRole, setUserRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUserRole = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (!error) {
          setUserRole(userData.role);
        }
      }
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  if (loading) return <div>Cargando...</div>;

  if (!userRole || userRole !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;

/*import React, { useEffect, useState } from 'react';
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
*/