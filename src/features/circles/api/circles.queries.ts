import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  addDeviceToCircle,
  createCircle,
  getCircleDevices,
  getCircleMembers,
  getCircles,
  getMySharedDevices,
  inviteMember,
  removeCircleMember,
  removeDeviceFromCircle,
  updateMemberPermissions,
} from './circles.api'

export const circleKeys = {
  all: ['circles'] as const,
  members: (circleId: string) => ['circles', circleId, 'members'] as const,
  devices: (circleId: string) => ['circles', circleId, 'devices'] as const,
  sharedDevices: ['circles', 'my-devices'] as const,
}

export function useCircles() {
  return useQuery({
    queryKey: circleKeys.all,
    queryFn: getCircles,
  })
}

export function useMySharedDevices() {
  return useQuery({
    queryKey: circleKeys.sharedDevices,
    queryFn: getMySharedDevices,
  })
}

export function useCircleMembers(circleId: string) {
  return useQuery({
    queryKey: circleKeys.members(circleId),
    queryFn: () => getCircleMembers(circleId),
    enabled: Boolean(circleId),
  })
}

export function useCircleDevices(circleId: string) {
  return useQuery({
    queryKey: circleKeys.devices(circleId),
    queryFn: () => getCircleDevices(circleId),
    enabled: Boolean(circleId),
  })
}

export function useCreateCircle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCircle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circleKeys.all })
    },
  })
}

export function useInviteMember(circleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) =>
      inviteMember(circleId, { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: circleKeys.members(circleId),
      })
    },
  })
}

export function useRemoveCircleMember(circleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (memberUserId: string) =>
      removeCircleMember(circleId, memberUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: circleKeys.members(circleId),
      })
    },
  })
}

export function useUpdateMemberPermissions(circleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      memberUserId,
      canSendMessages,
    }: {
      memberUserId: string
      canSendMessages: boolean
    }) =>
      updateMemberPermissions(circleId, memberUserId, {
        canSendMessages,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: circleKeys.members(circleId),
      })
    },
  })
}

export function useAddDeviceToCircle(circleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (deviceId: string) =>
      addDeviceToCircle(circleId, deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: circleKeys.devices(circleId),
      })
      queryClient.invalidateQueries({
        queryKey: circleKeys.sharedDevices,
      })
    },
  })
}

export function useRemoveDeviceFromCircle(circleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (deviceId: string) =>
      removeDeviceFromCircle(circleId, deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: circleKeys.devices(circleId),
      })
      queryClient.invalidateQueries({
        queryKey: circleKeys.sharedDevices,
      })
    },
  })
}
