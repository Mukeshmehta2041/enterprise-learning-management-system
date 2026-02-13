import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from '@/shared/api/client'
import { useToast } from '@/shared/context/ToastContext'

export const ApiKeySummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  scopes: z.array(z.string()),
  enabled: z.boolean(),
  createdAt: z.string(),
  lastUsedAt: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
})

export const ApiKeyCreateResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  rawKey: z.string(),
  scopes: z.array(z.string()),
  createdAt: z.string(),
})

export type ApiKeySummary = z.infer<typeof ApiKeySummarySchema>
export type ApiKeyCreateResponse = z.infer<typeof ApiKeyCreateResponseSchema>

export interface CreateApiKeyRequest {
  name: string
  scopes: string[]
}

export const useApiKeys = (enabled = true) => {
  return useQuery<ApiKeySummary[]>({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/api-keys')
      return z.array(ApiKeySummarySchema).parse(response.data)
    },
    enabled,
  })
}

export const useCreateApiKey = () => {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation<ApiKeyCreateResponse, Error, CreateApiKeyRequest>({
    mutationFn: async (payload) => {
      const response = await apiClient.post('/auth/api-keys', payload)
      return ApiKeyCreateResponseSchema.parse(response.data)
    },
    onSuccess: () => {
      success('API key created')
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
    onError: () => {
      error('Failed to create API key')
    },
  })
}

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/auth/api-keys/${id}`)
    },
    onSuccess: () => {
      success('API key revoked')
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
    onError: () => {
      error('Failed to revoke API key')
    },
  })
}
