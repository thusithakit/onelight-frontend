import { api } from '../../../lib/axios'
import type { UserProfile } from '../types'

export async function getMyProfile(): Promise<UserProfile> {
  const response = await api.get<UserProfile>('/users/me')
  return response.data
}
