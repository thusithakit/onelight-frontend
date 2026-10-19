export type DeviceStatus = 'ONLINE' | 'OFFLINE'

export interface Device {
  id: string
  deviceIdentifier: string
  name: string
  status: DeviceStatus
  firmwareVersion: string | null
  lastSeenAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PairDeviceRequest {
  pairingCode: string
}

export interface PairDeviceResponse {
  deviceId: string
  deviceIdentifier: string
  name: string
  status: DeviceStatus
}

export interface UpdateDeviceRequest {
  name: string
}

export interface LightSettings {
  deviceId: string
  on: boolean
  brightness: number
  color: string
  updatedAt: string
}

export interface UpdateLightSettingsRequest {
  on?: boolean
  brightness?: number
  color?: string
}
