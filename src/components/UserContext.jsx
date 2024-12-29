import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../conexionDatabase.js';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
      if (sessionError) {
        console.error('Error al obtener la sesión:', sessionError);
        setUser(null);
        setRole(null);
        return;
      }
  
      if (sessionData.session) {
        const user = sessionData.session.user;
        setUser(user);
        fetchUserRole(user.id);
      } else {
        setUser(null);
        setRole(null);
      }
    };
  
    const fetchUserRole = async (userId) => {
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
  
      if (error) {
        console.error('Error al obtener el rol del usuario:', error);
        return;
      }
  
      setRole(userData?.role || null);
    };
  
    // Escuchar cambios en el estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
      }
    });
  
    checkSession();
  
    // Limpieza de la suscripción al desmontar
    return () => {
      authListener.subscription.unsubscribe(); // Cambiado para usar el método correcto
    };
  }, []);
  
  
  return (
    <UserContext.Provider value={{ user, role, setUser, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
