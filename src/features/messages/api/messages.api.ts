import { api } from '../../../lib/axios'
import type { DeviceMessage, SendMessageRequest } from '../types'

export async function getDeviceMessages(
  deviceId: string,
): Promise<DeviceMessage[]> {
  const { data } = await api.get<DeviceMessage[]>(
    `/messages/${encodeURIComponent(deviceId)}`,
  )

  return data
}

export async function sendDeviceMessage(
  payload: SendMessageRequest,
): Promise<DeviceMessage> {
  const { data } = await api.post<DeviceMessage>('/messages', payload)
  return data
}
