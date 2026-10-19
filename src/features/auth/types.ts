export interface RegisterRequest {
  email: string
  password: string
  name: string
  timezone: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  userId: string
  email: string
  name?: string
  accessToken: string
}

export interface UserProfile {
  id: string
  authUserId: string
  name: string
  avatarUrl: string | null
  timezone: string
  createdAt: string
  updatedAt: string
}
