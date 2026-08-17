import { Pencil, Trash2 } from 'lucide-react'
import { CATEGORY_MAP } from '../lib/constants'
import { formatCurrency, formatDate, getCategoryLabel, getPaymentLabel } from '../lib/format'
import { Card } from './ui'

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const category = CATEGORY_MAP[expense.category]
  const Icon = category?.icon

  return (
    <Card className="flex items-start gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${category?.color || '#6366f1'}20` }}
      >
        {Icon && <Icon className="h-5 w-5" style={{ color: category?.color || '#6366f1' }} />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium leading-tight">
              {getCategoryLabel(expense.category)}
              {expense.sub_category && (
                <span className="text-slate-500 dark:text-slate-400"> · {expense.sub_category}</span>
              )}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {formatDate(expense.date)} · {getPaymentLabel(expense.payment_mode)}
            </p>
            {expense.note && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{expense.note}</p>
            )}
          </div>
          <p className="shrink-0 font-semibold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(expense.amount)}
          </p>
        </div>

        {(onEdit || onDelete) && (
          <div className="mt-2 flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(expense)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(expense)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
