import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getDeviceMessages,
  sendDeviceMessage,
} from './messages.api'

import type { SendMessageRequest } from '../types'

export const messageKeys = {
  all: ['messages'] as const,
  device: (deviceId: string) =>
    ['messages', deviceId] as const,
}

export function useDeviceMessages(deviceId: string) {
  return useQuery({
    queryKey: messageKeys.device(deviceId),
    queryFn: () => getDeviceMessages(deviceId),
    enabled: Boolean(deviceId),
    refetchInterval: 10_000,
  })
}

export function useSendDeviceMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SendMessageRequest) =>
      sendDeviceMessage(payload),

    onSuccess: async (message) => {
      await queryClient.invalidateQueries({
        queryKey: messageKeys.device(message.deviceId),
      })
    },
  })
}
