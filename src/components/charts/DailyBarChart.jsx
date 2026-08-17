import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { formatCurrency } from '../../lib/format'

export default function DailyBarChart({ data }) {
  if (!data.length) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-slate-500">
        No data for this month
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
        <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={(l) => `Day ${l}`} />
        <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
