import { Link } from 'react-router-dom'
import {
  Plus,
  UsersRound,
  LoaderCircle,
  RefreshCw,
} from 'lucide-react'
import CircleCard from '../components/CircleCard'
import { useCircles } from '../api/circles.queries'

export default function CirclesPage() {
  const {
    data: circles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useCircles()

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-amber-400">YOUR COMMUNITY</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Circles
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Share OneLight devices with the people who matter to you.
          </p>
        </div>

        <Link
          to="/circles/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200"
        >
          <Plus size={17} />
          <span className="hidden sm:inline">Create circle</span>
          <span className="sm:hidden">Create</span>
        </Link>
      </header>

      {isLoading && (
        <div className="flex items-center justify-center gap-3 py-16 text-sm text-zinc-400">
          <LoaderCircle size={20} className="animate-spin" />
          Loading circles…
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5">
          <p className="font-medium text-red-300">Couldn't load your circles.</p>
          <p className="mt-2 break-words text-sm text-zinc-400">
            {error instanceof Error ? error.message : 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && circles.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-300">
            <UsersRound size={27} />
          </div>
          <h2 className="mt-5 text-lg font-semibold">Create your first circle</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-400">
            Circles let you share compatible devices and send messages with
            members you invite.
          </p>
          <Link
            to="/circles/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-200"
          >
            <Plus size={17} />
            Create a circle
          </Link>
        </div>
      )}

      {!isLoading && !isError && circles.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Your circles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {circles.map((circle) => (
              <CircleCard key={circle.circleId} circle={circle} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
