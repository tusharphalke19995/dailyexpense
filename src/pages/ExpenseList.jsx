import { useMemo, useState } from 'react'
import { Receipt } from 'lucide-react'
import { useExpenses } from '../hooks/useExpenses'
import { CATEGORY_GROUPS, PAYMENT_MODES } from '../lib/constants'
import ExpenseCard from '../components/ExpenseCard'
import ExpenseForm from '../components/ExpenseForm'
import { Card, PageHeader, Input, Select, EmptyState } from '../components/ui'

export default function ExpenseList() {
  const { expenses, loading, updateExpense, deleteExpense } = useExpenses()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortBy, setSortBy] = useState('date-desc')
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    let result = [...expenses]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          e.note?.toLowerCase().includes(q) ||
          e.sub_category?.toLowerCase().includes(q),
      )
    }
    if (categoryFilter) result = result.filter((e) => e.category === categoryFilter)
    if (paymentFilter) result = result.filter((e) => e.payment_mode === paymentFilter)
    if (dateFrom) result = result.filter((e) => e.date >= dateFrom)
    if (dateTo) result = result.filter((e) => e.date <= dateTo)

    result.sort((a, b) => {
      if (sortBy === 'date-desc') return b.date.localeCompare(a.date)
      if (sortBy === 'date-asc') return a.date.localeCompare(b.date)
      if (sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount)
      if (sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount)
      return 0
    })

    return result
  }, [expenses, search, categoryFilter, paymentFilter, dateFrom, dateTo, sortBy])

  const handleDelete = async (expense) => {
    if (window.confirm('Delete this expense?')) {
      await deleteExpense(expense.id)
    }
  }

  const handleUpdate = async (data) => {
    await updateExpense(editing.id, data)
    setEditing(null)
  }

  if (editing) {
    return (
      <div>
        <PageHeader title="Edit Expense" subtitle="Update expense details" />
        <Card>
          <ExpenseForm
            initialData={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            submitLabel="Update Expense"
          />
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Expenses" subtitle={`${filtered.length} records`} />

      <div className="mb-4 space-y-3">
        <Input
          placeholder="Search by description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2">
          <Input type="date" label="From" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input type="date" label="To" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Select label="Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {Object.entries(CATEGORY_GROUPS).map(([key, group]) => (
              <optgroup key={key} label={group.label}>
                {group.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </optgroup>
            ))}
          </Select>

          <Select label="Payment" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
            <option value="">All Modes</option>
            {PAYMENT_MODES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </div>

        <Select label="Sort By" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date-desc">Date (Newest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="amount-desc">Amount (High to Low)</option>
          <option value="amount-asc">Amount (Low to High)</option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Receipt} title="No expenses found" description="Try adjusting your filters or add a new expense." />
      ) : (
        <div className="space-y-3">
          {filtered.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
