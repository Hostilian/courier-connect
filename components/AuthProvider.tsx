'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; email: string; role: string } | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('cc_token');
      if (storedToken) {
        // In a real app, you'd verify the token with the backend here
        // and decode it to get user info.
        // For now, we'll just decode it on the client.
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        setUser({ id: payload.userId, email: payload.email, role: payload.role });
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to parse token from localStorage", error);
      // If token is malformed, clear it
      localStorage.removeItem('cc_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('cc_token', newToken);
    const payload = JSON.parse(atob(newToken.split('.')[1]));
    setUser({ id: payload.userId, email: payload.email, role: payload.role });
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('cc_token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
