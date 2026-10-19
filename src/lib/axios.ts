
import axios, {
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '../stores/auth.store'

const baseURL = import.meta.env.VITE_API_BASE_URL

// Normal API client
export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
})

// Separate client prevents refresh requests from triggering
// the normal API response interceptor.
const refreshClient = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean
}

let refreshPromise: Promise<string> | null = null

// Attach authentication details to outgoing requests.
api.interceptors.request.use((config) => {
  const { accessToken, userId } = useAuthStore.getState()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  if (userId) {
    config.headers['X-User-Id'] = userId
  }

  return config
})

// Refresh the token once, then retry failed requests.
api.interceptors.response.use(
  (response) => response,

  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error)
    }

    const originalRequest =
      error.config as RetryableRequest

    const status = error.response?.status
    const requestUrl = originalRequest.url ?? ''

    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/logout')

    if (
      status !== 401 ||
      originalRequest._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      // Concurrent 401 responses share one refresh request.
      if (!refreshPromise) {
        refreshPromise = refreshClient
          .post<{ accessToken: string }>(
            '/auth/refresh',
            {},
          )
          .then((response) => {
            const newAccessToken =
              response.data.accessToken

            if (!newAccessToken) {
              throw new Error(
                'Refresh response did not contain an access token',
              )
            }

            useAuthStore
              .getState()
              .setAccessToken(newAccessToken)

            return newAccessToken
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      const newAccessToken = await refreshPromise

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`

      return api(originalRequest)
    } catch (refreshError) {
      useAuthStore.getState().clearSession()

      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }

      return Promise.reject(refreshError)
    }
  },
)
