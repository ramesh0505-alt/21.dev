'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RotateCw } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SushiPlate {
  id: string;
  name: string;
  jpName: string;
  price: string;
  dishType: 'nigiri' | 'maki' | 'sashimi' | 'edamame' | 'wasabi';
  color: string;
}

const DEFAULT_PLATES: SushiPlate[] = [
  { id: '1', name: 'King Salmon Nigiri', jpName: 'サーモン', price: '$8.50', dishType: 'nigiri', color: '#ff6b4a' },
  { id: '2', name: 'Bluefin Tuna Maki', jpName: 'マグロ', price: '$9.00', dishType: 'maki', color: '#dc2626' },
  { id: '3', name: 'Steamed Edamame', jpName: '枝豆', price: '$5.00', dishType: 'edamame', color: '#16a34a' },
  { id: '4', name: 'Yellowtail Nigiri', jpName: 'ハマチ', price: '$8.00', dishType: 'nigiri', color: '#fed7aa' },
  { id: '5', name: 'Avocado Roll', jpName: 'アボカド', price: '$6.50', dishType: 'maki', color: '#84cc16' },
  { id: '6', name: 'Fresh Wasabi & Ginger', jpName: '生姜', price: '$3.00', dishType: 'wasabi', color: '#22c55e' },
];

// Pre-computed integer coordinates for the 6 oval turntable positions (prevents SSR/client float mismatch)
const PLATE_POSITIONS = [
  { x: 135, y: 0 },
  { x: 68, y: 54 },
  { x: -68, y: 54 },
  { x: -135, y: 0 },
  { x: -68, y: -54 },
  { x: 68, y: -54 },
];

export function SushiBar({
  headline = 'A sushi bar that keeps turning, right on the page.',
  subtitle = 'OMAKASE EXPERIENCE • ROTATING CONVEYOR',
  theme = 'light',
  className,
}: {
  headline?: string;
  subtitle?: string;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const [rotation, setRotation] = useState(0);
  const [selectedPlate, setSelectedPlate] = useState<SushiPlate | null>(DEFAULT_PLATES[0]);

  const rotateNext = () => setRotation((r) => r + 60);

  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden select-none py-6 px-4 text-center transition-colors',
        isDark ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900',
        className
      )}
    >
      <div className="space-y-1 mb-6">
        <div className="text-[10px] tracking-widest uppercase font-mono font-medium text-neutral-400">
          {subtitle}
        </div>
        <h2 className="text-base sm:text-xl font-bold tracking-tight max-w-md mx-auto">
          {headline}
        </h2>
      </div>

      {/* Oval Conveyor Turntable */}
      <div className="relative mx-auto w-full max-w-sm h-48 flex items-center justify-center">
        {/* Dark wooden counter oval base */}
        <div className="absolute inset-0 rounded-[999px] bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 border-4 border-stone-700/80 shadow-2xl flex items-center justify-center p-3">
          {/* Inner metallic track */}
          <div className="w-full h-full rounded-[999px] border-2 border-dashed border-stone-500/40 bg-stone-950/60 flex items-center justify-center relative overflow-hidden">
            {/* Center wooden logo plaque */}
            <div className="h-10 w-24 rounded-full bg-stone-800 border border-stone-600 flex items-center justify-center shadow-inner">
              <span className="text-[9px] font-mono tracking-widest text-amber-300 font-semibold uppercase">
                SUSHI-YA
              </span>
            </div>

            {/* Revolving Plates Array */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: rotation }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            >
              {DEFAULT_PLATES.map((plate, index) => {
                const pos = PLATE_POSITIONS[index] || { x: 0, y: 0 };

                return (
                  <motion.div
                    key={plate.id}
                    onClick={() => setSelectedPlate(plate)}
                    className="absolute top-1/2 left-1/2 -ml-5 -mt-5 h-10 w-10 rounded-full bg-stone-100 border-2 border-stone-300 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                  >
                    <div
                      className="h-5 w-6 rounded-sm shadow-sm flex items-center justify-center text-[7px] font-bold text-white"
                      style={{ backgroundColor: plate.color }}
                    >
                      {plate.dishType === 'nigiri' ? '🍣' : plate.dishType === 'maki' ? '🍱' : '🥢'}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Control button */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={rotateNext}
          className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
        >
          <RotateCw className="h-3 w-3 text-amber-400" />
          <span>Spin platter</span>
        </button>
      </div>
    </div>
  );
}
