'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  trend?: 'up' | 'down' | 'neutral';
  timeframe?: string;
  sparkline?: number[];
  className?: string;
}

export function StatsCard({
  label,
  value,
  change,
  trend = 'up',
  timeframe = 'vs last month',
  sparkline = [20, 28, 24, 38, 32, 45, 52],
  className,
}: StatsCardProps) {
  // Normalize sparkline to SVG coordinates
  const min = Math.min(...sparkline);
  const max = Math.max(...sparkline);
  const range = max - min || 1;
  const height = 36;
  const width = 110;
  const points = sparkline
    .map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur-sm transition-colors hover:border-slate-700',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <div
          className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold',
            trend === 'up'
              ? 'bg-emerald-500/10 text-emerald-400'
              : trend === 'down'
              ? 'bg-red-500/10 text-red-400'
              : 'bg-slate-500/10 text-slate-400'
          )}
        >
          {trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
          {trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
          <span>{change}</span>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold tracking-tight text-white font-mono">{value}</span>
          <p className="mt-1 text-[11px] text-slate-500">{timeframe}</p>
        </div>

        {/* Mini SVG Sparkline */}
        <div className="w-28 h-9">
          <svg className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={trend === 'up' ? '#10b981' : trend === 'down' ? '#f43f5e' : '#94a3b8'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
