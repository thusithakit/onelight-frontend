
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getInvitations,
  acceptInvitation,
  declineInvitation,
} from './invitations.api'

export const invitationKeys = {
  all: ['invitations'] as const,
}

export function useInvitations() {
  return useQuery({
    queryKey: invitationKeys.all,
    queryFn: getInvitations,
  })
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: invitationKeys.all,
      })

      await queryClient.invalidateQueries({
        queryKey: ['circles'],
      })
    },
  })
}

export function useDeclineInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: declineInvitation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: invitationKeys.all,
      })
    },
  })
}
