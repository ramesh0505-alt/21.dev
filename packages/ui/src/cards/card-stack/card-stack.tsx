'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CreditCard, Wifi, ShieldCheck } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CreditCardData {
  id: string;
  name: string;
  tier: string;
  lastFour: string;
  expiry: string;
  gradient: string;
  textColor: string;
}

const DEFAULT_CARDS: CreditCardData[] = [
  {
    id: '1',
    name: 'ALEXANDER DUPONT',
    tier: 'OBSIDIAN BLACK',
    lastFour: '8842',
    expiry: '09/29',
    gradient: 'from-neutral-900 via-neutral-800 to-neutral-950 border-neutral-700',
    textColor: 'text-neutral-100',
  },
  {
    id: '2',
    name: 'ALEXANDER DUPONT',
    tier: 'TITANIUM PRIVILEGE',
    lastFour: '4190',
    expiry: '12/28',
    gradient: 'from-slate-200 via-slate-100 to-stone-300 border-white',
    textColor: 'text-neutral-900',
  },
  {
    id: '3',
    name: 'ALEXANDER DUPONT',
    tier: 'HOLOGRAPHIC EMERALD',
    lastFour: '6013',
    expiry: '04/30',
    gradient: 'from-emerald-900 via-teal-800 to-slate-900 border-emerald-500/40',
    textColor: 'text-emerald-100',
  },
];

export function CardStack({
  headline = 'A wallet stack that fans out on touch.',
  theme = 'light',
  className,
}: {
  headline?: string;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const [fanned, setFanned] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const isDark = theme === 'dark';

  return (
    <div
      onMouseEnter={() => setFanned(true)}
      onMouseLeave={() => setFanned(false)}
      className={cn(
        'relative w-full overflow-hidden select-none py-6 px-4 text-center transition-colors',
        isDark ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900',
        className
      )}
    >
      <div className="relative mx-auto w-full max-w-xs h-48 flex items-center justify-center">
        {DEFAULT_CARDS.map((card, index) => {
          const isTop = index === activeIndex;

          const offsets = [
            { x: -28, y: -8, rotate: -10 },
            { x: 0, y: 0, rotate: 0 },
            { x: 28, y: 8, rotate: 10 },
          ];

          const currentOffset = fanned ? offsets[index] : { x: index * 6, y: index * -4, rotate: index * 2 };

          return (
            <motion.div
              key={card.id}
              onClick={() => setActiveIndex(index)}
              animate={{
                x: currentOffset.x,
                y: currentOffset.y,
                rotate: currentOffset.rotate,
                scale: isTop ? 1.05 : 0.98,
                zIndex: isTop ? 30 : 20 - index,
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className={cn(
                'absolute w-44 sm:w-52 h-28 sm:h-32 rounded-xl p-3 border shadow-xl flex flex-col justify-between cursor-pointer bg-gradient-to-tr transition-shadow',
                card.gradient,
                card.textColor
              )}
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-6 rounded-sm bg-gradient-to-r from-amber-400 to-amber-200 shadow-inner flex items-center justify-center">
                  <div className="h-2 w-3 border border-amber-800/40 rounded-xs" />
                </div>
                <Wifi className="h-3 w-3 opacity-70" />
              </div>

              <div className="text-left font-mono tracking-widest text-[9px] font-bold">
                •••• •••• •••• {card.lastFour}
              </div>

              <div className="flex items-center justify-between text-[7px] font-mono tracking-wider">
                <span className="truncate max-w-[80px] font-semibold">{card.name}</span>
                <span>{card.expiry}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

