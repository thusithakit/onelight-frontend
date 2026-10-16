
import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Lightbulb,
  Power,
  Wifi,
  WifiOff,
  Clock3,
  Send,
  MessageSquare,
  SlidersHorizontal,
  Check,
} from 'lucide-react'

interface DisplayMessage {
  id: string
  text: string
  createdAt: string
}

const demoDevice = {
  id: 'device-001',
  name: 'Bedroom OneLight',
  deviceIdentifier: 'OL-ESP32-001',
  status: 'ONLINE' as const,
  firmwareVersion: '1.0.0',
  lastSeenAt: 'Just now',
}

const initialMessages: DisplayMessage[] = [
  {
    id: 'message-001',
    text: 'Have a wonderful day ❤️',
    createdAt: 'Today, 9:30 AM',
  },
  {
    id: 'message-002',
    text: 'Dinner is ready!',
    createdAt: 'Yesterday, 7:15 PM',
  },
]

export default function DeviceDetailPage() {
  const { deviceId } = useParams()

  const [isOn, setIsOn] = useState(true)
  const [brightness, setBrightness] = useState(72)
  const [color, setColor] = useState('#ffb347')
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const [notice, setNotice] = useState('')

  // Temporary demo data. Replace with a device API query later.
  const device = {
    ...demoDevice,
    id: deviceId ?? demoDevice.id,
    name:
      deviceId === demoDevice.id
        ? demoDevice.name
        : `OneLight device`,
  }

  function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const text = messageText.trim()
    if (!text) return

    setMessages((current) => [
      {
        id: crypto.randomUUID(),
        text,
        createdAt: new Date().toLocaleString(),
      },
      ...current,
    ])

    setMessageText('')
    setNotice('Message added to the local demo history.')
  }

  function handleToggle() {
    setIsOn((current) => !current)
    setNotice(`Light ${isOn ? 'turned off' : 'turned on'} in the demo.`)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <Link
        to="/devices"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft size={17} />
        All devices
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-amber-400">DEVICE DETAILS</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
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
          className="flex items-center gap-2 rounded-xl border border-amber-300/15 bg-amber-300/[0.06] px-4 py-3 text-sm text-amber-200"
        >
          <Check size={16} />
          {notice}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          {/* Light preview */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl transition-opacity"
              style={{
                backgroundColor: color,
                opacity: isOn ? brightness / 180 : 0,
              }}
            />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Light preview</p>
                <h2 className="mt-1 text-xl font-semibold">
                  {isOn ? 'Your light is on' : 'Your light is off'}
                </h2>
              </div>

              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 transition"
                style={{
                  backgroundColor: isOn ? `${color}25` : 'rgba(255,255,255,0.04)',
                  color: isOn ? color : '#71717a',
                }}
              >
                <Lightbulb size={28} />
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              aria-pressed={isOn}
              className={`relative mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 font-semibold transition ${
                isOn
                  ? 'bg-amber-300 text-zinc-950 hover:bg-amber-200'
                  : 'border border-white/10 bg-white/[0.06] text-white hover:bg-white/10'
              }`}
            >
              <Power size={18} />
              Turn light {isOn ? 'off' : 'on'}
            </button>

            <p className="relative mt-3 text-center text-xs text-zinc-500">
              Preview only · hardware commands are not connected yet
            </p>
          </div>

          {/* Light controls */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="text-amber-300" size={20} />
              <h2 className="text-lg font-semibold">Light settings</h2>
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between">
                <label htmlFor="brightness" className="text-sm text-zinc-300">
                  Brightness
                </label>
                <span className="text-sm font-medium tabular-nums">
                  {brightness}%
                </span>
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
                  Choose a color for your light
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
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
          </div>

          {/* Device information */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
            <h2 className="text-lg font-semibold">Device information</h2>

            <div className="mt-5 divide-y divide-white/10">
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm text-zinc-400">Firmware</span>
                <span className="text-sm">{device.firmwareVersion}</span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm text-zinc-400">Last seen</span>
                <span className="inline-flex items-center gap-1.5 text-sm">
                  <Clock3 size={14} className="text-zinc-500" />
                  {device.lastSeenAt}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm text-zinc-400">Device ID</span>
                <span className="max-w-[55%] break-all text-right text-sm">
                  {device.id}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Display messages */}
        <section className="h-fit rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-amber-300" size={20} />
            <div>
              <h2 className="text-lg font-semibold">Display messages</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Send a message to show on your OneLight display.
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
              placeholder="Write something meaningful…"
              className="w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/10"
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-zinc-500">
                {messageText.length}/240 characters
              </span>
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={15} />
                Send message
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent messages</h3>
              <span className="text-xs text-zinc-500">
                {messages.length} messages
              </span>
            </div>

            {messages.length === 0 ? (
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
                      {message.text}
                    </p>
                    <p className="mt-3 text-xs text-zinc-500">
                      {message.createdAt}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
