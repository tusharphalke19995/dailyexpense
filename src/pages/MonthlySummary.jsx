import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { useExpenses } from '../hooks/useExpenses'
import {
  formatCurrency,
  getCategoryLabel,
  getPaymentLabel,
  exportToCSV,
} from '../lib/format'
import CategoryPieChart from '../components/charts/CategoryPieChart'
import DailyBarChart from '../components/charts/DailyBarChart'
import { Card, PageHeader, Button } from '../components/ui'

export default function MonthlySummary() {
  const { expenses, loading } = useExpenses()
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const monthData = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number)
    const start = new Date(year, month - 1, 1).toISOString().split('T')[0]
    const end = new Date(year, month, 0).toISOString().split('T')[0]
    const label = new Date(year, month - 1).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    })

    const filtered = expenses.filter((e) => e.date >= start && e.date <= end)
    const total = filtered.reduce((s, e) => s + Number(e.amount), 0)

    const categoryBreakdown = filtered.reduce((acc, e) => {
      const name = getCategoryLabel(e.category)
      if (!acc[name]) acc[name] = { name, amount: 0, count: 0 }
      acc[name].amount += Number(e.amount)
      acc[name].count += 1
      return acc
    }, {})

    const pieData = Object.values(categoryBreakdown)
      .map(({ name, amount }) => ({ name, value: amount }))
      .sort((a, b) => b.value - a.value)

    const dayMap = filtered.reduce((acc, e) => {
      const day = new Date(e.date + 'T00:00:00').getDate()
      acc[day] = (acc[day] || 0) + Number(e.amount)
      return acc
    }, {})

    const dayBreakdown = Object.entries(dayMap)
      .map(([day, amount]) => ({ day: Number(day), amount, label: `Day ${day}` }))
      .sort((a, b) => a.day - b.day)

    const barData = dayBreakdown.map(({ day, amount }) => ({ day, amount }))

    return { filtered, total, label, start, end, categoryBreakdown, pieData, dayBreakdown, barData }
  }, [expenses, selectedMonth])

  const handleExport = () => {
    const csvData = monthData.filtered.map((e) => ({
      Date: e.date,
      Category: getCategoryLabel(e.category),
      'Sub Category': e.sub_category || '',
      Amount: e.amount,
      'Payment Mode': getPaymentLabel(e.payment_mode),
      Note: e.note || '',
    }))
    exportToCSV(csvData, `expenses-${selectedMonth}.csv`)
  }

  return (
    <div>
      <PageHeader
        title="Monthly Summary"
        subtitle={monthData.label}
        action={
          <Button size="sm" variant="secondary" onClick={handleExport} disabled={!monthData.filtered.length}>
            <Download className="h-4 w-4" /> CSV
          </Button>
        }
      />

      <div className="mb-4">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Spent</p>
            <p className="mt-1 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(monthData.total)}
            </p>
            <p className="mt-1 text-sm text-slate-500">{monthData.filtered.length} transactions</p>
          </Card>

          <Card>
            <h2 className="mb-2 font-semibold">Category Breakdown</h2>
            <CategoryPieChart data={monthData.pieData} />
            <div className="mt-3 space-y-2">
              {Object.values(monthData.categoryBreakdown)
                .sort((a, b) => b.amount - a.amount)
                .map(({ name, amount, count }) => (
                  <div key={name} className="flex items-center justify-between text-sm">
                    <span>{name} <span className="text-slate-400">({count})</span></span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-2 font-semibold">Day-wise Breakdown</h2>
            <DailyBarChart data={monthData.barData} />
            <div className="mt-3 max-h-48 space-y-1 overflow-y-auto">
              {monthData.dayBreakdown.map(({ day, amount }) => (
                <div key={day} className="flex justify-between text-sm">
                  <span>Day {day}</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
