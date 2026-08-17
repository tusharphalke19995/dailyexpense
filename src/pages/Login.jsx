import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Wallet } from 'lucide-react'
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
          <p className="mt-1 text-sm text-slate-400">
            {isRegister ? 'Create your account' : 'Sign in to track your expenses'}
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-4 space-y-2 rounded-xl border border-amber-600/50 bg-amber-950/30 p-4 text-sm text-amber-200">
            <p className="font-semibold">Supabase setup required</p>
            <ol className="list-decimal space-y-1 pl-4 text-amber-100/90">
              <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline">supabase.com</a></li>
              <li>Open <strong>Project Settings → API</strong></li>
              <li>Copy <strong>Project URL</strong> and <strong>anon public</strong> key</li>
              <li>Paste them into <code className="rounded bg-amber-900/50 px-1">.env</code> in the project root</li>
              <li>Run <code className="rounded bg-amber-900/50 px-1">supabase/schema.sql</code> in Supabase SQL Editor</li>
              <li>Restart the dev server (<code className="rounded bg-amber-900/50 px-1">npm run dev</code>)</li>
            </ol>
          </div>
        )}

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

          <Button type="submit" className="w-full" disabled={loading || !isSupabaseConfigured}>
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
      </Card>
    </div>
  )
}
