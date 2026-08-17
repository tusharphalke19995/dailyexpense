import { createContext, useContext, useEffect, useState } from 'react'
import { ALL_CATEGORIES } from '../lib/constants'

const STORAGE_KEY = 'expense_tracker_settings'

const defaultSettings = {
  monthlyBudget: 50000,
  categoryBudgets: Object.fromEntries(
    ALL_CATEGORIES.map((c) => [c.id, 5000]),
  ),
  recurringReminders: {
    rent: true,
    electricity: true,
    wifi: true,
    mobile_recharge: false,
  },
}

const SettingsContext = createContext(null)

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...defaultSettings, ...JSON.parse(saved) }
  } catch {
    /* ignore */
  }
  return defaultSettings
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }

  const updateCategoryBudget = (categoryId, amount) => {
    setSettings((prev) => ({
      ...prev,
      categoryBudgets: { ...prev.categoryBudgets, [categoryId]: Number(amount) },
    }))
  }

  const toggleRecurringReminder = (billId) => {
    setSettings((prev) => ({
      ...prev,
      recurringReminders: {
        ...prev.recurringReminders,
        [billId]: !prev.recurringReminders[billId],
      },
    }))
  }

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, updateCategoryBudget, toggleRecurringReminder }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
