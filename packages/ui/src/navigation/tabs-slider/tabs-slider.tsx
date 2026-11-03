'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface TabsSliderProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export function TabsSlider({ tabs, defaultTab, onChange, className }: TabsSliderProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/90 p-1 backdrop-blur-md',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleSelect(tab.id)}
            className={cn(
              'relative z-10 flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors select-none cursor-pointer',
              isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {tab.icon && <span className="h-3.5 w-3.5">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[9px] font-semibold',
                  isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                )}
              >
                {tab.badge}
              </span>
            )}

            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 -z-10 rounded-lg border border-slate-700/80 bg-slate-800/90 shadow-sm"
                transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
