import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading, isSupabaseConfigured } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className="max-w-md rounded-2xl border border-amber-300 bg-amber-50 p-6 dark:border-amber-700 dark:bg-amber-950/30">
          <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
            Supabase Not Configured
          </h2>
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
            Add your Supabase credentials to <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">.env</code>, then restart the dev server.
          </p>
          <a
            href="/login"
            className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View setup instructions →
          </a>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}
