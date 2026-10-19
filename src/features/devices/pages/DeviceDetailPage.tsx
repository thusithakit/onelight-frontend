import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Clock3,
  Lightbulb,
  LoaderCircle,
  MessageSquare,
  Power,
  Send,
  SlidersHorizontal,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { useDevice, useLightSettings, useUpdateLightSettings } from '../api/devices.queries'
import { useDeviceMessages, useSendDeviceMessage } from '../../messages/api/messages.queries'

function formatDate(value: string | null | undefined) {
  if (!value) return 'Not available'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString()
}

export default function DeviceDetailPage() {
  const { deviceId = '' } = useParams()

  const deviceQuery = useDevice(deviceId)
  const lightQuery = useLightSettings(deviceId)
  const messagesQuery = useDeviceMessages(deviceId)

  const updateLight = useUpdateLightSettings(deviceId)
  const sendMessage = useSendDeviceMessage()

  const [brightness, setBrightness] = useState(70)
  const [color, setColor] = useState('#ffb347')
  const [messageText, setMessageText] = useState('')
  const [notice, setNotice] = useState('')

  const device = deviceQuery.data
  const light = lightQuery.data
  const messages = messagesQuery.data ?? []

  useEffect(() => {
    if (light) {
      setBrightness(light.brightness)
      setColor(light.color)
    }
  }, [light?.brightness, light?.color, light])

  async function handleToggle() {
    if (!light) return

    setNotice('')
    try {
      await updateLight.mutateAsync({ on: !light.on })
      setNotice(`Light turned ${light.on ? 'off' : 'on'}.`)
    } catch {
      setNotice('Could not update the light. Please try again.')
    }
  }

  async function handleSaveSettings() {
    setNotice('')

    try {
      await updateLight.mutateAsync({ brightness, color })
      setNotice('Light settings updated.')
    } catch {
      setNotice('Could not save the light settings. Please try again.')
    }
  }

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const content = messageText.trim()
    if (!content || !deviceId) return

    setNotice('')

    try {
      await sendMessage.mutateAsync({ deviceId, content })
      setMessageText('')
      setNotice('Message sent.')
    } catch {
      setNotice('Could not send the message. Please try again.')
    }
  }

  const isLoading = deviceQuery.isLoading || lightQuery.isLoading
  const loadError = deviceQuery.isError || lightQuery.isError

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <Link
        to="/devices"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft size={17} />
        All devices
      </Link>

      {isLoading && (
        <div className="flex items-center justify-center gap-3 py-20 text-sm text-zinc-400">
          <LoaderCircle className="animate-spin" size={20} />
          Loading device…
        </div>
      )}

      {loadError && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5">
          <h2 className="font-semibold text-red-300">
            Could not load this device
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Check your connection and confirm that the device belongs to your
            account.
          </p>
          <button
            type="button"
            onClick={() => {
              void deviceQuery.refetch()
              void lightQuery.refetch()
            }}
            className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !loadError && device && light && (
        <>
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-amber-400">
                DEVICE DETAILS
              </p>
              <h1 className="mt-2 break-words text-3xl font-semibold tracking-tight">
                {device.name}
              </h1>
              <p className="mt-2 break-all text-sm text-zinc-400">
                {device.deviceIdentifier}
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                device.status === 'ONLINE'
                  ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-400'
              }`}
            >
              {device.status === 'ONLINE' ? (
                <Wifi size={15} />
              ) : (
                <WifiOff size={15} />
              )}
              {device.status}
            </span>
          </header>

          {notice && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-200"
            >
              <Check size={16} className="shrink-0 text-amber-300" />
              {notice}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl transition-opacity"
                  style={{
                    backgroundColor: light.color,
                    opacity: light.on ? light.brightness / 180 : 0,
                  }}
                />

                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-400">Light control</p>
                    <h2 className="mt-1 text-xl font-semibold">
                      {light.on ? 'Your light is on' : 'Your light is off'}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                      {light.brightness}% brightness · {light.color}
                    </p>
                  </div>

                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10"
                    style={{
                      backgroundColor: light.on
                        ? `${light.color}25`
                        : 'rgba(255,255,255,0.04)',
                      color: light.on ? light.color : '#71717a',
                    }}
                  >
                    <Lightbulb size={28} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggle}
                  disabled={updateLight.isPending}
                  aria-pressed={light.on}
                  className={`relative mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 font-semibold transition disabled:opacity-50 ${
                    light.on
                      ? 'bg-amber-300 text-zinc-950 hover:bg-amber-200'
                      : 'border border-white/10 bg-white/[0.06] text-white hover:bg-white/10'
                  }`}
                >
                  {updateLight.isPending ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    <Power size={18} />
                  )}
                  Turn light {light.on ? 'off' : 'on'}
                </button>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="text-amber-300" size={20} />
                  <h2 className="text-lg font-semibold">Light settings</h2>
                </div>

                <div className="mt-7">
                  <div className="flex items-center justify-between">
                    <label htmlFor="brightness" className="text-sm text-zinc-300">
                      Brightness
                    </label>
                    <span className="text-sm tabular-nums">{brightness}%</span>
                  </div>

                  <input
                    id="brightness"
                    type="range"
                    min={1}
                    max={100}
                    value={brightness}
                    onChange={(event) => setBrightness(Number(event.target.value))}
                    className="mt-4 w-full accent-amber-300"
                  />

                  <div className="mt-1 flex justify-between text-xs text-zinc-500">
                    <span>Dim</span>
                    <span>Bright</span>
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Light color</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Choose a color
                    </p>
                  </div>

                  <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <span
                      className="h-6 w-6 rounded-full border border-white/20"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm uppercase">{color}</span>
                    <input
                      aria-label="Choose light color"
                      type="color"
                      value={color}
                      onChange={(event) => setColor(event.target.value)}
                      className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={
                    updateLight.isPending ||
                    (brightness === light.brightness && color === light.color)
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {updateLight.isPending && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}
                  Save light settings
                </button>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
                <h2 className="text-lg font-semibold">Device information</h2>
                <div className="mt-5 divide-y divide-white/10">
                  <div className="flex justify-between gap-4 py-3">
                    <span className="text-sm text-zinc-400">Firmware</span>
                    <span className="text-sm">
                      {device.firmwareVersion || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <span className="text-sm text-zinc-400">Last seen</span>
                    <span className="text-right text-sm">
                      {formatDate(device.lastSeenAt)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <span className="text-sm text-zinc-400">Added</span>
                    <span className="text-right text-sm">
                      {formatDate(device.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <span className="text-sm text-zinc-400">Device ID</span>
                    <span className="max-w-[60%] break-all text-right text-sm">
                      {device.id}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            <section className="h-fit rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-amber-300" size={20} />
                <div>
                  <h2 className="text-lg font-semibold">Display messages</h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Send a message to this device.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="mt-6">
                <label
                  htmlFor="device-message"
                  className="mb-2 block text-sm text-zinc-300"
                >
                  Your message
                </label>
                <textarea
                  id="device-message"
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  maxLength={240}
                  rows={4}
                  required
                  placeholder="Write something meaningful…"
                  className="w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/10"
                />

                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-xs text-zinc-500">
                    {messageText.length}/240
                  </span>
                  <button
                    type="submit"
                    disabled={!messageText.trim() || sendMessage.isPending}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {sendMessage.isPending ? (
                      <LoaderCircle size={15} className="animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                    Send
                  </button>
                </div>

                {sendMessage.isError && (
                  <p role="alert" className="mt-3 text-sm text-red-400">
                    Message could not be sent. Please try again.
                  </p>
                )}
              </form>

              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Recent messages</h3>
                  <button
                    type="button"
                    onClick={() => void messagesQuery.refetch()}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Refresh
                  </button>
                </div>

                {messagesQuery.isLoading ? (
                  <p className="mt-4 text-sm text-zinc-500">
                    Loading messages…
                  </p>
                ) : messagesQuery.isError ? (
                  <p className="mt-4 text-sm text-red-400">
                    Could not load message history.
                  </p>
                ) : messages.length === 0 ? (
                  <p className="mt-4 rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-zinc-500">
                    No messages yet. Send your first one above.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {messages.map((message) => (
                      <article
                        key={message.id}
                        className="rounded-2xl border border-white/10 bg-black/15 p-4"
                      >
                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-200">
                          {message.content}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs text-zinc-500">
                            {formatDate(message.createdAt)}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {message.status}
                          </span>
                        </div>
                        {message.deliveredAt && (
                          <p className="mt-1 text-xs text-emerald-400">
                            Delivered {formatDate(message.deliveredAt)}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  )
}
