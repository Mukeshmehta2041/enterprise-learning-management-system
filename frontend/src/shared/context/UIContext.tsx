import { createContext, useContext, useState, type ReactNode, useCallback } from 'react'

interface UIState {
  isSidebarOpen: boolean
}

interface UIContextType extends UIState {
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, [])

  const setSidebarOpen = useCallback((open: boolean) => {
    setIsSidebarOpen(open)
  }, [])

  const value = {
    isSidebarOpen,
    toggleSidebar,
    setSidebarOpen,
  }

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
