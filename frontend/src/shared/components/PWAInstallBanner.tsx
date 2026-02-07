import { usePWA } from '@/shared/hooks/usePWA'
import { Button } from '@/shared/ui/Button'
import { Download, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function PWAInstallBanner() {
  const { isInstallable, isStandalone, promptInstall } = usePWA()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show banner after a slight delay if installable and not already standalone
    // and not dismissed in this session
    const isDismissed = sessionStorage.getItem('pwa-banner-dismissed')
    if (isInstallable && !isStandalone && !isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 5000)
      return () => clearTimeout(timer)
    }
  }, [isInstallable, isStandalone])

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem('pwa-banner-dismissed', 'true')
  }

  const handleInstall = async () => {
    await promptInstall()
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-white">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
              <Download size={24} />
            </div>

            <div className="flex-grow min-w-0">
              <h3 className="font-bold text-slate-900 text-sm">Install LMS App</h3>
              <p className="text-slate-500 text-xs">Access your courses faster and study offline.</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button size="sm" onClick={handleInstall} className="rounded-full px-4 h-8 text-xs">
                Install
              </Button>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
