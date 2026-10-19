import { Link } from 'react-router-dom'
import { UsersRound, ChevronRight, ShieldCheck, MessageCircle } from 'lucide-react'
import type { Circle } from '../types'

interface CircleCardProps {
  circle: Circle
}

export default function CircleCard({ circle }: CircleCardProps) {
  return (
    <Link
      to={`/circles/${circle.circleId}`}
      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-amber-300/25 hover:bg-white/[0.05]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-300">
        <UsersRound size={23} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate font-semibold">{circle.name}</h2>
          {circle.role === 'OWNER' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/10 px-2 py-0.5 text-xs text-amber-200">
              <ShieldCheck size={12} />
              Owner
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <UsersRound size={13} />
            {circle.role === 'OWNER' ? 'Your circle' : 'Member'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle size={13} />
            {circle.canSendMessage ? 'Can send messages' : 'View only'}
          </span>
        </div>
      </div>

      <ChevronRight
        size={19}
        className="shrink-0 text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-amber-300"
      />
    </Link>
  )
}
