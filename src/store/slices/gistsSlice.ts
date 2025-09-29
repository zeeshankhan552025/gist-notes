import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { GitHubGist } from '../../services/github-api';
import { fetchUserGists, searchGists, searchGistById } from '../thunks';

interface GistsState {
  gists: GitHubGist[];
  searchResult: GitHubGist | null;
  searchResults: GitHubGist[];
  gistContents: Record<string, string>;
  loading: boolean;
  loadingContent: boolean;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  totalPages: number;
}

const initialState: GistsState = {
  gists: [],
  searchResult: null,
  searchResults: [],
  gistContents: {},
  loading: true,
  loadingContent: false,
  currentPage: 1,
  hasNext: false,
  hasPrev: false,
  totalPages: 1,
};

const gistsSlice = createSlice({
  name: 'gists',
  initialState,
  reducers: {
    setGists: (state, action: PayloadAction<GitHubGist[]>) => {
      state.gists = action.payload;
    },
    setSearchResult: (state, action: PayloadAction<GitHubGist | null>) => {
      state.searchResult = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<GitHubGist[]>) => {
      state.searchResults = action.payload;
    },
    clearSearch: (state) => {
      state.searchResult = null;
      state.searchResults = [];
    },
    setGistContents: (state, action: PayloadAction<Record<string, string>>) => {
      state.gistContents = action.payload;
    },
    updateGistContent: (state, action: PayloadAction<{ gistId: string; content: string }>) => {
      state.gistContents[action.payload.gistId] = action.payload.content;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoadingContent: (state, action: PayloadAction<boolean>) => {
      state.loadingContent = action.payload;
    },
    setPagination: (state, action: PayloadAction<{
      currentPage: number;
      hasNext: boolean;
      hasPrev: boolean;
      totalPages: number;
    }>) => {
      state.currentPage = action.payload.currentPage;
      state.hasNext = action.payload.hasNext;
      state.hasPrev = action.payload.hasPrev;
      state.totalPages = action.payload.totalPages;
    },
    resetGistsState: (state) => {
      state.gists = [];
      state.searchResult = null;
      state.searchResults = [];
      state.gistContents = {};
      state.loading = true;
      state.loadingContent = false;
      state.currentPage = 1;
      state.hasNext = false;
      state.hasPrev = false;
      state.totalPages = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserGists.pending, (state) => {
        state.loadingContent = true;
      })
      .addCase(fetchUserGists.fulfilled, (state, action) => {
        state.loadingContent = false;
        state.gists = action.payload.gists;
        state.currentPage = action.payload.currentPage;
        state.hasNext = action.payload.hasNext;
        state.hasPrev = action.payload.hasPrev;
        state.totalPages = action.payload.hasNext
          ? Math.max(action.payload.currentPage + 1, 2)
          : Math.max(action.payload.currentPage, 1);
      })
      .addCase(fetchUserGists.rejected, (state) => {
        state.loadingContent = false;
      })
      .addCase(searchGists.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.searchResult = null;
      })
      .addCase(searchGistById.fulfilled, (state, action) => {
        state.searchResult = action.payload;
        state.searchResults = [];
      });
  },
});

export const {
  setGists,
  setSearchResult,
  setSearchResults,
  clearSearch,
  setGistContents,
  updateGistContent,
  setLoading,
  setLoadingContent,
  setPagination,
  resetGistsState,
} = gistsSlice.actions;

export default gistsSlice.reducer;