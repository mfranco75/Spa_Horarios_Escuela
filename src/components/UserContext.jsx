import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../conexionDatabase.js';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        // Obtener el rol del usuario desde la tabla `users`
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();
        if (userData) {
          setRole(userData.role);
        }
      }
    };
    checkUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, role, setUser, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
