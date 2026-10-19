import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import SessionInitializer from './app/SessionInitializer'

export default function App() {
  return (
    <>
      <SessionInitializer />
      <RouterProvider router={router} />
    </>
  )
}

