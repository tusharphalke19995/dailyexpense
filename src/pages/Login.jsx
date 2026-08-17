import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Wallet, Smartphone } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button, Card, Input } from '../components/ui'

export default function Login() {
  const { user, signIn, signUp, isSupabaseConfigured } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (isRegister) {
        await signUp(email, password)
        setMessage('Account created! Check your email to confirm, then sign in.')
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900/80 backdrop-blur">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">
            <Wallet className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Daily Expense Tracker</h1>
          <p className="mt-1 text-sm text-slate-400">Track your daily expenses in ₹</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-4 space-y-3 rounded-xl border border-green-600/40 bg-green-950/30 p-4 text-sm text-green-100">
            <p className="font-semibold">100% free — no account needed</p>
            <p className="text-green-200/90">
              Your data is saved on this device. No signup, no cloud, no cost.
            </p>
            <Link to="/dashboard">
              <Button className="w-full" variant="primary">
                <Smartphone className="h-4 w-4" /> Start Tracking (Offline)
              </Button>
            </Link>
          </div>
        )}

        {isSupabaseConfigured && (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="dark:bg-slate-800"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
                className="dark:bg-slate-800"
              />

              {error && (
                <p className="rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-400">{error}</p>
              )}
              {message && (
                <p className="rounded-lg bg-green-950/50 px-3 py-2 text-sm text-green-400">{message}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : isRegister ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-400">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setError(''); setMessage('') }}
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                {isRegister ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </>
        )}

        {!isSupabaseConfigured && (
          <p className="mt-3 text-center text-xs text-slate-500">
            Optional: add Supabase to <code className="text-slate-400">.env</code> for cloud sync across devices
          </p>
        )}
      </Card>
    </div>
  )
}
