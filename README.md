# Daily Expense Tracker

A personal daily expense tracker built with React, Tailwind CSS, and Supabase. Track expenses in Indian Rupees (₹), visualize spending with charts, manage family money transfers, and export monthly summaries.

## Features

- **Dashboard** — Monthly total, category pie chart, daily bar chart, quick add
- **Add Expense** — Date, grouped categories, sub-category, amount, note, payment mode
- **Expense List** — Filter, sort, search, edit & delete
- **Monthly Summary** — Category & day breakdown, CSV export
- **Family Money Tracker** — Track money given to Mom/Dad with running totals
- **Settings** — Dark/light mode, monthly budget goal, category limits, bill reminders
- **PWA** — Installable on mobile devices

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React + Vite + Tailwind |
| Charts   | Recharts                |
| Database | Supabase (PostgreSQL)   |
| Auth     | Supabase Auth           |
| Hosting  | Vercel                  |

---

## 1. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**, choose a name (e.g. `daily-expense`), set a database password, and select a region close to you.
3. Wait for the project to finish provisioning.
4. Open **SQL Editor** → **New Query**, paste the contents of `supabase/schema.sql`, and click **Run**.
5. Go to **Authentication** → **Providers** → ensure **Email** is enabled.
6. (Optional) Under **Authentication** → **Settings**, disable "Confirm email" for easier local testing.

---

## 2. Environment Variables

1. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

2. In Supabase, go to **Project Settings** → **API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

3. Your `.env` should look like:

   ```env
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

> **Never commit `.env` to git.** It is already listed in `.gitignore`.

---

## 3. Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), sign up with email/password, and start tracking expenses.

---

## 4. Vercel Deployment

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo.
3. Vercel auto-detects Vite. Set these **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**.
5. After deploy, add your Vercel URL to Supabase:
   - **Authentication** → **URL Configuration** → add your Vercel URL to **Site URL** and **Redirect URLs**.

The included `vercel.json` handles SPA routing for React Router.

---

## 5. Row Level Security (RLS)

RLS is enabled on both tables. Each user can only access their own data:

| Table                | Policies                                      |
|----------------------|-----------------------------------------------|
| `expenses`           | SELECT, INSERT, UPDATE, DELETE (own rows)     |
| `family_transactions`| SELECT, INSERT, UPDATE, DELETE (own rows)     |

All policies use `auth.uid() = user_id` so data is isolated per authenticated user. The SQL in `supabase/schema.sql` creates these policies automatically.

---

## Project Structure

```
src/
├── components/     # UI, charts, forms, layout
├── contexts/       # Auth, theme, settings
├── hooks/          # useExpenses, useFamilyTransactions
├── lib/            # Supabase client, constants, formatters
├── pages/          # Route pages
├── App.jsx         # Router
└── main.jsx        # Entry point
supabase/
└── schema.sql      # Database schema + RLS
```

## Routes

| Route        | Page                    |
|--------------|-------------------------|
| `/login`     | Email/password login    |
| `/dashboard` | Home dashboard          |
| `/add`       | Add expense             |
| `/list`      | All expenses            |
| `/summary`   | Monthly summary + CSV   |
| `/family`    | Family money tracker    |
| `/settings`  | Profile & preferences   |

## Expense Categories

**Daily:** Tea/Coffee, Lunch, Dinner, Breakfast, Petrol/Fuel, Mobile Recharge, Miscellaneous

**Home:** Rent, Electricity, WiFi, Vegetables, Home Miscellaneous

**Services:** Bike Servicing, Car Servicing

**Family:** Money to Mom, Dad, Family

## License

MIT
