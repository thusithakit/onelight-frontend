
import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom'

import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../features/auth/pages/LoginPage'
import CirclesPage from '../features/circles/pages/CirclesPage'
import InvitationsPage from '../features/invitations/pages/InvitationsPage'
import ProfilePage from '../features/profile/pages/ProfilePage'
import DevicesPage from '../features/devices/pages/DevicePage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Navigate to="/devices" replace />,
      },
      {
        path: '/devices',
        element: <DevicesPage />,
      },
      {
        path: '/devices/:deviceId',
        element: <DevicesPage />,
      },
      {
        path: '/circles',
        element: <CirclesPage />,
      },
      {
        path: '/circles/:circleId',
        element: <CirclesPage />,
      },
      {
        path: '/invitations',
        element: <InvitationsPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '*',
        element: <Navigate to="/devices" replace />,
      },
    ],
  },
])
