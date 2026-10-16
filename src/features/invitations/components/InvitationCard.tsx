
import { UsersRound, Check, X } from 'lucide-react'
import type { Invitation } from '../types'

interface InvitationCardProps {
  invitation: Invitation
  loading: boolean
  onAccept: (id: string) => void
  onReject: (id: string) => void
}

export default function InvitationCard({
  invitation,
  loading,
  onAccept,
  onReject,
}: InvitationCardProps) {
  return (
    <article className="rounded-2xl border border-white/[0.07] bg-[#19191e] p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
          <UsersRound size={24} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{invitation.circleName}</h2>

          <p className="mt-1 text-sm leading-6 text-zinc-400">
            <span className="text-zinc-200">
              {invitation.inviterName}
            </span>{' '}
            invited you to join this circle.
          </p>

          <p className="mt-1 break-all text-xs text-zinc-500">
            {invitation.inviterEmail}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => onReject(invitation.id)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.05] disabled:opacity-50"
        >
          <X size={17} />
          Reject
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => onAccept(invitation.id)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-300 px-3 text-sm font-semibold text-zinc-950 transition hover:bg-orange-200 disabled:opacity-50"
        >
          <Check size={17} />
          Accept
        </button>
      </div>
    </article>
  )
}
