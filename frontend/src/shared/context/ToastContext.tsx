import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastNotify: ToastContextType | null = null;

// eslint-disable-next-line react-refresh/only-export-components
export const toast = {
  success: (msg: string, dur?: number) => toastNotify?.success(msg, dur),
  error: (msg: string, dur?: number) => toastNotify?.error(msg, dur),
  info: (msg: string, dur?: number) => toastNotify?.info(msg, dur),
  warning: (msg: string, dur?: number) => toastNotify?.warning(msg, dur),
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration !== Infinity) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const api = useMemo(() => ({
    showToast,
    success: (msg: string, dur?: number) => showToast(msg, 'success', dur),
    error: (msg: string, dur?: number) => showToast(msg, 'error', dur),
    info: (msg: string, dur?: number) => showToast(msg, 'info', dur),
    warning: (msg: string, dur?: number) => showToast(msg, 'warning', dur),
  }), [showToast]);

  // Set the global notifier in an effect to avoid render side-effects
  React.useEffect(() => {
    toastNotify = api;
    return () => {
      toastNotify = null;
    };
  }, [api]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle className="text-emerald-500 h-5 w-5" />,
    error: <AlertCircle className="text-rose-500 h-5 w-5" />,
    info: <Info className="text-blue-500 h-5 w-5" />,
    warning: <AlertTriangle className="text-amber-500 h-5 w-5" />,
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-100',
    error: 'bg-rose-50 border-rose-100',
    info: 'bg-blue-50 border-blue-100',
    warning: 'bg-amber-50 border-amber-100',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-md ${bgColors[toast.type]}`}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 text-sm font-medium text-slate-800">{toast.message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
