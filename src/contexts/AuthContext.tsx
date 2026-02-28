import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'hotel_manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hotels: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const DEMO_USERS: { email: string; password: string; user: User }[] = [
  {
    email: 'hotel@demo.com',
    password: 'password123',
    user: {
      id: 'u1',
      name: 'Marco Rossi',
      email: 'hotel@demo.com',
      role: 'hotel_manager',
      hotels: ['h1'],
    },
  },
  {
    email: 'admin@demo.com',
    password: 'password123',
    user: {
      id: 'u2',
      name: 'Admin User',
      email: 'admin@demo.com',
      role: 'admin',
      hotels: [],
    },
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('starhotels_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found.user);
      localStorage.setItem('starhotels_user', JSON.stringify(found.user));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('starhotels_user');
    localStorage.removeItem('starhotels_onboarding');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
