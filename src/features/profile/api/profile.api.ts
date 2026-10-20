import {api} from '../../../lib/axios'
import type {
  UserProfile,
  UpdateProfileRequest,
} from '../types'

export async function getMyProfile(): Promise<UserProfile> {
  const response = await api.get<UserProfile>('/users/me')
  return response.data
}

export async function updateMyProfile(
  payload: UpdateProfileRequest,
): Promise<UserProfile> {
  const response = await api.put<UserProfile>(
    '/users/me',
    payload,
  )

  return response.data
}
