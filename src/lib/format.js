export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getMonthRange(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
    label: start.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
  }
}

export function exportToCSV(data, filename) {
  if (!data.length) return
  const headers = Object.keys(data[0])
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = row[h] ?? ''
      return `"${String(val).replace(/"/g, '""')}"`
    }).join(','),
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export function getCategoryLabel(categoryId) {
  const labels = {
    tea_coffee: 'Tea / Coffee',
    lunch: 'Lunch',
    dinner: 'Dinner',
    breakfast: 'Breakfast',
    petrol_fuel: 'Petrol / Fuel',
    mobile_recharge: 'Mobile Recharge',
    daily_misc: 'Miscellaneous',
    rent: 'Rent',
    electricity: 'Electricity Bill',
    wifi: 'WiFi Bill',
    vegetables: 'Fresh Vegetables',
    cook_mavshi: 'Cook Mavshi',
    home_misc: 'Home Miscellaneous',
    bike_service: 'Bike Servicing',
    car_service: 'Car Servicing',
    money_mom: 'Money given to Mom',
    money_dad: 'Money given to Dad',
    money_family: 'Money given to Family',
    ppf: 'PPF',
    lic: 'LIC',
    mutual_funds: 'Mutual Funds',
    nps: 'NPS',
    emi_home: 'Home EMI',
    emi_car: 'Car EMI',
    personal_loan: 'Personal Loan',
  }
  return labels[categoryId] || categoryId
}

export function getPaymentLabel(mode) {
  return { cash: 'Cash', upi: 'UPI', card: 'Card' }[mode] || mode
}
