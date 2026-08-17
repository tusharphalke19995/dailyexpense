import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  List,
  BarChart3,
  Users,
  Settings,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/add', icon: PlusCircle, label: 'Add' },
  { to: '/list', icon: List, label: 'List' },
  { to: '/summary', icon: BarChart3, label: 'Summary' },
  { to: '/family', icon: Users, label: 'Family' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
