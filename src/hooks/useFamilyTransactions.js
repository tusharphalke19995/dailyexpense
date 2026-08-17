import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useFamilyTransactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransactions = useCallback(async () => {
    if (!user || !supabase) {
      setTransactions([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('family_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setTransactions(data || [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const addTransaction = async (transaction) => {
    const { data, error: insertError } = await supabase
      .from('family_transactions')
      .insert({ ...transaction, user_id: user.id })
      .select()
      .single()

    if (insertError) throw insertError
    setTransactions((prev) => [data, ...prev])
    return data
  }

  const updateTransaction = async (id, updates) => {
    const { data, error: updateError } = await supabase
      .from('family_transactions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) throw updateError
    setTransactions((prev) => prev.map((t) => (t.id === id ? data : t)))
    return data
  }

  const deleteTransaction = async (id) => {
    const { error: deleteError } = await supabase
      .from('family_transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) throw deleteError
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const totals = transactions.reduce(
    (acc, t) => {
      acc[t.person] = (acc[t.person] || 0) + Number(t.amount)
      acc.total += Number(t.amount)
      return acc
    },
    { mom: 0, dad: 0, other: 0, total: 0 },
  )

  return {
    transactions,
    loading,
    error,
    totals,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
