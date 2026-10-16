
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  UsersRound,
  Lightbulb,
  MessageCircle,
  Plus,
  Send,
  Crown,
  Wifi,
  WifiOff,
} from 'lucide-react'

type Tab = 'overview' | 'members' | 'devices' | 'messages'

const demoMembers = [
  {
    id: 'member-1',
    name: 'You',
    email: 'you@example.com',
    role: 'OWNER',
  },
  {
    id: 'member-2',
    name: 'Alex',
    email: 'alex@example.com',
    role: 'MEMBER',
  },
  {
    id: 'member-3',
    name: 'Sam',
    email: 'sam@example.com',
    role: 'MEMBER',
  },
]

const demoDevices = [
  {
    id: 'device-1',
    name: 'Bedroom OneLight',
    status: 'ONLINE',
  },
  {
    id: 'device-2',
    name: 'Living Room',
    status: 'OFFLINE',
  },
]

export default function CircleDetailPage() {
  const { circleId } = useParams()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [message, setMessage] = useState('')

  // Replace with data fetched using circleId.
  const circle = {
    id: circleId ?? '',
    name: circleId === 'demo-circle-2' ? 'Close Friends' : 'Home',
    description: 'Share moments and devices with people you care about.',
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    { id: 'devices', label: 'Devices' },
    { id: 'messages', label: 'Messages' },
  ]

  function handleSendMessage() {
    if (!message.trim()) return

    // TODO: Send through the messages API.
    // Clear only after the API confirms success.
    setMessage('')
  }

  return (
    <section className="space-y-6">
      <Link
        to="/circles"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft size={17} />
        All circles
      </Link>

      <header>
        <div className="flex size-14 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
          <UsersRound size={28} />
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {circle.name}
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {circle.description}
            </p>
          </div>

          <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs text-violet-300">
            Circle
          </span>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/[0.07] bg-[#19191e] p-4">
          <UsersRound size={19} className="text-violet-300" />
          <p className="mt-3 text-2xl font-semibold">
            {demoMembers.length}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Members</p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#19191e] p-4">
          <Lightbulb size={19} className="text-orange-300" />
          <p className="mt-3 text-2xl font-semibold">
            {demoDevices.length}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Devices</p>
        </div>
      </div>

      <div
        className="flex gap-1 overflow-x-auto rounded-xl border border-white/[0.06] bg-[#19191e] p-1"
        role="tablist"
        aria-label="Circle sections"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'min-h-10 shrink-0 rounded-lg px-3 text-sm font-medium transition',
              activeTab === tab.id
                ? 'bg-orange-300 text-zinc-950'
                : 'text-zinc-400 hover:text-white',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.07] bg-[#19191e] p-5">
            <h2 className="font-semibold">Your circle</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Manage membership and shared devices, or send a message
              to a device available in this circle.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('members')}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-sm hover:bg-white/[0.05]"
              >
                <UsersRound size={17} />
                Members
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('devices')}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-sm hover:bg-white/[0.05]"
              >
                <Lightbulb size={17} />
                Devices
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Members</h2>

            <button
              type="button"
              onClick={() => {
                // TODO: Open the invite-member flow.
                alert('Member invitations will be connected next.')
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-orange-300 px-3 text-sm font-semibold text-zinc-950"
            >
              <Plus size={17} />
              Invite
            </button>
          </div>

          <div className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.07] bg-[#19191e] px-4">
            {demoMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3 py-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-zinc-800 font-semibold text-zinc-200">
                  {member.name.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {member.name}
                  </p>
                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {member.email}
                  </p>
                </div>

                {member.role === 'OWNER' && (
                  <span className="inline-flex items-center gap-1 text-xs text-orange-300">
                    <Crown size={13} />
                    Owner
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'devices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Shared devices</h2>

            <button
              type="button"
              onClick={() => {
                // TODO: Open the device assignment flow.
                alert('Adding devices will be connected next.')
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-orange-300 px-3 text-sm font-semibold text-zinc-950"
            >
              <Plus size={17} />
              Add device
            </button>
          </div>

          {demoDevices.map((device) => {
            const online = device.status === 'ONLINE'

            return (
              <Link
                key={device.id}
                to={`/devices/${device.id}`}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-[#19191e] p-4"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-orange-300/10 text-orange-300">
                  <Lightbulb size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {device.name}
                  </p>

                  <p className={online
                    ? 'mt-1 text-xs text-emerald-400'
                    : 'mt-1 text-xs text-zinc-500'}
                  >
                    {online ? 'Online' : 'Offline'}
                  </p>
                </div>

                {online
                  ? <Wifi size={17} className="text-emerald-400" />
                  : <WifiOff size={17} className="text-zinc-500" />}
              </Link>
            )
          })}
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.07] bg-[#19191e] p-5">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} className="text-orange-300" />
              <h2 className="font-semibold">Send a message</h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Choose a device in this circle and send a message
              to its display.
            </p>

            <label className="mt-5 block space-y-2">
              <span className="text-sm text-zinc-300">Message</span>

              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={240}
                rows={3}
                placeholder="Write something thoughtful..."
                className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-orange-300"
              />

              <span className="block text-right text-xs text-zinc-500">
                {message.length}/240
              </span>
            </label>

            <button
              type="button"
              disabled={!message.trim()}
              onClick={handleSendMessage}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-300 px-4 font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={17} />
              Send message
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
