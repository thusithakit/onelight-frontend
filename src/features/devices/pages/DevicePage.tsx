import { Link } from 'react-router-dom'
import { Plus, Lightbulb, Wifi, WifiOff, LoaderCircle, RefreshCw } from 'lucide-react'
import DeviceCard from '../components/DeviceCard'
import { useDevices } from '../api/devices.queries'

export default function DevicesPage() {
  const {
    data: devices = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useDevices()

  const onlineCount = devices.filter(
    (device) => device.status === 'ONLINE',
  ).length

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-amber-400">YOUR SPACE</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            My devices
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Manage your lights and stay connected.
          </p>
        </div>

        <Link
          to="/devices/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200"
        >
          <Plus size={17} />
          <span className="hidden sm:inline">Add device</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Lightbulb size={17} className="text-amber-300" />
            Total devices
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums">
            {isLoading ? '—' : devices.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            {onlineCount > 0 ? (
              <Wifi size={17} className="text-emerald-400" />
            ) : (
              <WifiOff size={17} />
            )}
            Online
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums">
            {isLoading ? '—' : onlineCount}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-3 py-16 text-sm text-zinc-400">
          <LoaderCircle className="animate-spin" size={20} />
          Loading your devices…
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5">
          <p className="font-medium text-red-300">
            Couldn't load your devices.
          </p>
          <p className="mt-2 break-words text-sm text-zinc-400">
            {error instanceof Error ? error.message : 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && devices.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-300">
            <Lightbulb size={27} />
          </div>
          <h2 className="mt-5 text-lg font-semibold">Your space starts here</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-400">
            Pair your first OneLight device to control its light and send
            messages to its display.
          </p>
          <Link
            to="/devices/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-200"
          >
            <Plus size={17} />
            Pair a device
          </Link>
        </div>
      )}

      {!isLoading && !isError && devices.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">All devices</h2>
            {isFetching && (
              <span className="text-xs text-zinc-500">Updating…</span>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
