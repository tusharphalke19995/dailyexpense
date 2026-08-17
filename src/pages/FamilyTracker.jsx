import { useState } from 'react'
import { Heart, Plus, Pencil, Trash2 } from 'lucide-react'
import { useFamilyTransactions } from '../hooks/useFamilyTransactions'
import { FAMILY_PERSONS } from '../lib/constants'
import { formatCurrency, formatDate } from '../lib/format'
import { Card, PageHeader, Button, Input, Select, Textarea, EmptyState } from '../components/ui'

const today = new Date().toISOString().split('T')[0]

export default function FamilyTracker() {
  const {
    transactions,
    loading,
    totals,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFamilyTransactions()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ person: 'mom', amount: '', date: today, note: '' })
  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    setForm({ person: 'mom', amount: '', date: today, note: '' })
    setEditing(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) return

    setSaving(true)
    try {
      const data = {
        person: form.person,
        amount: Number(form.amount),
        date: form.date,
        note: form.note || null,
      }
      if (editing) {
        await updateTransaction(editing.id, data)
      } else {
        await addTransaction(data)
      }
      resetForm()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (t) => {
    setEditing(t)
    setForm({ person: t.person, amount: t.amount, date: t.date, note: t.note || '' })
    setShowForm(true)
  }

  const handleDelete = async (t) => {
    if (window.confirm('Delete this transaction?')) {
      await deleteTransaction(t.id)
    }
  }

  const personLabel = (p) => FAMILY_PERSONS.find((x) => x.value === p)?.label || p

  return (
    <div>
      <PageHeader
        title="Family Money"
        subtitle="Track money given to family"
        action={
          <Button size="sm" onClick={() => { resetForm(); setShowForm(true) }}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          { label: 'Mom', value: totals.mom, color: '#ec4899' },
          { label: 'Dad', value: totals.dad, color: '#6366f1' },
          { label: 'Total', value: totals.total, color: '#22c55e' },
        ].map(({ label, value, color }) => (
          <Card key={label} className="text-center !p-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-0.5 text-lg font-bold" style={{ color }}>
              {formatCurrency(value)}
            </p>
          </Card>
        ))}
      </div>

      {showForm && (
        <Card className="mb-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Select
              label="Person"
              value={form.person}
              onChange={(e) => setForm({ ...form, person: e.target.value })}
            >
              {FAMILY_PERSONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
            <Input
              label="Amount (₹)"
              type="number"
              min="1"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
            <Textarea
              label="Note (optional)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Save'}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : transactions.length === 0 ? (
        <EmptyState icon={Heart} title="No family transactions" description="Start tracking money given to family." />
      ) : (
        <div className="space-y-3">
          {transactions.map((t) => (
            <Card key={t.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{personLabel(t.person)}</p>
                <p className="text-xs text-slate-500">{formatDate(t.date)}</p>
                {t.note && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.note}</p>}
              </div>
              <div className="text-right">
                <p className="font-semibold text-pink-600 dark:text-pink-400">
                  {formatCurrency(t.amount)}
                </p>
                <div className="mt-1 flex gap-1 justify-end">
                  <button onClick={() => startEdit(t)} className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(t)} className="rounded p-1 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
