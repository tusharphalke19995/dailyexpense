import { useNavigate } from 'react-router-dom'
import { useExpenses } from '../hooks/useExpenses'
import ExpenseForm from '../components/ExpenseForm'
import { Card, PageHeader } from '../components/ui'

export default function AddExpense() {
  const navigate = useNavigate()
  const { addExpense } = useExpenses()

  const handleSubmit = async (data) => {
    await addExpense(data)
    navigate('/dashboard')
  }

  return (
    <div>
      <PageHeader title="Add Expense" subtitle="Record a new expense" />
      <Card>
        <ExpenseForm onSubmit={handleSubmit} />
      </Card>
    </div>
  )
}
