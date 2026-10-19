import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  deleteDevice,
  getDevice,
  getDevices,
  getLightSettings,
  pairDevice,
  updateDevice,
  updateLightSettings,
} from './devices.api'
import type {
  PairDeviceRequest,
  UpdateDeviceRequest,
  UpdateLightSettingsRequest,
} from '../types'

export const deviceKeys = {
  all: ['devices'] as const,
  detail: (deviceId: string) => ['devices', deviceId] as const,
  light: (deviceId: string) => ['devices', deviceId, 'light'] as const,
}

export function useDevices() {
  return useQuery({
    queryKey: deviceKeys.all,
    queryFn: getDevices,
  })
}

export function useDevice(deviceId: string) {
  return useQuery({
    queryKey: deviceKeys.detail(deviceId),
    queryFn: () => getDevice(deviceId),
    enabled: Boolean(deviceId),
  })
}

export function useLightSettings(deviceId: string) {
  return useQuery({
    queryKey: deviceKeys.light(deviceId),
    queryFn: () => getLightSettings(deviceId),
    enabled: Boolean(deviceId),
    refetchInterval: 30_000,
  })
}

export function usePairDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PairDeviceRequest) => pairDevice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all })
    },
  })
}

export function useUpdateDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      deviceId,
      payload,
    }: {
      deviceId: string
      payload: UpdateDeviceRequest
    }) => updateDevice(deviceId, payload),
    onSuccess: (device) => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all })
      queryClient.setQueryData(deviceKeys.detail(device.id), device)
    },
  })
}

export function useDeleteDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDevice,
    onSuccess: (_result, deviceId) => {
      queryClient.removeQueries({ queryKey: deviceKeys.detail(deviceId) })
      queryClient.invalidateQueries({ queryKey: deviceKeys.all })
    },
  })
}

export function useUpdateLightSettings(deviceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateLightSettingsRequest) =>
      updateLightSettings(deviceId, payload),
    onSuccess: (settings) => {
      queryClient.setQueryData(deviceKeys.light(deviceId), settings)
    },
  })
}
