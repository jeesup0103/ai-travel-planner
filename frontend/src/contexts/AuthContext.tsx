import React, { createContext, useContext, useState } from 'react';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development
const mockUser: User = {
  id: '1',
  email: 'dev@example.com',
  name: 'Developer',
  picture: 'https://via.placeholder.com/150',
  preferences: {
    travelPreferences: ['Beaches', 'Mountains', 'Cities']
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser); // Always return mock user
  const [loading, setLoading] = useState(false); // No loading state needed

  const login = async (token: string) => {
    // No-op for development
    console.log('Login called with token:', token);
  };

  const logout = () => {
    // No-op for development
    console.log('Logout called');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};