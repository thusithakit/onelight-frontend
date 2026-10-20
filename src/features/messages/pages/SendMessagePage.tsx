import { useEffect, useState, type FormEvent } from 'react'
import {
  AlertCircle,
  Check,
  Clock3,
  LoaderCircle,
  MessageSquare,
  Send,
} from 'lucide-react'

import { useMySharedDevices } from '../../circles/api/circles.queries'
import {
  useDeviceMessages,
  useSendDeviceMessage,
} from '../api/messages.queries'
import type { DeviceMessage } from '../types'
import DeviceMessageHistory from '../components/DeviceMessageHistory'

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function statusLabel(status: string) {
  switch (status.toUpperCase()) {
    case 'DELIVERED':
      return 'Delivered'
    case 'SENT':
      return 'Sent'
    case 'FAILED':
      return 'Failed'
    case 'PENDING':
      return 'Pending'
    default:
      return status.replaceAll('_', ' ').toLowerCase()
  }
}

function MessageStatus({ message }: { message: DeviceMessage }) {
  const status = message.status.toUpperCase()

  const Icon =
    status === 'DELIVERED'
      ? Check
      : status === 'FAILED'
        ? AlertCircle
        : Clock3

  const color =
    status === 'DELIVERED'
      ? 'text-emerald-400'
      : status === 'FAILED'
        ? 'text-red-400'
        : 'text-amber-300'

  return (
    <span className={`inline-flex items-center gap-1 ${color}`}>
      <Icon size={13} />
      {statusLabel(message.status)}
    </span>
  )
}

export default function SendMessagePage() {
  const [deviceId, setDeviceId] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const sharedDevicesQuery = useMySharedDevices()
  const sendMessage = useSendDeviceMessage()

  const sharedDevices = sharedDevicesQuery.data ?? []
  const allowedDevices = sharedDevices.filter(
    (device) => device.canSendMessages,
  )

  // Keep the selection valid when the available devices load or change.
  useEffect(() => {
    if (
      allowedDevices.length > 0 &&
      !allowedDevices.some((device) => device.deviceId === deviceId)
    ) {
      setDeviceId(allowedDevices[0].deviceId)
    }

    if (allowedDevices.length === 0) {
      setDeviceId('')
    }
  }, [deviceId, sharedDevicesQuery.data])

  const messagesQuery = useDeviceMessages(deviceId)
  const messages = messagesQuery.data ?? []

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const trimmedContent = content.trim()

    if (!deviceId) {
      setError('Choose a device first.')
      return
    }

    if (!trimmedContent) {
      setError('Enter a message to send.')
      return
    }

    try {
      await sendMessage.mutateAsync({
        deviceId,
        content: trimmedContent,
      })

      setContent('')
    } catch {
      setError('The message could not be sent. Please try again.')
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 pb-8">
      <header>
        <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
          <MessageSquare size={21} />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Send a message
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Send a little message to a shared OneLight device.
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 sm:p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="shared-device"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Shared device
            </label>

            {sharedDevicesQuery.isLoading ? (
              <div className="flex items-center gap-2 py-3 text-sm text-zinc-400">
                <LoaderCircle size={16} className="animate-spin" />
                Loading shared devices…
              </div>
            ) : sharedDevicesQuery.isError ? (
              <p className="text-sm text-red-300">
                Could not load shared devices. Please try again.
              </p>
            ) : allowedDevices.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-zinc-400">
                You don't have permission to message any shared devices yet.
                Ask the circle owner to enable messaging permissions.
              </div>
            ) : (
              <select
                id="shared-device"
                value={deviceId}
                onChange={(event) => setDeviceId(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-white outline-none transition focus:border-amber-400/60"
              >
                {allowedDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.name} · {device.circleName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label
              htmlFor="message-content"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Your message
            </label>

            <textarea
              id="message-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Thinking of you…"
              disabled={!deviceId || sendMessage.isPending}
              className="w-full resize-y rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-amber-400/60 disabled:opacity-50"
            />

            <p className="mt-1 text-right text-xs text-zinc-500">
              {content.length}/500
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}

          {sendMessage.isSuccess && (
            <p role="status" className="text-sm text-emerald-300">
              Message submitted successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={
              !deviceId ||
              !content.trim() ||
              sendMessage.isPending ||
              allowedDevices.length === 0
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sendMessage.isPending ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Send size={17} />
            )}
            {sendMessage.isPending ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </section>

      <section className="space-y-3">

        <DeviceMessageHistory deviceId={deviceId} />
      </section>
    </main>
  )
}
