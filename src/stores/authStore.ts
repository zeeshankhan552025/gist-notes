import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User } from 'firebase/auth'
import type { AuthUser } from '../services/firebase-auth'
import type { GitHubUser } from '../types/github.types'

interface AuthState {
  currentUser: User | null
  userInfo: AuthUser | null
  githubUserData: GitHubUser | null
  githubToken: string | null
  loading: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  setCurrentUser: (user: User | null) => void
  setUserInfo: (userInfo: AuthUser | null) => void
  setGithubUserData: (userData: GitHubUser | null) => void
  setGithubToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setIsAuthenticated: (isAuth: boolean) => void
  logout: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        currentUser: null,
        userInfo: null,
        githubUserData: null,
        githubToken: null,
        loading: true,
        isAuthenticated: false,

        // Actions
        setCurrentUser: (user) =>
          set((state) => ({
            ...state,
            currentUser: user,
            isAuthenticated: !!user,
          })),

        setUserInfo: (userInfo) =>
          set((state) => ({
            ...state,
            userInfo,
          })),

        setGithubUserData: (userData) =>
          set((state) => ({
            ...state,
            githubUserData: userData,
          })),

        setGithubToken: (token) =>
          set((state) => ({
            ...state,
            githubToken: token,
          })),

        setLoading: (loading) =>
          set((state) => ({
            ...state,
            loading,
          })),

        setIsAuthenticated: (isAuth) =>
          set((state) => ({
            ...state,
            isAuthenticated: isAuth,
          })),

        logout: () =>
          set(() => ({
            currentUser: null,
            userInfo: null,
            githubUserData: null,
            githubToken: null,
            loading: false,
            isAuthenticated: false,
          })),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          githubToken: state.githubToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)