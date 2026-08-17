import { useMemo } from 'react'
import { Bell } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { RECURRING_BILL_OPTIONS } from '../lib/constants'
import { useExpenses } from '../hooks/useExpenses'
import { getMonthRange } from '../lib/format'

export default function RecurringReminders() {
  const { settings } = useSettings()
  const { expenses } = useExpenses()

  const reminders = useMemo(() => {
    const today = new Date()
    const day = today.getDate()
    const { start, end } = getMonthRange()
    const monthExpenses = expenses.filter((e) => e.date >= start && e.date <= end)
    const paidCategories = new Set(monthExpenses.map((e) => e.category))

    return RECURRING_BILL_OPTIONS.filter((bill) => {
      if (!settings.recurringReminders[bill.id]) return false
      if (paidCategories.has(bill.id)) return false
      return day >= bill.day
    })
  }, [settings, expenses])

  if (!reminders.length) return null

  return (
    <div className="mx-4 mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-950/30">
      <div className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-200">
        <Bell className="h-4 w-4" />
        Bill Reminders
      </div>
      <ul className="mt-1 space-y-0.5 text-sm text-amber-700 dark:text-amber-300">
        {reminders.map((bill) => (
          <li key={bill.id}>• {bill.name} — due this month (day {bill.day})</li>
        ))}
      </ul>
    </div>
  )
}
