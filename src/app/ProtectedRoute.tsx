
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  )
  const isInitializing = useAuthStore(
    (state) => state.isInitializing,
  )
  const location = useLocation()

  if (isInitializing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#111114] text-zinc-400">
        Checking your session...
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  return <Outlet />
}
