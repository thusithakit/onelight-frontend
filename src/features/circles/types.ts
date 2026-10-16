
export interface Circle {
  id: string
  name: string
  description?: string
  memberCount: number
  deviceCount: number
  role: 'OWNER' | 'MEMBER'
  createdAt?: string
}

export interface CircleMember {
  id: string
  name: string
  email: string
  role: 'OWNER' | 'MEMBER'
}

export interface CircleDevice {
  id: string
  name: string
  status: 'ONLINE' | 'OFFLINE'
}
