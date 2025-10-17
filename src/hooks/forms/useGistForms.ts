import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Create Gist Form Schema
export const createGistSchema = z.object({
  description: z.string().min(1, 'Description is required').max(256, 'Description too long'),
  isPublic: z.boolean(),
  files: z.array(z.object({
    filename: z.string().min(1, 'Filename is required'),
    content: z.string().min(1, 'Content is required'),
    language: z.string().optional(),
  })).min(1, 'At least one file is required'),
})

export type CreateGistFormData = z.infer<typeof createGistSchema>

// Custom hook for create gist form
export const useCreateGistForm = (defaultValues?: Partial<CreateGistFormData>) => {
  return useForm<CreateGistFormData>({
    resolver: zodResolver(createGistSchema),
    defaultValues: {
      description: '',
      isPublic: true,
      files: [{ filename: '', content: '', language: '' }],
      ...defaultValues,
    },
  })
}

// Update Gist Form Schema
export const updateGistSchema = z.object({
  description: z.string().max(256, 'Description too long').optional(),
  files: z.record(z.string(), z.object({
    content: z.string().optional(),
    filename: z.string().optional(),
  })).optional(),
})

export type UpdateGistFormData = z.infer<typeof updateGistSchema>

// Custom hook for update gist form
export const useUpdateGistForm = (defaultValues?: Partial<UpdateGistFormData>) => {
  return useForm<UpdateGistFormData>({
    resolver: zodResolver(updateGistSchema),
    defaultValues,
  })
}

// Search Form Schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  language: z.string().optional(),
  user: z.string().optional(),
})

export type SearchFormData = z.infer<typeof searchSchema>

// Custom hook for search form
export const useSearchForm = () => {
  return useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: '',
      language: '',
      user: '',
    },
  })
}