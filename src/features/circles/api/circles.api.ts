import { api } from '../../../lib/axios'
import type {
  Circle,
  CircleMember,
  CircleDevice,
  SharedDevice,
  CircleInvitation,
  CreateCircleRequest,
  CreatedCircle,
  InviteMemberRequest,
  UpdateMemberPermissionsRequest,
} from '../types'

export async function getCircles(): Promise<Circle[]> {
  const { data } = await api.get<Circle[]>('/circles')
  return data
}

export async function createCircle(
  payload: CreateCircleRequest,
): Promise<CreatedCircle> {
  const { data } = await api.post<CreatedCircle>('/circles', payload)
  return data
}

export async function getMySharedDevices(): Promise<SharedDevice[]> {
  const { data } = await api.get<SharedDevice[]>('/circles/my-devices')
  return data
}

export async function getCircleMembers(
  circleId: string,
): Promise<CircleMember[]> {
  const { data } = await api.get<CircleMember[]>(
    `/circles/${encodeURIComponent(circleId)}/members`,
  )
  return data
}

export async function getCircleDevices(
  circleId: string,
): Promise<CircleDevice[]> {
  const { data } = await api.get<CircleDevice[]>(
    `/circles/${encodeURIComponent(circleId)}/devices`,
  )
  return data
}

export async function inviteMember(
  circleId: string,
  payload: InviteMemberRequest,
): Promise<CircleInvitation> {
  const { data } = await api.post<CircleInvitation>(
    `/circles/${encodeURIComponent(circleId)}/invitations`,
    payload,
  )
  return data
}

export async function removeCircleMember(
  circleId: string,
  memberUserId: string,
): Promise<void> {
  await api.delete(
    `/circles/${encodeURIComponent(circleId)}/members/${encodeURIComponent(memberUserId)}`,
  )
}

export async function updateMemberPermissions(
  circleId: string,
  memberUserId: string,
  payload: UpdateMemberPermissionsRequest,
): Promise<CircleMember> {
  const { data } = await api.patch<CircleMember>(
    `/circles/${encodeURIComponent(circleId)}/members/${encodeURIComponent(memberUserId)}/permissions`,
    payload,
  )
  return data
}

export async function addDeviceToCircle(
  circleId: string,
  deviceId: string,
): Promise<CircleDevice> {
  const { data } = await api.post<CircleDevice>(
    `/circles/${encodeURIComponent(circleId)}/devices`,
    { deviceId },
  )
  return data
}

export async function removeDeviceFromCircle(
  circleId: string,
  deviceId: string,
): Promise<void> {
  await api.delete(
    `/circles/${encodeURIComponent(circleId)}/devices/${encodeURIComponent(deviceId)}`,
  )
}
