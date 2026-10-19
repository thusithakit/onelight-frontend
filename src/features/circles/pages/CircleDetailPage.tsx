import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  LoaderCircle,
  MessageCircle,
  Plus,
  Trash2,
  UsersRound,
  Lightbulb,
} from 'lucide-react'
import { useCircles } from '../api/circles.queries'
import {
  useAddDeviceToCircle,
  useCircleDevices,
  useCircleMembers,
  useInviteMember,
  useMySharedDevices,
  useRemoveCircleMember,
  useRemoveDeviceFromCircle,
  useUpdateMemberPermissions,
} from '../api/circles.queries'

type CircleTab = 'members' | 'devices'

export default function CircleDetailPage() {
  const { circleId = '' } = useParams()
  const [activeTab, setActiveTab] = useState<CircleTab>('members')
  const [userId, setUserId] = useState('')
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [notice, setNotice] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const circlesQuery = useCircles()
  const membersQuery = useCircleMembers(circleId)
  const devicesQuery = useCircleDevices(circleId)
  const sharedDevicesQuery = useMySharedDevices()

  const inviteMutation = useInviteMember(circleId)
  const removeMemberMutation = useRemoveCircleMember(circleId)
  const permissionMutation = useUpdateMemberPermissions(circleId)
  const addDeviceMutation = useAddDeviceToCircle(circleId)
  const removeDeviceMutation = useRemoveDeviceFromCircle(circleId)

  const circle = circlesQuery.data?.find(
    (item) => item.circleId === circleId,
  )
  const members = membersQuery.data ?? []
  const circleDevices = devicesQuery.data ?? []

  const availableDevices = (sharedDevicesQuery.data ?? []).filter(
    (device) =>
      !circleDevices.some((circleDevice) => circleDevice.deviceId === device.deviceId),
  )

  const isOwner = circle?.role === 'OWNER'
  const isLoading =
    circlesQuery.isLoading || membersQuery.isLoading || devicesQuery.isLoading

  async function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('')
    setErrorMessage('')

    const id = userId.trim()
    if (!id) return

    try {
      await inviteMutation.mutateAsync(id)
      setUserId('')
      setNotice('Invitation created.')
    } catch {
      setErrorMessage('Could not invite this user. Check the user ID and permissions.')
    }
  }

  async function handleAddDevice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('')
    setErrorMessage('')

    if (!selectedDeviceId) return

    try {
      await addDeviceMutation.mutateAsync(selectedDeviceId)
      setSelectedDeviceId('')
      setNotice('Device added to this circle.')
    } catch {
      setErrorMessage('Could not add the device to this circle.')
    }
  }

  async function handleRemoveMember(memberUserId: string) {
    if (!window.confirm('Remove this member from the circle?')) return

    setNotice('')
    setErrorMessage('')

    try {
      await removeMemberMutation.mutateAsync(memberUserId)
      setNotice('Member removed.')
    } catch {
      setErrorMessage('Could not remove this member.')
    }
  }

  async function handleRemoveDevice(deviceId: string) {
    if (!window.confirm('Remove this device from the circle?')) return

    setNotice('')
    setErrorMessage('')

    try {
      await removeDeviceMutation.mutateAsync(deviceId)
      setNotice('Device removed from the circle.')
    } catch {
      setErrorMessage('Could not remove this device.')
    }
  }

  async function handlePermissionChange(
    memberUserId: string,
    canSendMessages: boolean,
  ) {
    setNotice('')
    setErrorMessage('')

    try {
      await permissionMutation.mutateAsync({
        memberUserId,
        canSendMessages,
      })
      setNotice('Member permissions updated.')
    } catch {
      setErrorMessage('Could not update member permissions.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20 text-sm text-zinc-400">
        <LoaderCircle size={20} className="animate-spin" />
        Loading circle…
      </div>
    )
  }

  if (circlesQuery.isError || membersQuery.isError || devicesQuery.isError) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5">
        <h1 className="font-semibold text-red-300">
          Could not load this circle
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Check your connection and access permissions, then try again.
        </p>
        <button
          type="button"
          onClick={() => {
            void circlesQuery.refetch()
            void membersQuery.refetch()
            void devicesQuery.refetch()
          }}
          className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!circle) {
    return (
      <div className="space-y-4 py-8">
        <h1 className="text-2xl font-semibold">Circle not found</h1>
        <p className="text-sm text-zinc-400">
          This circle may have been removed or you may no longer have access.
        </p>
        <Link to="/circles" className="inline-flex items-center gap-2 text-amber-300">
          <ArrowLeft size={16} />
          Back to circles
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <Link
        to="/circles"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft size={17} />
        All circles
      </Link>

      <header>
        <p className="text-sm font-medium text-amber-400">CIRCLE</p>
        <h1 className="mt-2 break-words text-3xl font-semibold tracking-tight">
          {circle.name}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {isOwner ? 'You own this circle.' : 'You are a member of this circle.'}
        </p>
      </header>

      {notice && (
        <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-300">
          {notice}
        </p>
      )}
      {errorMessage && (
        <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <UsersRound className="text-amber-300" size={20} />
          <p className="mt-3 text-2xl font-semibold">{members.length}</p>
          <p className="mt-1 text-sm text-zinc-400">Members</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <Lightbulb className="text-amber-300" size={20} />
          <p className="mt-3 text-2xl font-semibold">{circleDevices.length}</p>
          <p className="mt-1 text-sm text-zinc-400">Shared devices</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab('members')}
          className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
            activeTab === 'members'
              ? 'border-amber-300 text-amber-200'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Members
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('devices')}
          className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
            activeTab === 'devices'
              ? 'border-amber-300 text-amber-200'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Devices
        </button>
      </div>

      {activeTab === 'members' && (
        <section className="space-y-5">
          {isOwner && (
            <form
              onSubmit={handleInvite}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
            >
              <h2 className="font-semibold">Invite a member</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Enter the user ID of the person you want to invite.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  required
                  placeholder="User ID"
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-amber-300/50"
                />
                <button
                  type="submit"
                  disabled={!userId.trim() || inviteMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-50"
                >
                  {inviteMutation.isPending ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  Invite
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {members.map((member) => (
              <article
                key={member.userId}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-zinc-300">
                  <UsersRound size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="break-all text-sm font-medium">{member.userId}</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {member.role} · Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </p>
                </div>

                {isOwner && member.role !== 'OWNER' && (
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-zinc-400">
                      <input
                        type="checkbox"
                        checked={member.canSendMessages}
                        disabled={permissionMutation.isPending}
                        onChange={(event) =>
                          void handlePermissionChange(
                            member.userId,
                            event.target.checked,
                          )
                        }
                        className="accent-amber-300"
                      />
                      Can send messages
                    </label>
                    <button
                      type="button"
                      aria-label={`Remove member ${member.userId}`}
                      disabled={removeMemberMutation.isPending}
                      onClick={() => void handleRemoveMember(member.userId)}
                      className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                )}
              </article>
            ))}

            {members.length === 0 && (
              <p className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-400">
                No members found for this circle.
              </p>
            )}
          </div>
        </section>
      )}

      {activeTab === 'devices' && (
        <section className="space-y-5">
          {isOwner && (
            <form
              onSubmit={handleAddDevice}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
            >
              <h2 className="font-semibold">Share a device</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Choose one of your devices to add to this circle.
              </p>

              {sharedDevicesQuery.isLoading ? (
                <p className="mt-4 text-sm text-zinc-400">Loading devices…</p>
              ) : sharedDevicesQuery.isError ? (
                <p className="mt-4 text-sm text-red-400">
                  Could not load your available devices.
                </p>
              ) : (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <select
                    value={selectedDeviceId}
                    onChange={(event) => setSelectedDeviceId(event.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-amber-300/50"
                  >
                    <option value="">Select a device</option>
                    {availableDevices.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.name} · {device.status}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={!selectedDeviceId || addDeviceMutation.isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-50"
                  >
                    {addDeviceMutation.isPending ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                    Add device
                  </button>
                </div>
              )}
            </form>
          )}

          <div className="space-y-3">
            {circleDevices.map((device) => (
              <article
                key={device.deviceId}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300">
                  <Lightbulb size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    to={`/devices/${device.deviceId}`}
                    className="break-all text-sm font-medium hover:text-amber-200"
                  >
                    {device.deviceId}
                  </Link>
                  <p className="mt-1 text-xs text-zinc-400">
                    Added {new Date(device.addedAt).toLocaleDateString()}
                  </p>
                </div>

                {isOwner && (
                  <button
                    type="button"
                    aria-label={`Remove device ${device.deviceId}`}
                    disabled={removeDeviceMutation.isPending}
                    onClick={() => void handleRemoveDevice(device.deviceId)}
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </article>
            ))}

            {circleDevices.length === 0 && (
              <p className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-400">
                No devices have been shared with this circle yet.
              </p>
            )}
          </div>
        </section>
      )}

      {circle.canSendMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300">
          <MessageCircle size={18} className="text-amber-300" />
          You have permission to send messages in this circle.
        </div>
      )}
    </div>
  )
}
