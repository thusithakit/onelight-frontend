import { useEffect, useState, type FormEvent } from 'react'
import { Check, LoaderCircle, Save, UserRound } from 'lucide-react'

import { useMyProfile, useUpdateMyProfile } from '../api/profile.queries'

export default function ProfileSettingsForm() {
  const profileQuery = useMyProfile()
  const updateProfile = useUpdateMyProfile()
  const profile = profileQuery.data

  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  )
  const [error, setError] = useState('')

  useEffect(() => {
    if (!profile) return

    setName(profile.name)
    setAvatarUrl(profile.avatarUrl ?? '')
    setTimezone(profile.timezone || 'UTC')
  }, [profile])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const trimmedName = name.trim()
    const trimmedAvatarUrl = avatarUrl.trim()
    const trimmedTimezone = timezone.trim()

    if (!trimmedName) {
      setError('Please enter your name.')
      return
    }

    if (!trimmedTimezone) {
      setError('Please enter a timezone.')
      return
    }

    if (trimmedAvatarUrl) {
      try {
        const parsedUrl = new URL(trimmedAvatarUrl)

        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          setError('Avatar URL must use HTTP or HTTPS.')
          return
        }
      } catch {
        setError('Please enter a valid avatar URL.')
        return
      }
    }

    try {
      await updateProfile.mutateAsync({
        name: trimmedName,
        avatarUrl: trimmedAvatarUrl || null,
        timezone: trimmedTimezone,
      })
    } catch {
      setError('Could not save your profile. Please try again.')
    }
  }

  if (profileQuery.isLoading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-zinc-400">
        <LoaderCircle size={18} className="animate-spin" />
        Loading profile…
      </div>
    )
  }

  if (profileQuery.isError || !profile) {
    return (
      <div className="rounded-xl border border-white/10 p-4">
        <p className="text-sm text-red-300">
          Could not load your profile.
        </p>
        <button
          type="button"
          onClick={() => void profileQuery.refetch()}
          className="mt-2 text-sm text-amber-300 underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Profile settings
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your name, profile picture and timezone.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-white/10 bg-zinc-900/60 p-4 sm:p-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-800">
            {avatarUrl.trim() ? (
              <img
                src={avatarUrl.trim()}
                alt="Profile preview"
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <UserRound size={27} className="text-zinc-400" />
            )}
          </div>

          <div className="min-w-0">
            <p className="font-medium text-white">
              {name.trim() || 'Your name'}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Preview of your profile
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="profile-name"
            className="block text-sm font-medium text-zinc-300"
          >
            Name
          </label>
          <input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            autoComplete="name"
            required
            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-white outline-none focus:border-amber-400/60"
            placeholder="Your name"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="profile-avatar"
            className="block text-sm font-medium text-zinc-300"
          >
            Avatar URL
          </label>
          <input
            id="profile-avatar"
            type="url"
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-white outline-none focus:border-amber-400/60"
            placeholder="https://example.com/avatar.jpg"
          />
          <p className="text-xs text-zinc-500">
            Leave empty to remove your avatar.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="profile-timezone"
            className="block text-sm font-medium text-zinc-300"
          >
            Timezone
          </label>
          <input
            id="profile-timezone"
            value={timezone}
            onChange={(event) => setTimezone(event.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-white outline-none focus:border-amber-400/60"
            placeholder="Asia/Colombo"
          />
          <p className="text-xs text-zinc-500">
            Use an IANA timezone, for example Asia/Colombo or Asia/Tokyo.
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-300">
            {error}
          </p>
        )}

        {updateProfile.isSuccess && !error && (
          <p role="status" className="flex items-center gap-2 text-sm text-emerald-300">
            <Check size={16} />
            Profile updated successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {updateProfile.isPending ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Save size={17} />
          )}
          {updateProfile.isPending ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </section>
  )
}
