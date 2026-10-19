
import axios from 'axios'
import { useAuthStore } from '../stores/auth.store'

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})
