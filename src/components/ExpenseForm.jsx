import { useState } from 'react'
import { CATEGORY_GROUPS, PAYMENT_MODES } from '../lib/constants'
import { Button, Input, Select, Textarea } from './ui'

const today = new Date().toISOString().split('T')[0]

export default function ExpenseForm({ initialData, onSubmit, onCancel, submitLabel = 'Save Expense' }) {
  const [form, setForm] = useState({
    date: initialData?.date || today,
    category: initialData?.category || '',
    sub_category: initialData?.sub_category || '',
    amount: initialData?.amount || '',
    note: initialData?.note || '',
    payment_mode: initialData?.payment_mode || 'upi',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.category) {
      setError('Please select a category')
      return
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        ...form,
        amount: Number(form.amount),
        note: form.note || null,
        sub_category: form.sub_category || null,
      })
    } catch (err) {
      setError(err.message || 'Failed to save expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Date"
        type="date"
        value={form.date}
        onChange={(e) => handleChange('date', e.target.value)}
        required
      />

      <Select
        label="Category"
        value={form.category}
        onChange={(e) => handleChange('category', e.target.value)}
        required
      >
        <option value="">Select category...</option>
        {Object.entries(CATEGORY_GROUPS).map(([key, group]) => (
          <optgroup key={key} label={group.label}>
            {group.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>

      <Input
        label="Sub-category (optional)"
        placeholder="e.g. Swiggy, Amazon..."
        value={form.sub_category}
        onChange={(e) => handleChange('sub_category', e.target.value)}
      />

      <Input
        label="Amount (₹)"
        type="number"
        min="1"
        step="1"
        placeholder="0"
        value={form.amount}
        onChange={(e) => handleChange('amount', e.target.value)}
        required
      />

      <Textarea
        label="Note / Description (optional)"
        placeholder="Add a note..."
        value={form.note}
        onChange={(e) => handleChange('note', e.target.value)}
      />

      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Payment Mode
        </span>
        <div className="flex gap-2">
          {PAYMENT_MODES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleChange('payment_mode', value)}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                form.payment_mode === value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
