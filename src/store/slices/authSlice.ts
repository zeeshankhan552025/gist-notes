import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from 'firebase/auth';
import type { AuthUser } from '../../services/firebase-auth';
import type { GitHubUser } from '../../types/github.types';
import { loginWithGithub, logoutUser, fetchAuthenticatedUser } from '../thunks';

interface AuthState {
  currentUser: User | null;
  userInfo: AuthUser | null;
  githubUserData: GitHubUser | null;
  githubToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  userInfo: null,
  githubUserData: null,
  githubToken: null,
  loading: true,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setUserInfo: (state, action: PayloadAction<AuthUser | null>) => {
      state.userInfo = action.payload;
    },
    setGithubUserData: (state, action: PayloadAction<GitHubUser | null>) => {
      state.githubUserData = action.payload;
    },
    setGithubToken: (state, action: PayloadAction<string | null>) => {
      state.githubToken = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.userInfo = null;
      state.githubUserData = null;
      state.githubToken = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGithub.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithGithub.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.userInfo = action.payload.user;
          state.githubToken = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(loginWithGithub.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.userInfo = null;
        state.githubUserData = null;
        state.githubToken = null;
        state.isAuthenticated = false;
      })
      .addCase(fetchAuthenticatedUser.fulfilled, (state, action) => {
        state.githubUserData = action.payload;
      });
  },
});

export const {
  setLoading,
  setCurrentUser,
  setUserInfo,
  setGithubUserData,
  setGithubToken,
  logout,
} = authSlice.actions;

export default authSlice.reducer;