
import { api } from '../../../lib/axios'
import type { AuthUser } from '../../../stores/auth.store'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}

export async function login(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    '/auth/login',
    credentials,
  )

  return response.data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
