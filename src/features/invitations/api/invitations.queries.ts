import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  acceptInvitation,
  declineInvitation,
  getInvitations,
} from './invitations.api'
import { circleKeys } from '../../circles/api/circles.queries'

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.all })
      queryClient.invalidateQueries({ queryKey: circleKeys.all })
      queryClient.invalidateQueries({
        queryKey: circleKeys.sharedDevices,
      })
    },
  })
}

export function useDeclineInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: declineInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.all })
    },
  })
}
