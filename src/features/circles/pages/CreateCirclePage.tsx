import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, LoaderCircle, UsersRound } from 'lucide-react'
import { useCreateCircle } from '../api/circles.queries'

export default function CreateCirclePage() {
  const navigate = useNavigate()
  const createCircleMutation = useCreateCircle()
  const [name, setName] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) return

    try {
      const circle = await createCircleMutation.mutateAsync({
        name: trimmedName,
      })

      navigate(`/circles/${circle.id}`, { replace: true })
    } catch {
      // Display the mutation error in the form.
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-7">
      <Link
        to="/circles"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to circles
      </Link>

      <header>
        <p className="text-sm font-medium text-amber-400">NEW CIRCLE</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Bring people together
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Create a circle to share your OneLight experience with others.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-300">
          <UsersRound size={23} />
        </div>

        <label htmlFor="circle-name" className="mt-6 block text-sm font-medium">
          Circle name
        </label>
        <input
          id="circle-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          minLength={2}
          maxLength={80}
          placeholder="e.g. Family, Close Friends"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/10"
        />

        {createCircleMutation.isError && (
          <p role="alert" className="mt-3 break-words text-sm text-red-400">
            {createCircleMutation.error instanceof Error
              ? createCircleMutation.error.message
              : 'Could not create the circle. Please try again.'}
          </p>
        )}

        <button
          type="submit"
          disabled={!name.trim() || createCircleMutation.isPending}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createCircleMutation.isPending && (
            <LoaderCircle size={18} className="animate-spin" />
          )}
          {createCircleMutation.isPending ? 'Creating…' : 'Create circle'}
        </button>
      </form>
    </div>
  )
}
