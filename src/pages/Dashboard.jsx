import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp } from 'lucide-react'
import { useExpenses } from '../hooks/useExpenses'
import { useSettings } from '../contexts/SettingsContext'
import { formatCurrency, getMonthRange, getCategoryLabel } from '../lib/format'
import CategoryPieChart from '../components/charts/CategoryPieChart'
import DailyBarChart from '../components/charts/DailyBarChart'
import { Card, PageHeader, Button } from '../components/ui'

export default function Dashboard() {
  const { expenses, loading } = useExpenses()
  const { settings } = useSettings()
  const { start, end, label } = getMonthRange()

  const monthData = useMemo(() => {
    const filtered = expenses.filter((e) => e.date >= start && e.date <= end)
    const total = filtered.reduce((s, e) => s + Number(e.amount), 0)

    const categoryMap = filtered.reduce((acc, e) => {
      const name = getCategoryLabel(e.category)
      acc[name] = (acc[name] || 0) + Number(e.amount)
      return acc
    }, {})

    const pieData = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const dayMap = filtered.reduce((acc, e) => {
      const day = new Date(e.date + 'T00:00:00').getDate()
      acc[day] = (acc[day] || 0) + Number(e.amount)
      return acc
    }, {})

    const barData = Object.entries(dayMap)
      .map(([day, amount]) => ({ day: Number(day), amount }))
      .sort((a, b) => a.day - b.day)

    const budgetPercent = settings.monthlyBudget
      ? Math.min(100, Math.round((total / settings.monthlyBudget) * 100))
      : 0

    return { total, pieData, barData, budgetPercent, count: filtered.length }
  }, [expenses, start, end, settings.monthlyBudget])

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={label}
        action={
          <Link to="/add">
            <Button size="sm">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </Link>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-indigo-200">Total Spent This Month</p>
                <p className="mt-1 text-3xl font-bold">{formatCurrency(monthData.total)}</p>
                <p className="mt-1 text-sm text-indigo-200">{monthData.count} transactions</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-200" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-indigo-200">
                <span>Budget: {formatCurrency(settings.monthlyBudget)}</span>
                <span>{monthData.budgetPercent}% used</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-indigo-500/40">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${monthData.budgetPercent}%` }}
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-2 font-semibold">Category Breakdown</h2>
            <CategoryPieChart data={monthData.pieData} />
          </Card>

          <Card>
            <h2 className="mb-2 font-semibold">Daily Spending</h2>
            <DailyBarChart data={monthData.barData} />
          </Card>

          <Link to="/add" className="block">
            <Button className="w-full" size="lg">
              <Plus className="h-5 w-5" /> Quick Add Expense
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
