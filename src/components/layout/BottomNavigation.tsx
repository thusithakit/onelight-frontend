
import { NavLink } from 'react-router-dom'
import {
  Lightbulb,
  UsersRound,
  Mail,
  UserRound,
} from 'lucide-react'

const navigationItems = [
  {
    label: 'Devices',
    to: '/devices',
    Icon: Lightbulb,
  },
  {
    label: 'Circles',
    to: '/circles',
    Icon: UsersRound,
  },
  {
    label: 'Invitations',
    to: '/invitations',
    Icon: Mail,
  },
  {
    label: 'Profile',
    to: '/profile',
    Icon: UserRound,
  },
]

export default function BottomNavigation() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-[#17171b]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:sticky md:bottom-auto md:border-t-0 md:bg-transparent md:backdrop-blur-none"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-4 px-2 pt-2 md:flex md:justify-start md:gap-2 md:px-5">
        {navigationItems.map(({ label, to, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs transition-colors md:min-h-10 md:flex-row md:gap-2 md:px-4 md:text-sm',
                isActive
                  ? 'text-orange-300 md:bg-white/[0.07]'
                  : 'text-zinc-500 hover:text-zinc-200',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.3 : 1.8}
                  aria-hidden="true"
                />

                <span className="font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
