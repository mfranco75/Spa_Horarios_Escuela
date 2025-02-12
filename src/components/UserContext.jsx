import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../conexionDatabase.js';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [escuelaId, setEscuelaId] = useState(null); // Nuevo estado para escuela_id

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error al obtener la sesión:', sessionError);
        setUser(null);
        setRole(null);
        setEscuelaId(null); // Limpia escuela_id si hay error
        return;
      }

      if (sessionData.session) {
        const user = sessionData.session.user;
        setUser(user);
        fetchUserDetails(user.id); // Ahora obtiene rol y escuela_id
      } else {
        setUser(null);
        setRole(null);
        setEscuelaId(null);
      }
    };

    const fetchUserDetails = async (userId) => {
      const { data: userData, error } = await supabase
        .from('users')
        .select('role, escuela_id') // Selecciona ambos campos
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error al obtener los detalles del usuario:', error);
        return;
      }

      setRole(userData?.role || null);
      setEscuelaId(userData?.escuela_id || null); // Asigna escuela_id
    };

    // Escuchar cambios en el estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserDetails(session.user.id);
      } else {
        setUser(null);
        setRole(null);
        setEscuelaId(null);
      }
    });

    checkSession();

    // Limpieza de la suscripción al desmontar
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Nuevo: Función para iniciar sesión como usuario demo
  const loginAsDemo = () => {
    setUser({
      id: 'demo', // ID ficticio para el usuario demo
      email: 'demo@demo.com', // Email ficticio para modo demo
    });
    setRole('demo'); // Rol asignado al usuario demo
    setEscuelaId(0); // ID de la escuela demo
  };



  return (
    <UserContext.Provider value={{ user, role, escuelaId, setUser, setRole, setEscuelaId, loginAsDemo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
