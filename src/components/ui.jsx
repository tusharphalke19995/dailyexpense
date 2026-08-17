export function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {children}
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
      <input
        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white ${className}`}
        {...props}
      />
    </label>
  )
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
      <select
        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
      <textarea
        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white ${className}`}
        rows={3}
        {...props}
      />
    </label>
  )
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && <Icon className="mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />}
      <h3 className="font-medium text-slate-700 dark:text-slate-300">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
    </div>
  )
}
