import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { getDeviceMessages, sendDeviceMessage } from './messages.api'
import type { SendMessageRequest } from '../types'

export const messageKeys = {
  device: (deviceId: string) => ['messages', deviceId] as const,
}

export function useDeviceMessages(deviceId: string) {
  return useQuery({
    queryKey: messageKeys.device(deviceId),
    queryFn: () => getDeviceMessages(deviceId),
    enabled: Boolean(deviceId),
  })
}

export function useSendDeviceMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SendMessageRequest) =>
      sendDeviceMessage(payload),
    onSuccess: (message) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.device(message.deviceId),
      })
    },
  })
}
