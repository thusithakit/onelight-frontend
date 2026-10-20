export type MessageStatus =
  | 'PENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'FAILED'

export interface DeviceMessage {
  id: string
  deviceId: string
  senderUserId: string
  content: string
  status: MessageStatus | string
  createdAt: string
  deliveredAt: string | null
  senderName: string | null
}

export interface SendMessageRequest {
  deviceId: string
  content: string
}
