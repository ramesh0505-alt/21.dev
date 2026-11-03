'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Coffee, Sparkles } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CoffeeOption {
  id: string;
  name: string;
  volume: string;
  descriptor: string;
  type: 'espresso' | 'americano' | 'cappuccino' | 'latte';
}

const COFFEE_MENU: CoffeeOption[] = [
  { id: 'espresso', name: 'Espresso', volume: '30 ml', descriptor: 'bold', type: 'espresso' },
  { id: 'americano', name: 'Americano', volume: '240 ml', descriptor: 'smooth', type: 'americano' },
  { id: 'cappuccino', name: 'Cappuccino', volume: '180 ml', descriptor: 'velvety', type: 'cappuccino' },
  { id: 'latte', name: 'Latte', volume: '300 ml', descriptor: 'mellow', type: 'latte' },
];

export function CoffeePourMenu({ className }: { className?: string }) {
  const [selectedId, setSelectedId] = useState('cappuccino');
  const selectedCoffee = COFFEE_MENU.find((c) => c.id === selectedId) || COFFEE_MENU[2];

  return (
    <div
      className={cn(
        'relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden bg-[#e5ddd0] text-stone-900 shadow-2xl p-6 sm:p-10 select-none border border-stone-300/60',
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[360px]">
        {/* Left: Interactive Menu Selection matching the user video */}
        <div className="space-y-3 z-10">
          {COFFEE_MENU.map((coffee) => {
            const isSelected = selectedId === coffee.id;

            return (
              <motion.div
                key={coffee.id}
                onClick={() => setSelectedId(coffee.id)}
                className={cn(
                  'relative rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-200',
                  isSelected
                    ? 'bg-[#f4eee6] shadow-lg shadow-stone-800/5'
                    : 'hover:bg-[#ebe3d6]/60'
                )}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {isSelected && (
                  <motion.div
                    layoutId="coffeeIndicator"
                    className="absolute inset-0 rounded-2xl bg-[#f7f2eb] -z-10 shadow-md"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="flex flex-col">
                  <span
                    className={cn(
                      'text-lg sm:text-2xl font-bold tracking-tight transition-colors',
                      isSelected ? 'text-stone-900' : 'text-stone-600'
                    )}
                  >
                    {coffee.name}
                  </span>
                  <span className="text-xs font-mono text-stone-500 mt-0.5">
                    {coffee.volume} • {coffee.descriptor}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Realistic Rendered Coffee Vessel & Pouring Animation */}
        <div className="relative flex flex-col items-center justify-center h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-[#dfd7c9] to-[#d3c9b8] p-6 shadow-inner border border-stone-300/40 overflow-hidden">
          {/* Subtle warm backlight */}
          <div className="absolute inset-0 bg-radial from-amber-100/30 via-transparent to-transparent pointer-events-none" />

          {/* Animated Coffee Vessel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCoffee.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative flex items-center justify-center"
            >
              {selectedCoffee.type === 'cappuccino' && <CappuccinoCup />}
              {selectedCoffee.type === 'latte' && <LatteGlass />}
              {selectedCoffee.type === 'americano' && <AmericanoMug />}
              {selectedCoffee.type === 'espresso' && <EspressoCup />}
            </motion.div>
          </AnimatePresence>

          {/* Creator Attribution matching video footer */}
          <div className="absolute bottom-3 font-mono text-[9px] text-stone-500 tracking-wider">
            by ui-library-design
          </div>
        </div>
      </div>
    </div>
  );
}

// 1. Cappuccino with Ceramic Cup, Saucer, and Heart Crema Art
function CappuccinoCup() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Saucer */}
      <div className="absolute -bottom-4 w-56 h-12 rounded-[999px] bg-gradient-to-b from-[#f2ece3] via-[#ded6c8] to-[#c7bfae] shadow-xl border border-stone-300/60" />
      <div className="absolute -bottom-2 w-48 h-8 rounded-[999px] bg-[#d9d1c3] shadow-inner" />

      {/* Ceramic Cup Body */}
      <div className="relative w-40 h-28 rounded-b-[70px] bg-gradient-to-b from-[#fdfbf7] via-[#eee7dc] to-[#ded6c7] shadow-2xl border border-stone-300/80 overflow-hidden flex flex-col items-center justify-start pt-1">
        {/* Rim */}
        <div className="w-36 h-14 rounded-[999px] bg-gradient-to-b from-[#4a2e1e] via-[#6a3f28] to-[#543220] shadow-inner flex items-center justify-center p-2 border-2 border-stone-200">
          {/* Heart Latte Art */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 20 }}
            className="w-12 h-10 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="#faf6f0" className="w-9 h-9 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Cup Handle */}
      <div className="absolute right-[-14px] top-6 w-9 h-14 rounded-r-2xl border-4 border-l-0 border-[#eee7dc] shadow-md" />
    </div>
  );
}

// 2. Tall Glass Latte with Milk & Espresso Layers
function LatteGlass() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Stream of poured milk/coffee */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 70, opacity: 0.8 }}
        transition={{ duration: 0.4 }}
        className="absolute -top-16 w-1 bg-gradient-to-b from-transparent to-[#fff8ee] shadow-sm z-30"
      />

      {/* Glass Body */}
      <div className="relative w-24 h-56 rounded-b-2xl bg-white/20 backdrop-blur-xs border-2 border-white/60 shadow-2xl overflow-hidden flex flex-col justify-end p-1">
        {/* Top froth layer */}
        <div className="w-full h-8 bg-[#fdfaf5] rounded-t-lg shadow-sm" />
        {/* Espresso middle gradient */}
        <div className="w-full h-20 bg-gradient-to-b from-[#6b4226] via-[#8c5a36] to-[#b37e54]" />
        {/* Steamed milk base layer */}
        <div className="w-full h-24 bg-gradient-to-b from-[#e8cfb8] to-[#f4ebe1]" />

        {/* Glass reflection highlight */}
        <div className="absolute top-2 left-2 w-1.5 h-48 bg-white/40 rounded-full" />
      </div>

      {/* Glass Base */}
      <div className="w-20 h-3 rounded-b-lg bg-stone-300/80 shadow-md" />
    </div>
  );
}

// 3. Clear Glass Americano Mug with Handle
function AmericanoMug() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Pouring stream */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 60, opacity: 0.7 }}
        transition={{ duration: 0.4 }}
        className="absolute -top-14 w-1 bg-gradient-to-b from-transparent to-[#422818] shadow-sm z-30"
      />

      {/* Glass Mug Body */}
      <div className="relative w-32 h-44 rounded-b-3xl bg-white/25 border-2 border-white/70 shadow-2xl overflow-hidden flex flex-col justify-end p-1">
        {/* Dark Rich Americano liquid */}
        <div className="w-full h-34 bg-gradient-to-b from-[#382013] via-[#24130a] to-[#1c0e07] rounded-b-2xl shadow-inner relative">
          <div className="absolute top-1 inset-x-2 h-2 rounded-full bg-[#52331f]/60" />
        </div>
        {/* Glass shine */}
        <div className="absolute top-2 left-2 w-1.5 h-38 bg-white/40 rounded-full" />
      </div>

      {/* Mug Handle */}
      <div className="absolute right-[-18px] top-10 w-9 h-24 rounded-r-2xl border-4 border-l-0 border-white/70 shadow-md" />
    </div>
  );
}

// 4. Espresso Demitasse
function EspressoCup() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Small Saucer */}
      <div className="absolute -bottom-3 w-40 h-8 rounded-[999px] bg-gradient-to-b from-[#eee7dc] to-[#cfc7b8] shadow-lg border border-stone-300" />

      {/* Small Cup */}
      <div className="relative w-28 h-20 rounded-b-3xl bg-gradient-to-b from-[#fbf8f3] via-[#ece5d8] to-[#ded5c6] shadow-xl border border-stone-300 flex flex-col items-center justify-start pt-1">
        <div className="w-24 h-10 rounded-[999px] bg-gradient-to-b from-[#2e190e] via-[#482917] to-[#3a2012] shadow-inner flex items-center justify-center p-1 border border-stone-200">
          {/* Golden Crema Spot */}
          <div className="w-8 h-4 rounded-full bg-[#c28e53]/80 blur-[1px]" />
        </div>
      </div>

      {/* Handle */}
      <div className="absolute right-[-10px] top-4 w-6 h-10 rounded-r-xl border-3 border-l-0 border-[#ece5d8] shadow-sm" />
    </div>
  );
}
