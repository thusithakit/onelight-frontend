import { api } from '../../../lib/axios'
import type { UserProfile } from '../../auth/types'

export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>('/users/me')
  return data
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>(
    `/users/${encodeURIComponent(userId)}`,
  )

  return data
}
