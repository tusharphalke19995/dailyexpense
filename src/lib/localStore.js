const EXPENSES_KEY = 'dailyexpense_expenses'
const FAMILY_KEY = 'dailyexpense_family'

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function generateId() {
  return crypto.randomUUID()
}

export function loadExpenses() {
  return load(EXPENSES_KEY).sort((a, b) => b.date.localeCompare(a.date))
}

export function saveExpenses(expenses) {
  save(EXPENSES_KEY, expenses)
}

export function loadFamilyTransactions() {
  return load(FAMILY_KEY).sort((a, b) => b.date.localeCompare(a.date))
}

export function saveFamilyTransactions(transactions) {
  save(FAMILY_KEY, transactions)
}

export function createExpense(expense) {
  const expenses = loadExpenses()
  const record = {
    ...expense,
    id: generateId(),
    user_id: 'local',
    created_at: new Date().toISOString(),
  }
  expenses.unshift(record)
  saveExpenses(expenses)
  return record
}

export function updateExpense(id, updates) {
  const expenses = loadExpenses()
  const index = expenses.findIndex((e) => e.id === id)
  if (index === -1) throw new Error('Expense not found')
  expenses[index] = { ...expenses[index], ...updates }
  saveExpenses(expenses)
  return expenses[index]
}

export function deleteExpense(id) {
  const expenses = loadExpenses().filter((e) => e.id !== id)
  saveExpenses(expenses)
}

export function createFamilyTransaction(transaction) {
  const transactions = loadFamilyTransactions()
  const record = {
    ...transaction,
    id: generateId(),
    user_id: 'local',
    created_at: new Date().toISOString(),
  }
  transactions.unshift(record)
  saveFamilyTransactions(transactions)
  return record
}

export function updateFamilyTransaction(id, updates) {
  const transactions = loadFamilyTransactions()
  const index = transactions.findIndex((t) => t.id === id)
  if (index === -1) throw new Error('Transaction not found')
  transactions[index] = { ...transactions[index], ...updates }
  saveFamilyTransactions(transactions)
  return transactions[index]
}

export function deleteFamilyTransaction(id) {
  const transactions = loadFamilyTransactions().filter((t) => t.id !== id)
  saveFamilyTransactions(transactions)
}
