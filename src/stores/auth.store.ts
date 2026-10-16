
import { create } from 'zustand'

interface AuthState {
  userId: string | null
  accessToken: string | null
  isAuthenticated: boolean
  isInitializing: boolean

  setSession: (userId: string, accessToken: string) => void
  clearSession: () => void
  finishInitialization: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,

  setSession: (userId, accessToken) =>
    set({
      userId,
      accessToken,
      isAuthenticated: true,
      isInitializing: false,
    }),

  clearSession: () =>
    set({
      userId: null,
      accessToken: null,
      isAuthenticated: false,
      isInitializing: false,
    }),

  finishInitialization: () =>
    set({ isInitializing: false }),
}))
