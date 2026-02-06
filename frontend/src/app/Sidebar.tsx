import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  BarChart3,
  Settings,
  CreditCard,
  X,
  LogOut
} from 'lucide-react'
import { IconButton } from '@/shared/ui'
import { useAuth } from '@/shared/context/AuthContext'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Assignments', href: '/assignments', icon: ClipboardList },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['INSTRUCTOR', 'ADMIN']
  },
  { name: 'Subscription', href: '/pricing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  onClose?: () => void
  className?: string
}

export function Sidebar({ onClose, className }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // const userInitials = user ? `${user.firstName[0]}${user.lastName[0]}` : '??'
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest'
  const role = user?.roles[0] || 'User'

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    if (!user) return false;
    return item.roles.some(role => user.roles.includes(role));
  });

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-white border-r border-slate-200',
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          LMS Portal
        </Link>
        {onClose && (
          <IconButton
            icon={<X className="h-5 w-5" />}
            onClick={onClose}
            variant="ghost"
            className="md:hidden"
            aria-label="Close navigation"
          />
        )}
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4" aria-label="Primary">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-indigo-600'
                    : 'text-slate-400 group-hover:text-slate-500',
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-100 space-y-2">
        <div className="flex items-center gap-3 px-2 py-3 rounded-md bg-slate-50">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
            {/* {userInitials} */}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {fullName}
            </p>
            <p className="text-xs text-slate-500 truncate capitalize">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          Logout
        </button>
      </div>
    </div>
  )
}
