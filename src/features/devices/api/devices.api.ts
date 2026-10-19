import { api } from '../../../lib/axios'
import type {
  Device,
  PairDeviceRequest,
  PairDeviceResponse,
  UpdateDeviceRequest,
  LightSettings,
  UpdateLightSettingsRequest,
} from '../types'

export async function getDevices(): Promise<Device[]> {
  const { data } = await api.get<Device[]>('/devices')
  return data
}

export async function getDevice(deviceId: string): Promise<Device> {
  const { data } = await api.get<Device>(
    `/devices/${encodeURIComponent(deviceId)}`,
  )

  return data
}

export async function pairDevice(
  payload: PairDeviceRequest,
): Promise<PairDeviceResponse> {
  const { data } = await api.post<PairDeviceResponse>(
    '/devices/pair',
    payload,
  )

  return data
}

export async function updateDevice(
  deviceId: string,
  payload: UpdateDeviceRequest,
): Promise<Device> {
  const { data } = await api.put<Device>(
    `/devices/${encodeURIComponent(deviceId)}`,
    payload,
  )

  return data
}

export async function deleteDevice(deviceId: string): Promise<void> {
  await api.delete(`/devices/${encodeURIComponent(deviceId)}`)
}

export async function getLightSettings(
  deviceId: string,
): Promise<LightSettings> {
  const { data } = await api.get<LightSettings>(
    `/devices/${encodeURIComponent(deviceId)}/light`,
  )

  return data
}

export async function updateLightSettings(
  deviceId: string,
  payload: UpdateLightSettingsRequest,
): Promise<LightSettings | undefined> {
  const response = await api.patch<LightSettings | undefined>(
    `/devices/${encodeURIComponent(deviceId)}/light`,
    payload,
  )

  return response.data
}
