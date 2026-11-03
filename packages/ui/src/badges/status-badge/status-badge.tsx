'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'online' | 'busy' | 'offline' | 'warning';
  label?: string;
  ping?: boolean;
}

export function StatusBadge({
  status = 'online',
  label,
  ping = true,
  className,
  ...props
}: StatusBadgeProps) {
  const statusStyles = {
    online: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      dot: 'bg-emerald-500',
      pingColor: 'bg-emerald-400',
    },
    busy: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      dot: 'bg-amber-500',
      pingColor: 'bg-amber-400',
    },
    warning: {
      bg: 'bg-red-500/10 border-red-500/30 text-red-400',
      dot: 'bg-red-500',
      pingColor: 'bg-red-400',
    },
    offline: {
      bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
      dot: 'bg-slate-400',
      pingColor: 'bg-slate-400',
    },
  };

  const current = statusStyles[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium',
        current.bg,
        className
      )}
      {...props}
    >
      <span className="relative flex h-2 w-2">
        {ping && status !== 'offline' && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              current.pingColor
            )}
          />
        )}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', current.dot)} />
      </span>
      <span>{label || status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </div>
  );
}

