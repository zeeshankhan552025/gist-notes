import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { githubApiService } from '../../services/github-api'
import { useAuthStore } from '../../stores'

// Query keys
export const gistKeys = {
  all: ['gists'] as const,
  lists: () => [...gistKeys.all, 'list'] as const,
  list: (filters: string) => [...gistKeys.lists(), { filters }] as const,
  details: () => [...gistKeys.all, 'detail'] as const,
  detail: (id: string) => [...gistKeys.details(), id] as const,
  search: (query: string) => [...gistKeys.all, 'search', query] as const,
}

// Fetch authenticated user gists
export const useUserGists = (page = 1, perPage = 10) => {
  const { githubToken } = useAuthStore()

  return useQuery({
    queryKey: gistKeys.list(`authenticated-page-${page}-per-${perPage}`),
    queryFn: () => githubApiService.fetchAuthenticatedUserGists(page, perPage),
    enabled: !!githubToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Fetch user gists by username
export const useUserGistsByUsername = (username: string, page = 1, perPage = 10) => {
  return useQuery({
    queryKey: gistKeys.list(`user-${username}-page-${page}-per-${perPage}`),
    queryFn: () => githubApiService.fetchUserGists(username, page, perPage),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Fetch public gists
export const usePublicGists = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ['public-gists', page, perPage],
    queryFn: () => githubApiService.fetchPublicGists(page, perPage),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Fetch gist by ID
export const useGistById = (gistId: string) => {
  return useQuery({
    queryKey: gistKeys.detail(gistId),
    queryFn: () => githubApiService.searchGistById(gistId),
    enabled: !!gistId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Search gists
export const useSearchGists = (query: string, enabled = false) => {
  return useQuery({
    queryKey: gistKeys.search(query),
    queryFn: () => githubApiService.searchGists(query),
    enabled: enabled && !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Create gist mutation
export const useCreateGist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (gistData: { description: string; public: boolean; files: Record<string, { content: string }> }) => 
      githubApiService.createGist(gistData),
    onSuccess: () => {
      // Invalidate and refetch user gists
      queryClient.invalidateQueries({ queryKey: gistKeys.lists() })
    },
  })
}

// Update gist mutation
export const useUpdateGist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ gistId, gistData }: { 
      gistId: string; 
      gistData: { description?: string; files?: Record<string, { content: string }> } 
    }) => githubApiService.updateGist(gistId, gistData),
    onSuccess: (updatedGist, { gistId }) => {
      // Update the specific gist in cache
      queryClient.setQueryData(gistKeys.detail(gistId), updatedGist)
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: gistKeys.lists() })
    },
  })
}

// Delete gist mutation
export const useDeleteGist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (gistId: string) => githubApiService.deleteGist(gistId),
    onSuccess: (_, gistId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: gistKeys.detail(gistId) })
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: gistKeys.lists() })
    },
  })
}

// Check if gist is starred
export const useIsGistStarred = (gistId: string) => {
  const { githubToken } = useAuthStore()

  return useQuery({
    queryKey: ['gist-starred', gistId],
    queryFn: () => githubApiService.checkIfGistStarred(gistId),
    enabled: !!githubToken && !!gistId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Star gist mutation
export const useStarGist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (gistId: string) => githubApiService.starGist(gistId),
    onSuccess: (_, gistId) => {
      // Update the starred status in cache
      queryClient.setQueryData(['gist-starred', gistId], true)
    },
  })
}

// Unstar gist mutation
export const useUnstarGist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (gistId: string) => githubApiService.unstarGist(gistId),
    onSuccess: (_, gistId) => {
      // Update the starred status in cache
      queryClient.setQueryData(['gist-starred', gistId], false)
    },
  })
}

// Fork gist mutation
export const useForkGist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (gistId: string) => githubApiService.forkGist(gistId),
    onSuccess: (forkedGist) => {
      // Add the forked gist to the user's gists
      queryClient.invalidateQueries({ queryKey: gistKeys.lists() })
      // Cache the forked gist
      queryClient.setQueryData(gistKeys.detail(forkedGist.id), forkedGist)
    },
  })
}