import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { CHART_COLORS } from '../../lib/constants'
import { formatCurrency } from '../../lib/format'

export default function CategoryPieChart({ data }) {
  if (!data.length) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-slate-500">
        No data for this month
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend
          wrapperStyle={{ fontSize: '11px' }}
          formatter={(value) => (value.length > 15 ? value.slice(0, 15) + '…' : value)}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
