export interface UserProfile {
  id: string
  authUserId: string
  name: string
  avatarUrl: string | null
  timezone: string
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileRequest {
  name: string
  avatarUrl: string | null
  timezone: string
}
