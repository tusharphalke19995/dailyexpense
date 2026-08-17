import { useCallback, useEffect, useState } from 'react'
import { supabase, isLocalMode } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import * as localStore from '../lib/localStore'

export function useExpenses() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchExpenses = useCallback(async () => {
    if (isLocalMode) {
      setExpenses(localStore.loadExpenses())
      setLoading(false)
      return
    }

    if (!user || !supabase) {
      setExpenses([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setExpenses(data || [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const addExpense = async (expense) => {
    if (isLocalMode) {
      const data = localStore.createExpense(expense)
      setExpenses((prev) => [data, ...prev])
      return data
    }

    const { data, error: insertError } = await supabase
      .from('expenses')
      .insert({ ...expense, user_id: user.id })
      .select()
      .single()

    if (insertError) throw insertError
    setExpenses((prev) => [data, ...prev])
    return data
  }

  const updateExpense = async (id, updates) => {
    if (isLocalMode) {
      const data = localStore.updateExpense(id, updates)
      setExpenses((prev) => prev.map((e) => (e.id === id ? data : e)))
      return data
    }

    const { data, error: updateError } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) throw updateError
    setExpenses((prev) => prev.map((e) => (e.id === id ? data : e)))
    return data
  }

  const deleteExpense = async (id) => {
    if (isLocalMode) {
      localStore.deleteExpense(id)
      setExpenses((prev) => prev.filter((e) => e.id !== id))
      return
    }

    const { error: deleteError } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) throw deleteError
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  }
}
