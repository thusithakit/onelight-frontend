import { api } from '../../../lib/axios'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  timezone: string
}

export interface AuthResponse {
  userId: string
  email: string
  name: string
  accessToken: string
}

export interface RefreshResponse {
  accessToken: string
}

export async function login(
  credentials: LoginRequest,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    '/auth/login',
    credentials,
    { withCredentials: true },
  )

  return response.data
}

export async function register(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    '/auth/register',
    payload,
    { withCredentials: true },
  )

  return response.data
}

export async function refreshAccessToken(): Promise<string> {
  const response = await api.post<RefreshResponse>(
    '/auth/refresh',
    {},
    { withCredentials: true },
  )

  return response.data.accessToken
}

export async function logout(): Promise<void> {
  await api.post(
    '/auth/logout',
    {},
    { withCredentials: true },
  )
}
