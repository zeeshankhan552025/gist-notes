import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { GitHubGist } from '../services/github-api'

interface GistsState {
  gists: GitHubGist[]
  searchResult: GitHubGist | null
  searchResults: GitHubGist[]
  gistContents: Record<string, string>
  loading: boolean
  loadingContent: boolean
  currentPage: number
  hasNext: boolean
  hasPrev: boolean
  totalPages: number
}

interface GistsActions {
  setGists: (gists: GitHubGist[]) => void
  setSearchResult: (result: GitHubGist | null) => void
  setSearchResults: (results: GitHubGist[]) => void
  clearSearch: () => void
  setGistContents: (contents: Record<string, string>) => void
  updateGistContent: (gistId: string, content: string) => void
  setLoading: (loading: boolean) => void
  setLoadingContent: (loading: boolean) => void
  setCurrentPage: (page: number) => void
  setHasNext: (hasNext: boolean) => void
  setHasPrev: (hasPrev: boolean) => void
  setTotalPages: (totalPages: number) => void
  addGist: (gist: GitHubGist) => void
  updateGist: (gistId: string, updatedGist: GitHubGist) => void
  removeGist: (gistId: string) => void
}

type GistsStore = GistsState & GistsActions

export const useGistsStore = create<GistsStore>()(
  devtools(
    (set) => ({
      // Initial state
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

      // Actions
      setGists: (gists) =>
        set((state) => ({
          ...state,
          gists,
        })),

      setSearchResult: (result) =>
        set((state) => ({
          ...state,
          searchResult: result,
        })),

      setSearchResults: (results) =>
        set((state) => ({
          ...state,
          searchResults: results,
        })),

      clearSearch: () =>
        set((state) => ({
          ...state,
          searchResult: null,
          searchResults: [],
        })),

      setGistContents: (contents) =>
        set((state) => ({
          ...state,
          gistContents: contents,
        })),

      updateGistContent: (gistId, content) =>
        set((state) => ({
          ...state,
          gistContents: {
            ...state.gistContents,
            [gistId]: content,
          },
        })),

      setLoading: (loading) =>
        set((state) => ({
          ...state,
          loading,
        })),

      setLoadingContent: (loading) =>
        set((state) => ({
          ...state,
          loadingContent: loading,
        })),

      setCurrentPage: (page) =>
        set((state) => ({
          ...state,
          currentPage: page,
        })),

      setHasNext: (hasNext) =>
        set((state) => ({
          ...state,
          hasNext,
        })),

      setHasPrev: (hasPrev) =>
        set((state) => ({
          ...state,
          hasPrev,
        })),

      setTotalPages: (totalPages) =>
        set((state) => ({
          ...state,
          totalPages,
        })),

      addGist: (gist) =>
        set((state) => ({
          ...state,
          gists: [gist, ...state.gists],
        })),

      updateGist: (gistId, updatedGist) =>
        set((state) => ({
          ...state,
          gists: state.gists.map((gist) =>
            gist.id === gistId ? updatedGist : gist
          ),
        })),

      removeGist: (gistId) =>
        set((state) => ({
          ...state,
          gists: state.gists.filter((gist) => gist.id !== gistId),
        })),
    }),
    {
      name: 'gists-store',
    }
  )
)