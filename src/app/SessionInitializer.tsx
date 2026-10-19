import { useEffect } from 'react'
import { refreshAccessToken } from '../features/auth/api/auth.api'
import { readAccessTokenClaims } from '../features/auth/utils/token.utils'
import { useAuthStore } from '../stores/auth.store'

let initializationPromise: Promise<void> | null = null

function initializeSession(): Promise<void> {
  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = (async () => {
    try {
      const accessToken = await refreshAccessToken()
      const claims = readAccessTokenClaims(accessToken)
      const userId = claims.userId ?? claims.sub

      if (!userId) {
        throw new Error(
          'Access token does not contain a user ID',
        )
      }

      useAuthStore.getState().setSession(
        {
          id: userId,
          email: claims.email ?? '',
        },
        accessToken,
      )
    } catch {
      useAuthStore.getState().clearSession()
    }
  })()

  try {
    return initializationPromise
  } finally {
    // The promise is reset after initialization settles below.
    void initializationPromise.finally(() => {
      initializationPromise = null
    })
  }
}

export default function SessionInitializer() {
  useEffect(() => {
    void initializeSession()
  }, [])

  return null
}
