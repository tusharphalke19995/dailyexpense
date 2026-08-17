import {
  Coffee,
  UtensilsCrossed,
  Moon,
  Sun,
  Fuel,
  Smartphone,
  MoreHorizontal,
  Home,
  Zap,
  Wifi,
  Leaf,
  Wrench,
  Car,
  Heart,
  Users,
} from 'lucide-react'

export const PAYMENT_MODES = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card' },
]

export const FAMILY_PERSONS = [
  { value: 'mom', label: 'Mom' },
  { value: 'dad', label: 'Dad' },
  { value: 'other', label: 'Other Family' },
]

export const CATEGORY_GROUPS = {
  DAILY: {
    label: 'Daily',
    color: '#6366f1',
    categories: [
      { id: 'tea_coffee', name: 'Tea / Coffee', icon: Coffee },
      { id: 'lunch', name: 'Lunch', icon: UtensilsCrossed },
      { id: 'dinner', name: 'Dinner', icon: Moon },
      { id: 'breakfast', name: 'Breakfast', icon: Sun },
      { id: 'petrol_fuel', name: 'Petrol / Fuel', icon: Fuel },
      { id: 'mobile_recharge', name: 'Mobile Recharge', icon: Smartphone },
      { id: 'daily_misc', name: 'Miscellaneous', icon: MoreHorizontal },
    ],
  },
  HOME: {
    label: 'Home',
    color: '#22c55e',
    categories: [
      { id: 'rent', name: 'Rent', icon: Home },
      { id: 'electricity', name: 'Electricity Bill', icon: Zap },
      { id: 'wifi', name: 'WiFi Bill', icon: Wifi },
      { id: 'vegetables', name: 'Fresh Vegetables', icon: Leaf },
      { id: 'home_misc', name: 'Home Miscellaneous', icon: MoreHorizontal },
    ],
  },
  SERVICES: {
    label: 'Services',
    color: '#f59e0b',
    categories: [
      { id: 'bike_service', name: 'Bike Servicing', icon: Wrench },
      { id: 'car_service', name: 'Car Servicing', icon: Car },
    ],
  },
  FAMILY: {
    label: 'Family',
    color: '#ec4899',
    categories: [
      { id: 'money_mom', name: 'Money given to Mom', icon: Heart },
      { id: 'money_dad', name: 'Money given to Dad', icon: Heart },
      { id: 'money_family', name: 'Money given to Family', icon: Users },
    ],
  },
}

export const ALL_CATEGORIES = Object.values(CATEGORY_GROUPS).flatMap((group) =>
  group.categories.map((cat) => ({
    ...cat,
    group: group.label,
    color: group.color,
  })),
)

export const CATEGORY_MAP = Object.fromEntries(
  ALL_CATEGORIES.map((cat) => [cat.id, cat]),
)

export const CHART_COLORS = [
  '#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4',
  '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#64748b',
]

export const RECURRING_BILL_OPTIONS = [
  { id: 'rent', name: 'Rent', day: 1 },
  { id: 'electricity', name: 'Electricity Bill', day: 5 },
  { id: 'wifi', name: 'WiFi Bill', day: 10 },
  { id: 'mobile_recharge', name: 'Mobile Recharge', day: 15 },
]
