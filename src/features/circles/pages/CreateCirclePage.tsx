
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, UsersRound } from 'lucide-react'

export default function CreateCirclePage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter a circle name.')
      return
    }

    // TODO: Replace with the create-circle API mutation.
    // Mock mode: return to the circles list.
    navigate('/circles')
  }

  return (
    <section className="mx-auto max-w-lg space-y-6">
      <Link
        to="/circles"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to circles
      </Link>

      <header>
        <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
          <UsersRound size={25} />
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight">
          Create a circle
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Create a shared space for people and their OneLight devices.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-white/[0.07] bg-[#19191e] p-5"
      >
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-300">
            Circle name
          </span>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={60}
            required
            placeholder="e.g. Home"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-orange-300"
          />

          <span className="block text-right text-xs text-zinc-500">
            {name.length}/60
          </span>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-300">
            Description <span className="text-zinc-500">(optional)</span>
          </span>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={200}
            rows={3}
            placeholder="What is this circle for?"
            className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-orange-300"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-orange-300 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-orange-200"
        >
          Create circle
        </button>
      </form>
    </section>
  )
}
