
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserRound,
  Mail,
  ShieldCheck,
  Smartphone,
  LogOut,
  ChevronRight,
  LoaderCircle,
} from 'lucide-react'
import { useAuthStore } from '../../../stores/auth.store'
import { api } from '../../../lib/axios'

export default function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.userId)
  const clearSession = useAuthStore((state) => state.clearSession)

  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState('')

  async function handleSignOut() {
    setSigningOut(true)
    setError('')

    try {
      // The backend logout endpoint may be unavailable until
      // refresh-token handling is implemented.
      await api.post('/auth/logout').catch(() => undefined)
    } finally {
      clearSession()
      navigate('/login', { replace: true })
      setSigningOut(false)
    }
  }

  const displayName = user || 'OneLight user'
  const email = 'No email available'

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <header>
        <p className="text-sm font-medium text-amber-400">ACCOUNT</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Your profile
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Manage your account and app preferences.
        </p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
            <UserRound size={30} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold">{displayName}</h2>
            <p className="mt-1 truncate text-sm text-zinc-400">{email}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-400">
              <ShieldCheck size={14} />
              Signed in
            </span>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="font-semibold">Account information</h2>
        </div>

        <div className="flex items-center gap-4 px-5 py-4">
          <Mail className="shrink-0 text-zinc-400" size={20} />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-zinc-400">Email address</p>
            <p className="mt-1 truncate text-sm">{email}</p>
          </div>
          <ChevronRight className="text-zinc-600" size={18} />
        </div>

        <div className="flex items-center gap-4 border-t border-white/10 px-5 py-4">
          <Smartphone className="shrink-0 text-zinc-400" size={20} />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-zinc-400">Application</p>
            <p className="mt-1 text-sm">OneLight Web · PWA</p>
          </div>
          <span className="text-xs text-zinc-500">Installed-ready</span>
        </div>
      </section>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3.5 font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {signingOut ? (
          <LoaderCircle className="animate-spin" size={18} />
        ) : (
          <LogOut size={18} />
        )}
        {signingOut ? 'Signing out…' : 'Sign out'}
      </button>
    </div>
  )
}
