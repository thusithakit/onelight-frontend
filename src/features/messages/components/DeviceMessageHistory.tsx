import {
  AlertCircle,
  Check,
  Clock3,
  LoaderCircle,
  MessageSquare,
} from 'lucide-react'

import { useDeviceMessages } from '../api/messages.queries'
import type { DeviceMessage } from '../types'

interface DeviceMessageHistoryProps {
  deviceId: string
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function getStatusPresentation(status: string) {
  switch (status.toUpperCase()) {
    case 'DELIVERED':
      return {
        label: 'Delivered',
        icon: Check,
        className: 'text-emerald-400',
      }

    case 'FAILED':
      return {
        label: 'Failed',
        icon: AlertCircle,
        className: 'text-red-400',
      }

    case 'SENT':
      return {
        label: 'Sent',
        icon: Check,
        className: 'text-sky-400',
      }

    default:
      return {
        label: status.replaceAll('_', ' '),
        icon: Clock3,
        className: 'text-amber-300',
      }
  }
}

function MessageCard({ message }: { message: DeviceMessage }) {
  const status = getStatusPresentation(message.status)
  const StatusIcon = status.icon

  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300">
          <MessageSquare size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-zinc-500">From</p>
              <p
                className="mt-0.5 break-all text-sm font-medium text-zinc-200"
                title={message.senderName || "Anonymous"}
              >
                {message.senderName}
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 text-xs ${status.className}`}
            >
              <StatusIcon size={13} />
              {status.label}
            </span>
          </div>

          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-white">
            {message.content}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3 text-xs text-zinc-500">
            <time dateTime={message.createdAt}>
              {formatDate(message.createdAt)}
            </time>

            {message.deliveredAt && (
              <span>
                Delivered {formatDate(message.deliveredAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function DeviceMessageHistory({
  deviceId,
}: DeviceMessageHistoryProps) {
  const {
    data: messages = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useDeviceMessages(deviceId)

  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  )

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Message inbox
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Messages received from all users
          </p>
        </div>

        {isFetching && (
          <LoaderCircle
            size={16}
            className="animate-spin text-zinc-500"
            aria-label="Refreshing messages"
          />
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-zinc-400">
          <LoaderCircle size={18} className="animate-spin" />
          Loading messages…
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-sm text-red-300">
            Could not load this device's messages.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-2 text-sm text-amber-300 underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      ) : sortedMessages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-5 py-10 text-center">
          <MessageSquare
            size={25}
            className="mx-auto mb-3 text-zinc-600"
          />

          <p className="text-sm font-medium text-zinc-300">
            No messages received yet
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Messages sent to this device will appear here.
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-zinc-500">
            {sortedMessages.length}{' '}
            {sortedMessages.length === 1 ? 'message' : 'messages'}
          </p>

          <div className="space-y-3">
            {sortedMessages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
