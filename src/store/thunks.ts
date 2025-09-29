import { createAsyncThunk } from '@reduxjs/toolkit';
import { githubApiService } from '../services/github-api';
import { firebaseAuthService } from '../services/firebase-auth';

// Auth thunks
export const loginWithGithub = createAsyncThunk(
  'auth/loginWithGithub',
  async (_, { rejectWithValue }) => {
    try {
      const result = await firebaseAuthService.loginWithGithub();
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await firebaseAuthService.logout();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Logout failed');
    }
  }
);

export const fetchAuthenticatedUser = createAsyncThunk(
  'auth/fetchAuthenticatedUser',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await githubApiService.getAuthenticatedUser();
      return userData;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user data');
    }
  }
);

// Gists thunks
export const fetchUserGists = createAsyncThunk(
  'gists/fetchUserGists',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await githubApiService.fetchAuthenticatedUserGists(page);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch gists');
    }
  }
);

export const searchGists = createAsyncThunk(
  'gists/searchGists',
  async (query: string, { rejectWithValue }) => {
    try {
      const results = await githubApiService.searchGists(query);
      return results;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Search failed');
    }
  }
);

export const searchGistById = createAsyncThunk(
  'gists/searchGistById',
  async (gistId: string, { rejectWithValue }) => {
    try {
      const gist = await githubApiService.searchGistById(gistId);
      if (!gist) {
        throw new Error('Gist not found');
      }
      return gist;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch gist');
    }
  }
);