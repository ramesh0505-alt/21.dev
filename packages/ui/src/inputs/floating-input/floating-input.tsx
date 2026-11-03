'use client';

import React, { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, helperText, className, id, value, defaultValue, onChange, ...props }, ref) => {
    const inputId = id || React.useId();
    const [internalValue, setInternalValue] = useState(value || defaultValue || '');
    const isFloating = Boolean(value || internalValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            value={value !== undefined ? value : internalValue}
            onChange={handleChange}
            placeholder=" "
            className={cn(
              'peer block w-full rounded-lg border bg-slate-900/60 px-3.5 pt-5 pb-2 text-sm text-slate-100 placeholder-transparent transition-all duration-200 outline-none',
              error
                ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500',
              className
            )}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              'pointer-events-none absolute left-3.5 top-3.5 origin-[0] -translate-y-2.5 scale-75 text-xs text-slate-400 transition-all duration-200',
              'peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-slate-500',
              'peer-focus:-translate-y-2.5 peer-focus:scale-75',
              error ? 'text-red-400 peer-focus:text-red-400' : 'peer-focus:text-emerald-400'
            )}
          >
            {label}
          </label>
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-red-400">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

