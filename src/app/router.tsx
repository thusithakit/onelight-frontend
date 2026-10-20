import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../features/auth/pages/LoginPage";
import CirclesPage from "../features/circles/pages/CirclesPage";
import InvitationsPage from "../features/invitations/pages/InvitationsPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import DevicesPage from "../features/devices/pages/DevicePage";
import AppShell from "../components/layout/AppShell";
import AddDevicePage from "../features/devices/pages/AddDevicePage";
import CreateCirclePage from "../features/circles/pages/CreateCirclePage";
import CircleDetailPage from "../features/circles/pages/CircleDetailPage";
import DeviceDetailPage from "../features/devices/pages/DeviceDetailPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import SendMessagePage from "../features/messages/pages/SendMessagePage";
import EditProfile from "../features/profile/pages/EditProfile";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: "/",
            element: <Navigate to="/devices" replace />,
          },
          {
            path: "/devices",
            element: <DevicesPage />,
          },
          {
            path: "/devices/new",
            element: <AddDevicePage />,
          },
          {
            path: "/devices/:deviceId",
            element: <DeviceDetailPage />,
          },
          {
            path: "/circles",
            element: <CirclesPage />,
          },
          {
            path: "/circles/new",
            element: <CreateCirclePage />,
          },
          {
            path: "/circles/:circleId",
            element: <CircleDetailPage />,
          },
          {
            path: "/invitations",
            element: <InvitationsPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/profile/edit",
            element: <EditProfile />,
          },
          {
            path: "messages",
            element: <SendMessagePage />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/devices" replace />,
      },
    ],
  },
]);
