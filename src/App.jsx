import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AddExpense from './pages/AddExpense'
import ExpenseList from './pages/ExpenseList'
import MonthlySummary from './pages/MonthlySummary'
import FamilyTracker from './pages/FamilyTracker'
import Settings from './pages/Settings'
import { isSupabaseConfigured } from './lib/supabase'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddExpense />} />
        <Route path="/list" element={<ExpenseList />} />
        <Route path="/summary" element={<MonthlySummary />} />
        <Route path="/family" element={<FamilyTracker />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={isSupabaseConfigured ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  )
}
