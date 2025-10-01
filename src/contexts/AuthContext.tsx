import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = typeof window !== 'undefined' ? window.location : undefined;

  useEffect(() => {
    // Check for OAuth callback params in URL
    if (location) {
      const params = new URLSearchParams(location.search);
      const oauthToken = params.get('token');
      const oauthUser = params.get('user');
      if (oauthToken && oauthUser) {
        setToken(oauthToken);
        setUser(JSON.parse(decodeURIComponent(oauthUser)));
        localStorage.setItem('token', oauthToken);
        localStorage.setItem('user', decodeURIComponent(oauthUser));
        // Remove query params from URL
        const url = location.origin + location.pathname;
        window.history.replaceState({}, document.title, url);
        // Redirect to dashboard route (if using routing) or reload to trigger dashboard
        setTimeout(() => {
          window.location.replace('/');
        }, 100);
      } else {
        // Fallback to localStorage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async () => {
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser: User = {
      _id: '09bb408d-209e-4b60-8e7f-39b245158547',
      name: 'Balram Kusharam',
      email: 'balramkushram120@gmail.com',
      role: 'admin'
    };

    const mockToken = 'mock-jwt-token-' + Date.now();

    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));

    setToken(mockToken);
    setUser(mockUser);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
