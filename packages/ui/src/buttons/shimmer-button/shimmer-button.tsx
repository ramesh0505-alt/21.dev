'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = '#10b981',
      shimmerSize = '0.1em',
      shimmerDuration = '2.5s',
      borderRadius = '100px',
      background = 'rgba(11, 15, 25, 1)',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
          } as React.CSSProperties
        }
        className={cn(
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]',
          className
        )}
        {...props}
      >
        {/* Spark container */}
        <div className="absolute inset-0 -z-30 overflow-visible [container-type:size]">
          <div className="absolute inset-0 h-[100cqh] animate-[spin_var(--speed)_linear_infinite] [aspect-ratio:1]">
            <div className="absolute inset-[-100%] [background:conic-gradient(from_0deg_at_50%_50%,transparent_0,var(--shimmer-color)_20%,transparent_40%)]" />
          </div>
        </div>

        {/* Backdrop container */}
        <div className="absolute inset-[1px] -z-20 rounded-[inherit] bg-slate-950/90 transition-colors duration-300 group-hover:bg-slate-900/90" />

        <span className="relative z-10 flex items-center gap-2 text-sm font-medium tracking-wide">
          {children}
        </span>
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';

