import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuthStore, type Me } from '../stores/authStore'

export function useMe(enabled = true) {
  const setMe = useAuthStore((s) => s.setMe)
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get<{ user: Me }>('/api/me')
      setMe(res.data.user)
      return res.data.user
    },
    enabled,
    retry: false,
  })
}
