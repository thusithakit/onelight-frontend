
import { Link } from 'react-router-dom'
import { Plus, Lightbulb, ArrowUpRight } from 'lucide-react'

import DeviceCard from '../components/DeviceCard'
import type { Device } from '../types'

// Temporary development data.
// Replace this with the devices API in a later step.
const demoDevices: Device[] = [
  {
    id: 'demo-device-1',
    name: 'Bedroom OneLight',
    deviceIdentifier: 'OL-DEMO-001',
    status: 'ONLINE',
    firmwareVersion: '1.0.0',
  },
  {
    id: 'demo-device-2',
    name: 'Living Room',
    deviceIdentifier: 'OL-DEMO-002',
    status: 'OFFLINE',
    firmwareVersion: '1.0.0',
  },
]

export default function DevicesPage() {
  const devices = demoDevices

  return (
    <section className="space-y-7">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-orange-300">
            YOUR SPACE
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Devices
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Your lights, all in one place.
          </p>
        </div>

        <Link
          to="/devices/new"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-orange-300 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-orange-200"
        >
          <Plus size={18} />
          <span>Add</span>
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/[0.07] bg-[#19191e] p-4">
          <p className="text-sm text-zinc-400">
            Total devices
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {devices.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#19191e] p-4">
          <p className="text-sm text-zinc-400">
            Online now
          </p>

          <p className="mt-2 text-3xl font-semibold text-emerald-400">
            {devices.filter((device) => device.status === 'ONLINE').length}
          </p>
        </div>
      </div>

      {devices.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-zinc-200">
              Your devices
            </h2>

            <span className="text-xs text-zinc-500">
              {devices.length} devices
            </span>
          </div>

          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-zinc-700 px-6 py-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-orange-300/10 text-orange-300">
            <Lightbulb size={30} />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            No devices yet
          </h2>

          <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-400">
            Pair your first OneLight to control your lighting
            and send messages to its display.
          </p>

          <Link
            to="/devices/new"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-300 px-4 py-3 font-semibold text-zinc-950"
          >
            Add your first device
            <ArrowUpRight size={17} />
          </Link>
        </div>
      )}
    </section>
  )
}
