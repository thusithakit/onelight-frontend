import { api } from '../../../lib/axios'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../types'

export async function login(
  credentials: LoginRequest,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    '/auth/login',
    credentials,
  )

  return data
}

export async function register(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    '/auth/register',
    payload,
  )

  return data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

export async function refreshAccessToken(): Promise<string> {
  const { data } = await api.post<{ accessToken: string }>(
    '/auth/refresh',
  )

  return data.accessToken
}
