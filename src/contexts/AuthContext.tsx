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

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check for OAuth callback params first
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const oauthToken = urlParams.get('token');
        const oauthUser = urlParams.get('user');

        if (oauthToken && oauthUser) {
          console.log('[AuthContext] Processing OAuth callback');
          
          // Validate and parse user data
          let parsedUser: User;
          try {
            parsedUser = JSON.parse(decodeURIComponent(oauthUser));
          } catch (parseError) {
            console.error('[AuthContext] Failed to parse user data:', parseError);
            // Clear invalid data and fall back to localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsLoading(false);
            return;
          }

          // Store auth data
          setToken(oauthToken);
          setUser(parsedUser);
          localStorage.setItem('token', oauthToken);
          localStorage.setItem('user', JSON.stringify(parsedUser));

          // Clean URL without causing navigation
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          
          console.log('[AuthContext] OAuth login successful');
          setIsLoading(false);
          return;
        }
      }

      // Fallback to localStorage
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      console.log('[AuthContext] Loading from localStorage:', { storedToken: !!storedToken, storedUser: !!storedUser });

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setToken(storedToken);
          setUser(parsedUser);
          console.log('[AuthContext] Restored session from localStorage');
        } catch (error) {
          console.error('[AuthContext] Failed to parse stored user:', error);
          // Clear corrupted data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('[AuthContext] Initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    setIsLoading(true);
    try {
      // Mock login - replace with actual OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser: User = {
        _id: '09bb408d-209e-4b60-8e7f-39b245158547',
        name: 'Balram Kusharam',
        email: 'balramkushram120@gmail.com',
        role: 'admin'
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      console.log('[AuthContext] Mock login successful');
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('[AuthContext] Logout successful');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
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