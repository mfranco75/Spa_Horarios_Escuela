import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role } = useUser();

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no coincide con el rol requerido, redirigir a otra página
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace/>;
  }

  return children;
};

export default ProtectedRoute;
