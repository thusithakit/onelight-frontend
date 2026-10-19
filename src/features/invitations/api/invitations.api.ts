import { api } from '../../../lib/axios'
import type { CircleInvitation } from '../../circles/types'

export async function getInvitations(): Promise<CircleInvitation[]> {
  const { data } = await api.get<CircleInvitation[]>('/circles/invitations')
  return data
}

export async function acceptInvitation(
  invitationId: string,
): Promise<CircleInvitation> {
  const { data } = await api.post<CircleInvitation>(
    `/circles/invitations/${encodeURIComponent(invitationId)}/accept`,
  )
  return data
}

export async function declineInvitation(
  invitationId: string,
): Promise<CircleInvitation> {
  const { data } = await api.post<CircleInvitation>(
    `/circles/invitations/${encodeURIComponent(invitationId)}/decline`,
  )
  return data
}
