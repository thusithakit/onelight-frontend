export type InvitationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'

export interface Invitation {
  id: string
  circleId: string
  circleName: string
  inviterName: string
  inviterEmail: string
  status: InvitationStatus
  createdAt: string
}
