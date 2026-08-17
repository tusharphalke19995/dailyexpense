import { useMemo } from 'react'
import { useExpenses } from '../hooks/useExpenses'
import { useSettings } from '../contexts/SettingsContext'
import { getMonthRange } from '../lib/format'
import { CATEGORY_MAP } from '../lib/constants'
import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

export default function BudgetAlerts() {
  const { expenses } = useExpenses()
  const { settings } = useSettings()
  const [dismissed, setDismissed] = useState([])

  const alerts = useMemo(() => {
    const { start, end } = getMonthRange()
    const monthExpenses = expenses.filter((e) => e.date >= start && e.date <= end)
    const total = monthExpenses.reduce((s, e) => s + Number(e.amount), 0)
    const result = []

    if (total > settings.monthlyBudget) {
      result.push({
        id: 'monthly',
        message: `Monthly budget exceeded! Spent ₹${total.toLocaleString('en-IN')} of ₹${settings.monthlyBudget.toLocaleString('en-IN')} goal.`,
      })
    }

    const categoryTotals = monthExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
      return acc
    }, {})

    Object.entries(categoryTotals).forEach(([catId, spent]) => {
      const limit = settings.categoryBudgets[catId]
      if (limit && spent > limit) {
        const name = CATEGORY_MAP[catId]?.name || catId
        result.push({
          id: catId,
          message: `${name} budget exceeded! ₹${spent.toLocaleString('en-IN')} of ₹${limit.toLocaleString('en-IN')} limit.`,
        })
      }
    })

    return result.filter((a) => !dismissed.includes(a.id))
  }, [expenses, settings, dismissed])

  if (!alerts.length) return null

  return (
    <div className="sticky top-0 z-40 space-y-2 px-4 pt-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="flex-1">{alert.message}</span>
          <button
            onClick={() => setDismissed((d) => [...d, alert.id])}
            className="shrink-0 rounded p-0.5 hover:bg-red-100 dark:hover:bg-red-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
