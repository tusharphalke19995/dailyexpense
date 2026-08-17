import { HardDrive } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LocalModeBanner() {
  const { isLocalMode } = useAuth()
  if (!isLocalMode) return null

  return (
    <div className="mb-3 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
      <HardDrive className="h-3.5 w-3.5 shrink-0" />
      <span>Free offline mode — data saved on this device only</span>
    </div>
  )
}
