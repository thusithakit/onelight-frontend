
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Lightbulb,
  Wifi,
  WifiOff,
} from 'lucide-react'

import type { Device } from '../types'

interface DeviceCardProps {
  device: Device
}

export default function DeviceCard({ device }: DeviceCardProps) {
  const isOnline = device.status === 'ONLINE'
  const StatusIcon = isOnline ? Wifi : WifiOff

  return (
    <Link
      to={`/devices/${device.id}`}
      className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#19191e] p-4 transition hover:border-white/[0.14] hover:bg-[#1e1e24] active:scale-[0.99]"
    >
      <div
        className={[
          'flex size-14 shrink-0 items-center justify-center rounded-2xl',
          isOnline
            ? 'bg-orange-300/10 text-orange-300'
            : 'bg-zinc-800 text-zinc-500',
        ].join(' ')}
      >
        <Lightbulb size={27} strokeWidth={1.7} />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold text-zinc-100">
          {device.name}
        </h2>

        <p className="mt-1 truncate text-xs text-zinc-500">
          {device.deviceIdentifier}
        </p>

        <div className="mt-2 flex items-center gap-1.5">
          <StatusIcon
            size={13}
            className={isOnline ? 'text-emerald-400' : 'text-zinc-500'}
          />

          <span
            className={[
              'text-xs',
              isOnline ? 'text-emerald-400' : 'text-zinc-500',
            ].join(' ')}
          >
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <ChevronRight
        size={20}
        className="shrink-0 text-zinc-600 transition group-hover:text-zinc-300"
      />
    </Link>
  )
}
