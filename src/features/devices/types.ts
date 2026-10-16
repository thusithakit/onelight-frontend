export type DeviceStatus = 'ONLINE' | 'OFFLINE'

export interface Device {
  id: string
  name: string
  deviceIdentifier: string
  status: DeviceStatus
  firmwareVersion?: string
  lastSeenAt?: string
}