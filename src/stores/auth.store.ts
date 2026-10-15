
import { create } from 'zustand'

export interface AuthUser {
  id: string
  email: string
  name?: string
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  isInitializing: boolean

  setSession: (user: AuthUser, accessToken: string) => void
  clearSession: () => void
  finishInitialization: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,

  setSession: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isInitializing: false,
    }),

  clearSession: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitializing: false,
    }),

  finishInitialization: () =>
    set({ isInitializing: false }),
}))
