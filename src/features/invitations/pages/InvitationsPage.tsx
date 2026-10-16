
import { useState } from 'react'
import { Mail, CheckCheck } from 'lucide-react'

import InvitationCard from '../components/InvitationCard'
import type { Invitation } from '../types'

const initialInvitations: Invitation[] = [
  {
    id: 'demo-invitation-1',
    circleId: 'demo-circle-1',
    circleName: 'Family Home',
    inviterName: 'Alex',
    inviterEmail: 'alex@example.com',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-invitation-2',
    circleId: 'demo-circle-2',
    circleName: 'Close Friends',
    inviterName: 'Sam',
    inviterEmail: 'sam@example.com',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
]

export default function InvitationsPage() {
  const [invitations, setInvitations] =
    useState<Invitation[]>(initialInvitations)

  const [processingId, setProcessingId] =
    useState<string | null>(null)

  const [feedback, setFeedback] = useState('')

  const pendingInvitations = invitations.filter(
    (invitation) => invitation.status === 'PENDING',
  )

  async function handleResponse(
    invitationId: string,
    status: 'ACCEPTED' | 'REJECTED',
  ) {
    setProcessingId(invitationId)
    setFeedback('')

    try {
      // TODO: Call the invitation API and wait for success here.
      // This temporary implementation only updates local state.
      await Promise.resolve()

      setInvitations((current) =>
        current.map((invitation) =>
          invitation.id === invitationId
            ? { ...invitation, status }
            : invitation,
        ),
      )

      setFeedback(
        status === 'ACCEPTED'
          ? 'Invitation accepted.'
          : 'Invitation rejected.',
      )
    } catch {
      setFeedback('Unable to update the invitation. Try again.')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <section className="space-y-7">
      <header>
        <p className="text-sm text-violet-300">STAY CONNECTED</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Invitations
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          People are inviting you to share their OneLight circles.
        </p>
      </header>

      <div className="rounded-2xl border border-white/[0.07] bg-[#19191e] p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
            <Mail size={22} />
          </div>

          <div>
            <p className="text-sm text-zinc-400">
              Pending invitations
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {pendingInvitations.length}
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <p
          role="status"
          className="rounded-xl border border-white/[0.08] bg-[#19191e] p-3 text-sm text-zinc-300"
        >
          {feedback}
        </p>
      )}

      {pendingInvitations.length > 0 ? (
        <div className="space-y-3">
          <h2 className="font-medium text-zinc-200">
            Waiting for your response
          </h2>

          {pendingInvitations.map((invitation) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              loading={processingId === invitation.id}
              onAccept={(id) => handleResponse(id, 'ACCEPTED')}
              onReject={(id) => handleResponse(id, 'REJECTED')}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-zinc-700 px-6 py-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
            <CheckCheck size={30} />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            You're all caught up
          </h2>

          <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-400">
            You don't have any pending invitations right now.
          </p>
        </div>
      )}
    </section>
  )
}
