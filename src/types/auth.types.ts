import type { User } from 'firebase/auth';

/**
 * User information from Firebase Auth with GitHub-specific data
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  githubToken?: string;
}

/**
 * Authentication context type definition
 */
export interface AuthContextType {
  currentUser: User | null;
  userInfo: AuthUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  githubToken: string | null;
}

/**
 * Authentication provider props
 */
export interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Login result from Firebase Auth
 */
export interface LoginResult {
  user: AuthUser;
  token: string;
}
