import React from 'react';
import type { LucideIcon, } from 'lucide-react';
import { Search } from 'lucide-react';
import { Card } from './Layout';
import { Heading3, TextMuted } from './Typography';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Search,
  actionLabel,
  onAction,
  action,
  className = '',
}) => {
  return (
    <Card className={`flex flex-col items-center justify-center p-12 text-center border-dashed border-slate-200 bg-slate-50/50 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <Icon size={32} />
      </div>
      <Heading3 className="mb-2">{title}</Heading3>
      <TextMuted className="max-w-xs mb-6">{description}</TextMuted>
      {action ? action : (
        actionLabel && onAction && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </Card>
  );
};
