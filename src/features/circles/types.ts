export type CircleRole = 'OWNER' | 'MEMBER'

export interface Circle {
  circleId: string
  name: string
  ownerId: string
  role: CircleRole
  canSendMessage: boolean
  joinedAt: string
}

export interface CreateCircleRequest {
  name: string
}

export interface CreatedCircle {
  id: string
  name: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface CircleMember {
  userId: string
  role: CircleRole
  canSendMessages: boolean
  joinedAt: string
}

export interface CircleDevice {
  deviceId: string
  addedAt: string
}

export interface SharedDevice {
  deviceId: string
  name: string
  status: 'ONLINE' | 'OFFLINE'
  firmwareVersion: string | null
  lastSeenAt: string | null
  circleId: string
  circleName: string
  canSendMessages: boolean
}

export interface CircleInvitation {
  id: string
  circleId: string
  circleName: string
  invitedUserId: string
  invitedBy: string
  status: string
  expiresAt: string
  createdAt: string
}

export interface InviteMemberRequest {
  userId: string
}

export interface UpdateMemberPermissionsRequest {
  canSendMessages: boolean
}
