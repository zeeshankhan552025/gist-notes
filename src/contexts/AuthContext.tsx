import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { firebaseAuthService } from '../services/firebase-auth';
import type { AuthUser } from '../services/firebase-auth';

interface AuthContextType {
  currentUser: User | null;
  userInfo: AuthUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  githubToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [githubToken, setGithubToken] = useState<string | null>(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = firebaseAuthService.onAuthStateChange((user) => {
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
        // User is signed in, get stored user info and token
        const storedUserInfo = firebaseAuthService.getStoredUserInfo();
        const storedToken = firebaseAuthService.getStoredToken();
        
        setUserInfo(storedUserInfo);
        setGithubToken(storedToken);
      } else {
        // User is signed out
        setUserInfo(null);
        setGithubToken(null);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (): Promise<void> => {
    try {
      const result = await firebaseAuthService.loginWithGithub();
      if (result) {
        setUserInfo(result.user);
        setGithubToken(result.token);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await firebaseAuthService.logout();
      setUserInfo(null);
      setGithubToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const isAuthenticated = !!currentUser && !!githubToken;

  const value: AuthContextType = {
    currentUser,
    userInfo,
    loading,
    login,
    logout,
    isAuthenticated,
    githubToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};