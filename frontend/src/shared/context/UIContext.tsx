import { createContext, useContext, useState, type ReactNode, useCallback } from 'react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface UIState {
  isSidebarOpen: boolean
  breadcrumbItems: BreadcrumbItem[] | null
}

interface UIContextType extends UIState {
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setBreadcrumbs: (items: BreadcrumbItem[] | null) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [breadcrumbItems, setBreadcrumbs] = useState<BreadcrumbItem[] | null>(null)

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, [])

  const setSidebarOpen = useCallback((open: boolean) => {
    setIsSidebarOpen(open)
  }, [])

  const value = {
    isSidebarOpen,
    breadcrumbItems,
    toggleSidebar,
    setSidebarOpen,
    setBreadcrumbs,
  }

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
