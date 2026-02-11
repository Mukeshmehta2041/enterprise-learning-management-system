import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setInstallPrompt(null)
      setIsInstallable(false)
      console.log('PWA was installed')
    }

    // Check if app is already in standalone mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone: boolean }).standalone
    ) {
      // Use requestAnimationFrame to avoid synchronous state update in effect
      requestAnimationFrame(() => {
        setIsStandalone(true)
      })
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = async () => {
    if (!installPrompt) {
      return
    }
    // Show the install prompt
    await installPrompt.prompt()
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    // We've used the prompt, and can't use it again, throw it away
    setInstallPrompt(null)
    setIsInstallable(false)
  }

  return { isInstallable, isStandalone, promptInstall }
}
