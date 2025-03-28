import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const session = await AsyncStorage.getItem('supabase.auth.token');
      if (session) setIsAuthenticated(true);
    };
    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    // Salvar dados fictícios
    await AsyncStorage.setItem(
      'supabase.auth.token',
      JSON.stringify({ user: { email } }),
    );
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('supabase.auth.token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
