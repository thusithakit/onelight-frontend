import { create } from 'zustand'

export interface AuthUser {
  id: string
  email: string
  name?: string
}

interface AuthState {
  user: AuthUser | null
  userId: string | null
  accessToken: string | null
  isAuthenticated: boolean
  isInitializing: boolean

  setSession: (
    user: AuthUser,
    accessToken: string,
  ) => void

  setAccessToken: (accessToken: string) => void
  clearSession: () => void
  finishInitialization: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userId: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,

  setSession: (user, accessToken) =>
    set({
      user,
      userId: user.id,
      accessToken,
      isAuthenticated: true,
      isInitializing: false,
    }),

  setAccessToken: (accessToken) =>
    set({ accessToken }),

  clearSession: () =>
    set({
      user: null,
      userId: null,
      accessToken: null,
      isAuthenticated: false,
      isInitializing: false,
    }),

  finishInitialization: () =>
    set({ isInitializing: false }),
}))
