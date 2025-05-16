import React, { createContext, useState, useContext } from 'react';

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

   const logout = () => {
      setUser(null);
      setToken(null);
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
