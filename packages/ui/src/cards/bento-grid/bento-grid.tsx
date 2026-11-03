'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

export interface BentoCardProps {
  className?: string;
  title: string;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
}

export function BentoCard({
  className,
  title,
  description,
  header,
  icon,
  badge,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-emerald-950/20',
        className
      )}
    >
      {/* Background visual header */}
      <div className="relative w-full flex-1 overflow-hidden rounded-xl border border-slate-800/60 bg-slate-950/50">
        {header}
      </div>

      <div className="z-10 mt-4 transition-transform duration-300 group-hover:translate-x-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <span className="text-emerald-400">{icon}</span>}
            <h4 className="font-semibold text-slate-100">{title}</h4>
          </div>
          {badge && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

