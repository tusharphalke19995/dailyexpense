-- Daily Expense Tracker - Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ============================================
-- 1. EXPENSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL,
  sub_category TEXT,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  note TEXT,
  payment_mode TEXT NOT NULL CHECK (payment_mode IN ('cash', 'upi', 'card')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. FAMILY TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.family_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  person TEXT NOT NULL CHECK (person IN ('mom', 'dad', 'other')),
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_user_category ON public.expenses(user_id, category);
CREATE INDEX IF NOT EXISTS idx_family_user_date ON public.family_transactions(user_id, date DESC);

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_transactions ENABLE ROW LEVEL SECURITY;

-- Expenses policies
CREATE POLICY "Users can view own expenses"
  ON public.expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON public.expenses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON public.expenses FOR DELETE
  USING (auth.uid() = user_id);

-- Family transactions policies
CREATE POLICY "Users can view own family transactions"
  ON public.family_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own family transactions"
  ON public.family_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own family transactions"
  ON public.family_transactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own family transactions"
  ON public.family_transactions FOR DELETE
  USING (auth.uid() = user_id);
