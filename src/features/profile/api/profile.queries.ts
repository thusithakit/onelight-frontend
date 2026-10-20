import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getMyProfile,
  updateMyProfile,
} from './profile.api'

import type { UpdateProfileRequest } from '../types'
import { useAuthStore } from '../../../stores/auth.store'

export const profileKeys = {
  me: ['profile', 'me'] as const,
}

export function useMyProfile() {
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: getMyProfile,
    staleTime: 60_000,
  })
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) =>
      updateMyProfile(payload),

    onSuccess: async (updatedProfile) => {
      queryClient.setQueryData(
        profileKeys.me,
        updatedProfile,
      )

      const currentUser = useAuthStore.getState().user

      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          name: updatedProfile.name,
        })
      }

      await queryClient.invalidateQueries({
        queryKey: profileKeys.me,
      })
    },
  })
}
