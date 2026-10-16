
import { Link } from 'react-router-dom'
import { ChevronRight, UsersRound, Lightbulb } from 'lucide-react'
import type { Circle } from '../types'

interface CircleCardProps {
  circle: Circle
}

export default function CircleCard({ circle }: CircleCardProps) {
  return (
    <Link
      to={`/circles/${circle.id}`}
      className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#19191e] p-4 transition hover:border-white/[0.14] hover:bg-[#1e1e24] active:scale-[0.99]"
    >
      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
        <UsersRound size={26} strokeWidth={1.7} />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold text-zinc-100">
          {circle.name}
        </h2>

        <p className="mt-1 truncate text-sm text-zinc-500">
          {circle.description || 'Your shared OneLight space'}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <UsersRound size={13} />
            {circle.memberCount} members
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Lightbulb size={13} />
            {circle.deviceCount} devices
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
