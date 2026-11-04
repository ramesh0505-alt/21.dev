'use client';

import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type EmojiNavItem = {
  label: string;
  href: string;
  emoji: string;
  alt: string;
};

export interface EmojiNavProps {
  navItems: EmojiNavItem[];
  className?: string;
}

export function EmojiNav({ navItems, className }: EmojiNavProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  return (
    <div className={cn('relative inline-flex items-center justify-center select-none', className)}>
      <div className="border border-neutral-800 bg-neutral-900/90 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-5">
        {navItems.map((item, index) => (
          <div
            key={item.label}
            className="relative flex flex-col items-center"
            onMouseEnter={() => setHoveredIdx(index)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Tooltip Pill */}
            {hoveredIdx === index && (
              <div className="absolute -top-9 z-30 px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-700 text-white text-[10px] font-medium shadow-md whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                {item.label}
              </div>
            )}

            <a
              href={item.href}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:scale-125 transition-transform duration-200 text-2xl"
            >
              <span role="img" aria-label={item.alt}>
                {item.emoji}
              </span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
