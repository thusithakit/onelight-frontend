
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'

export default function AddDevicePage() {
  return (
    <section className="mx-auto max-w-lg space-y-6">
      <Link
        to="/devices"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to devices
      </Link>

      <div>
        <p className="text-sm text-orange-300">GET STARTED</p>

        <h1 className="mt-2 text-3xl font-semibold">
          Add a device
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Register your OneLight and connect it to your account.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#19191e] p-5">
        <div className="flex size-12 items-center justify-center rounded-xl bg-orange-300/10 text-orange-300">
          <Plus size={25} />
        </div>

        <h2 className="mt-4 font-semibold">
          Pair your OneLight
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          The registration form and pairing process will be
          connected to the device-service API next.
        </p>
      </div>
    </section>
  )
}
