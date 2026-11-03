'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  magneticStrength?: number;
  className?: string;
  variant?: 'emerald' | 'outline' | 'slate';
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      children,
      magneticStrength = 0.35,
      className,
      variant = 'emerald',
      disabled,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || !buttonRef.current) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      setPosition({ x: middleX * magneticStrength, y: middleY * magneticStrength });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    const variantStyles = {
      emerald:
        'bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 active:bg-emerald-600 shadow-sm shadow-emerald-500/20',
      outline:
        'bg-slate-900/80 text-slate-200 border border-slate-700/80 hover:border-emerald-500/50 hover:text-white',
      slate:
        'bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/60',
    };

    return (
      <motion.button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 250, damping: 18, mass: 0.1 }}
        disabled={disabled}
        className={cn(
          'relative inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-colors select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          className
        )}
        {...(props as any)}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </motion.button>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';
