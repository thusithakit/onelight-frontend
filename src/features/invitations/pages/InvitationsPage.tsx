import {
  Check,
  Clock3,
  LoaderCircle,
  Mail,
  RefreshCw,
  UsersRound,
  X,
} from 'lucide-react'
import {
  useAcceptInvitation,
  useDeclineInvitation,
  useInvitations,
} from '../api/invitations.queries'

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

export default function InvitationsPage() {
  const invitationsQuery = useInvitations()
  const acceptMutation = useAcceptInvitation()
  const declineMutation = useDeclineInvitation()

  const invitations = invitationsQuery.data ?? []
  const pendingInvitations = invitations.filter(
    (invitation) => invitation.status.toUpperCase() === 'PENDING',
  )
  const previousInvitations = invitations.filter(
    (invitation) => invitation.status.toUpperCase() !== 'PENDING',
  )

  const isActing = acceptMutation.isPending || declineMutation.isPending

  async function respond(
    invitationId: string,
    action: 'accept' | 'decline',
  ) {
    try {
      if (action === 'accept') {
        await acceptMutation.mutateAsync(invitationId)
      } else {
        await declineMutation.mutateAsync(invitationId)
      }
    } catch {
      // The mutation error is displayed below.
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <p className="text-sm font-medium text-amber-400">STAY CONNECTED</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Invitations
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Manage invitations to join other people's circles.
        </p>
      </header>

      {(acceptMutation.isError || declineMutation.isError) && (
        <div role="alert" className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-4 text-sm text-red-300">
          That action couldn't be completed. Please try again.
        </div>
      )}

      {invitationsQuery.isLoading && (
        <div className="flex items-center justify-center gap-3 py-16 text-sm text-zinc-400">
          <LoaderCircle size={20} className="animate-spin" />
          Loading invitations…
        </div>
      )}

      {invitationsQuery.isError && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5">
          <p className="font-medium text-red-300">
            Couldn't load invitations.
          </p>
          <button
            type="button"
            onClick={() => void invitationsQuery.refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      )}

      {!invitationsQuery.isLoading && !invitationsQuery.isError && (
        <>
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Pending invitations</h2>
              <span className="rounded-full bg-amber-300/10 px-2.5 py-1 text-xs text-amber-200">
                {pendingInvitations.length}
              </span>
            </div>

            {pendingInvitations.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-zinc-400">
                  <Mail size={23} />
                </div>
                <h3 className="mt-4 font-semibold">You're all caught up</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  New circle invitations will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingInvitations.map((invitation) => (
                  <article
                    key={invitation.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-300">
                        <UsersRound size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-semibold">
                          {invitation.circleName}
                        </h3>
                        <p className="mt-1 break-words text-sm text-zinc-400">
                          Invited by user {invitation.invitedBy}
                        </p>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-zinc-500">
                          <Clock3 size={13} />
                          Received {formatDate(invitation.createdAt)}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Expires {formatDate(invitation.expiresAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => void respond(invitation.id, 'decline')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/5 disabled:opacity-50"
                      >
                        <X size={16} />
                        Decline
                      </button>

                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => void respond(invitation.id, 'accept')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:opacity-50"
                      >
                        {isActing ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                        Accept
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {previousInvitations.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">
                Previous invitations
              </h2>
              <div className="space-y-3">
                {previousInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {invitation.circleName}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {formatDate(invitation.createdAt)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-zinc-400">
                      {invitation.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
