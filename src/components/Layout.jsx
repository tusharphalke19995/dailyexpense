import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import BudgetAlerts from './BudgetAlerts'
import RecurringReminders from './RecurringReminders'

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <BudgetAlerts />
      <RecurringReminders />
      <main className="mx-auto max-w-lg px-4 pb-24 pt-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
