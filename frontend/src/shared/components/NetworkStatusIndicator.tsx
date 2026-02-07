import { WifiOff } from 'lucide-react'
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus'
import { motion, AnimatePresence } from 'framer-motion'

export function NetworkStatusIndicator() {
  const isOnline = useNetworkStatus()

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-slate-900 text-white py-1 px-4 flex items-center justify-center gap-2 text-xs font-medium"
        >
          <WifiOff size={14} className="text-rose-400" />
          <span>You are currently offline. Some features may be unavailable.</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
