import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { useAuthStore } from './stores/auth.store'
import { useEffect } from 'react'

export default function App() {
  const finishInitialization = useAuthStore(
    (state) => state.finishInitialization,
  )

  useEffect(() => {
    finishInitialization()
  }, [finishInitialization])

  return <RouterProvider router={router} />
}
