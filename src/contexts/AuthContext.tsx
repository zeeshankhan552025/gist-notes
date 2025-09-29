import React, { createContext, useContext, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { firebaseAuthService } from '../services/firebase-auth';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCurrentUser, setUserInfo, setGithubToken, setLoading } from '../store/slices/authSlice';
import { loginWithGithub, logoutUser, fetchAuthenticatedUser } from '../store/thunks';
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
  const dispatch = useAppDispatch();
  const {
    currentUser,
    userInfo,
    loading,
    isAuthenticated,
    githubToken,
    githubUserData
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = firebaseAuthService.onAuthStateChange((user) => {
      dispatch(setCurrentUser(user));
      dispatch(setLoading(false));

      if (user) {
        // User is signed in, get stored user info and token
        const storedUserInfo = firebaseAuthService.getStoredUserInfo();
        const storedToken = firebaseAuthService.getStoredToken();

        dispatch(setUserInfo(storedUserInfo));
        dispatch(setGithubToken(storedToken));

        // Fetch GitHub user data if we have a token but no user data
        if (storedToken && !githubUserData) {
          dispatch(fetchAuthenticatedUser());
        }
      } else {
        dispatch(setLoading(false));
      }
    });

    return unsubscribe;
  }, [dispatch, githubUserData]);

  const login = async () => {
    await dispatch(loginWithGithub()).unwrap();
  };

  const logout = async () => {
    await dispatch(logoutUser()).unwrap();
  };

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
      {children}
    </AuthContext.Provider>
  );
};