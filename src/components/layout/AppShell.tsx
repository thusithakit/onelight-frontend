
import { Link, Outlet } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'
import OneLightLogo from '../../../public/one-light.svg'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#111114] text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#111114]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link
            to="/devices"
            className="flex items-center gap-3"
            aria-label="OneLight home"
          >
            <img src={OneLightLogo} width={30} height={30}/>

            <span className="text-lg font-semibold tracking-tight">
              OneLight
            </span>
          </Link>

          <span className="hidden text-sm text-zinc-500 sm:block">
            Your light, your moments.
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-28 pt-7 md:pb-10 md:pt-10">
        <Outlet />
      </main>

      <BottomNavigation />
    </div>
  )
}
