import { Moon, Sun, LogOut, Bell, Target, HardDrive, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useSettings } from '../contexts/SettingsContext'
import { useExpenses } from '../hooks/useExpenses'
import { useFamilyTransactions } from '../hooks/useFamilyTransactions'
import { ALL_CATEGORIES, RECURRING_BILL_OPTIONS } from '../lib/constants'
import { Card, PageHeader, Button, Input } from '../components/ui'

export default function Settings() {
  const { user, signOut, isLocalMode } = useAuth()
  const { expenses } = useExpenses()
  const { transactions } = useFamilyTransactions()
  const { theme, toggleTheme } = useTheme()
  const { settings, updateSettings, updateCategoryBudget, toggleRecurringReminder } = useSettings()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      expenses,
      familyTransactions: transactions,
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `dailyexpense-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Profile & preferences" />

      <div className="space-y-4">
        <Card>
          <h2 className="mb-3 font-semibold">Profile</h2>
          {isLocalMode ? (
            <>
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <HardDrive className="h-4 w-4" />
                Offline mode — data saved on this device
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Free, private, no account. Clear browser data will delete expenses.
              </p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={handleBackup}>
                <Download className="h-4 w-4" /> Backup Data (JSON)
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
              <p className="font-medium">{user?.email}</p>
              <Button variant="danger" size="sm" className="mt-3" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-slate-500">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={toggleTheme}>
              Toggle
            </Button>
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-500" />
            <h2 className="font-semibold">Monthly Budget Goal</h2>
          </div>
          <Input
            label="Monthly budget (₹)"
            type="number"
            min="0"
            value={settings.monthlyBudget}
            onChange={(e) => updateSettings({ monthlyBudget: Number(e.target.value) })}
          />
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold">Category Budget Limits</h2>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {ALL_CATEGORIES.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <span className="flex-1 truncate text-sm">{cat.name}</span>
                <input
                  type="number"
                  min="0"
                  value={settings.categoryBudgets[cat.id] || 0}
                  onChange={(e) => updateCategoryBudget(cat.id, e.target.value)}
                  className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-500" />
            <h2 className="font-semibold">Recurring Bill Reminders</h2>
          </div>
          <div className="space-y-2">
            {RECURRING_BILL_OPTIONS.map((bill) => (
              <label key={bill.id} className="flex items-center justify-between">
                <span className="text-sm">
                  {bill.name} <span className="text-slate-400">(day {bill.day})</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.recurringReminders[bill.id] || false}
                  onChange={() => toggleRecurringReminder(bill.id)}
                  className="h-4 w-4 rounded accent-indigo-600"
                />
              </label>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
