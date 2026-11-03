'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { LucideIcon, ArrowRight, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  shimmer?: boolean;
  className?: string;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      children,
      variant = 'emerald',
      size = 'md',
      icon: Icon,
      iconPosition = 'right',
      loading = false,
      shimmer = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-md font-medium',
      md: 'h-10 px-4 text-sm gap-2 rounded-lg font-medium',
      lg: 'h-12 px-6 text-base gap-2.5 rounded-lg font-semibold',
    };

    const variantClasses = {
      emerald:
        'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:bg-emerald-600 shadow-sm shadow-emerald-950/20 font-semibold',
      primary:
        'bg-slate-900 text-slate-100 hover:bg-slate-800 active:bg-slate-950 border border-slate-700/80 shadow-sm',
      secondary:
        'bg-slate-800 text-slate-200 hover:bg-slate-700/80 active:bg-slate-800 border border-slate-700/50',
      outline:
        'bg-transparent text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600 hover:bg-slate-800/40',
      ghost:
        'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800/50',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {/* Shimmer sweep effect if enabled */}
        {shimmer && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
            animate={{
              transform: ['translateX(-100%)', 'translateX(200%)'],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: 'easeInOut',
            }}
          />
        )}

        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />}
            <span>{children}</span>
            {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />}
          </>
        )}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

