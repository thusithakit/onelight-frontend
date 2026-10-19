import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Link2, LoaderCircle } from 'lucide-react'
import { usePairDevice } from '../api/devices.queries'

export default function AddDevicePage() {
  const navigate = useNavigate()
  const pairMutation = usePairDevice()

  const [pairingCode, setPairingCode] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const code = pairingCode.trim()
    if (!code) return

    try {
      const pairedDevice = await pairMutation.mutateAsync({
        pairingCode: code,
      })

      navigate(`/devices/${pairedDevice.deviceId}`, { replace: true })
    } catch {
      // The mutation error is rendered below.
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-7">
      <Link
        to="/devices"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to devices
      </Link>

      <header>
        <p className="text-sm font-medium text-amber-400">DEVICE SETUP</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Pair a OneLight
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Enter the pairing code displayed or provided during your device's
          setup process.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-300">
          <Link2 size={23} />
        </div>

        <label
          htmlFor="pairingCode"
          className="mt-6 block text-sm font-medium text-zinc-200"
        >
          Pairing code
        </label>
        <input
          id="pairingCode"
          name="pairingCode"
          value={pairingCode}
          onChange={(event) => setPairingCode(event.target.value)}
          autoComplete="off"
          required
          maxLength={64}
          placeholder="Enter your pairing code"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/10"
        />

        {pairMutation.isError && (
          <p role="alert" className="mt-3 break-words text-sm text-red-400">
            {pairMutation.error instanceof Error
              ? pairMutation.error.message
              : 'Unable to pair this device. Check the code and try again.'}
          </p>
        )}

        <button
          type="submit"
          disabled={!pairingCode.trim() || pairMutation.isPending}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pairMutation.isPending && (
            <LoaderCircle size={18} className="animate-spin" />
          )}
          {pairMutation.isPending ? 'Pairing device…' : 'Pair device'}
        </button>
      </form>
    </div>
  )
}
