import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured, isLocalMode } from '../lib/supabase'

const LOCAL_USER = { id: 'local', email: 'Personal (offline mode)' }

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(isLocalMode ? LOCAL_USER : null)
  const [loading, setLoading] = useState(!isLocalMode)

  useEffect(() => {
    if (isLocalMode) {
      setUser(LOCAL_USER)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    if (isLocalMode) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, isSupabaseConfigured, isLocalMode }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
