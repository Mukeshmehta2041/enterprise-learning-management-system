import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
/* import { Button } from './Button' */
import { Heading4 } from './Typography'
import { cn } from '@/shared/utils/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, footer, className }: ModalProps) {
  const id = React.useId()
  const titleId = `modal-title-${id}`

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200',
          className
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <Heading4 id={titleId}>{title}</Heading4>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
