import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
   _id: string;
   username: string;
   name: string;
   email: string;
}

interface AuthContextType {
   user: User | null;
   token: string | null;
   login: (user: User, token: string) => void;
   logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const [user, setUser] = useState<User | null>(null);
   const [token, setToken] = useState<string | null>(null);

   const login = (user: User, token: string) => {
      setUser(user);
      setToken(token);
   };

   const logout = async () => {
      // Clear the auth state
      setUser(null);
      setToken(null);

      // Also clear from AsyncStorage
      try {
         await AsyncStorage.removeItem('token');
         await AsyncStorage.removeItem('user');
      } catch (error) {
         console.error('Error clearing auth data:', error);
      }
   };

   return (
      <AuthContext.Provider value={{ user, token, login, logout }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) throw new Error('useAuth must be used within AuthProvider');
   return context;
};
