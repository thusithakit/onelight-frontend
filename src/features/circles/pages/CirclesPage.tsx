
import { Link } from 'react-router-dom'
import { Plus, UsersRound, ArrowUpRight } from 'lucide-react'

import CircleCard from '../components/CircleCard'
import type { Circle } from '../types'

// Temporary development data.
const demoCircles: Circle[] = [
  {
    id: 'demo-circle-1',
    name: 'Home',
    description: 'Share lights with your family',
    memberCount: 3,
    deviceCount: 2,
    role: 'OWNER',
  },
  {
    id: 'demo-circle-2',
    name: 'Close Friends',
    description: 'A space for your closest people',
    memberCount: 5,
    deviceCount: 1,
    role: 'MEMBER',
  },
]

export default function CirclesPage() {
  const circles = demoCircles

  return (
    <section className="space-y-7">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-violet-300">YOUR PEOPLE</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Circles
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Share moments and devices with people you care about.
          </p>
        </div>

        <Link
          to="/circles/new"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-orange-300 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-orange-200"
        >
          <Plus size={18} />
          <span>Create</span>
        </Link>
      </header>

      <div className="rounded-2xl border border-white/[0.07] bg-[#19191e] p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
            <UsersRound size={22} />
          </div>

          <div>
            <p className="text-sm text-zinc-400">
              Your circles
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {circles.length}
            </p>
          </div>
        </div>
      </div>

      {circles.length > 0 ? (
        <div className="space-y-3">
          <h2 className="font-medium text-zinc-200">
            All circles
          </h2>

          {circles.map((circle) => (
            <CircleCard key={circle.id} circle={circle} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-zinc-700 px-6 py-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
            <UsersRound size={30} />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            Create your first circle
          </h2>

          <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-400">
            Bring people together and share your OneLight devices.
          </p>

          <Link
            to="/circles/new"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-300 px-4 py-3 font-semibold text-zinc-950"
          >
            Create a circle
            <ArrowUpRight size={17} />
          </Link>
        </div>
      )}
    </section>
  )
}
