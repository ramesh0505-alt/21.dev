'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ShoppingBag, Sparkles, Check, ChevronRight } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ClothingItem {
  id: string;
  name: string;
  price: string;
  type: 'tank' | 'graphic-tee' | 'shirt' | 'sweater' | 'hoodie' | 'crew' | 'polo' | 'longsleeve' | 'striped' | 'tee';
  color: string;
  tagColor?: string;
  brandText?: string;
}

export interface ClothingRailProps {
  headline?: string;
  subtitle?: string;
  items?: ClothingItem[];
  theme?: 'dark' | 'light';
  className?: string;
  showCta?: boolean;
}

const DEFAULT_ITEMS: ClothingItem[] = [
  { id: '1', name: 'Raw Edge Ribbed Tank', price: '$48', type: 'tank', color: '#f5f4ef' },
  { id: '2', name: 'CCgather Heavy Jersey', price: '$52', type: 'graphic-tee', color: '#161616', brandText: 'CCgather' },
  { id: '3', name: 'Sky Oxford Button-Down', price: '$74', type: 'shirt', color: '#9bc8ea' },
  { id: '4', name: 'Military Ribbed Knit', price: '$96', type: 'sweater', color: '#566046' },
  { id: '5', name: 'Heather Loopback Hoodie', price: '$68', type: 'hoodie', color: '#b8bdc5' },
  { id: '6', name: 'Lilac Brushed Crewneck', price: '$78', type: 'crew', color: '#b59cd4' },
  { id: '7', name: 'Pine Piqué Tennis Polo', price: '$62', type: 'polo', color: '#1f593b' },
  { id: '8', name: 'Terracotta Classic Long', price: '$56', type: 'longsleeve', color: '#b05740' },
  { id: '9', name: 'Breton Nautical Stripe', price: '$58', type: 'striped', color: '#ffffff' },
  { id: '10', name: 'Mustard Heavyweight Tee', price: '$52', type: 'tee', color: '#e5a524' },
];

export function ClothingRail({
  headline = 'A clothing rail you can handle, right on the page.',
  subtitle = 'NEW SEASON • TEN PIECES ON THE RAIL',
  items = DEFAULT_ITEMS,
  theme = 'dark',
  className,
  showCta = false,
}: ClothingRailProps) {
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [baggedId, setBaggedId] = useState<string | null>(null);

  const handleBag = (item: ClothingItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setBaggedId(item.id);
    setTimeout(() => setBaggedId(null), 2000);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden select-none transition-colors duration-300',
        isDark ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900',
        className
      )}
    >
      {/* Header text matching 21st.dev Screenshot 1 & 2 */}
      <div className="text-center space-y-2 mb-8 md:mb-12 pt-4">
        <div
          className={cn(
            'text-[10px] md:text-xs tracking-[0.25em] font-medium uppercase font-mono',
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          )}
        >
          {subtitle}
        </div>
        <h2
          className={cn(
            'text-lg sm:text-2xl md:text-3xl font-bold tracking-tight max-w-xl mx-auto px-4',
            isDark ? 'text-white' : 'text-neutral-950'
          )}
        >
          {headline}
        </h2>
      </div>

      {/* Wardrobe Metal Rail System */}
      <div className="relative mx-auto max-w-5xl overflow-x-auto pb-8 scrollbar-none px-4">
        {/* Metal Rail Bar */}
        <div className="relative mx-2 sm:mx-6 flex items-center">
          {/* Left chrome wall bracket */}
          <div className="h-7 w-3 rounded-l-md bg-gradient-to-r from-stone-400 to-stone-300 border border-stone-400/80 shadow-md flex items-center justify-center">
            <div className="h-3 w-1 bg-stone-500 rounded-sm" />
          </div>

          {/* Chrome cylindrical rail with highlight */}
          <div className="relative h-3.5 flex-1 bg-gradient-to-b from-stone-100 via-stone-300 to-stone-500 rounded-sm shadow-md">
            {/* White shine highlight */}
            <div className="absolute top-0.5 inset-x-0 h-[1.5px] bg-white/80" />
            {/* Subtle rail grooves */}
            <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:24px_100%]" />
          </div>

          {/* Right chrome wall bracket */}
          <div className="h-7 w-3 rounded-r-md bg-gradient-to-r from-stone-300 to-stone-400 border border-stone-400/80 shadow-md flex items-center justify-center">
            <div className="h-3 w-1 bg-stone-500 rounded-sm" />
          </div>
        </div>

        {/* Garments on Hangers */}
        <div className="flex items-start justify-between px-4 sm:px-8 pt-0 gap-1 sm:gap-2 min-w-[760px]">
          {items.map((item, idx) => {
            const isHovered = hoveredId === item.id;
            const isSelected = selectedItem?.id === item.id;

            return (
              <motion.div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedItem(item)}
                className="group relative flex flex-col items-center cursor-pointer"
                animate={{
                  y: isHovered ? -14 : 0,
                  rotate: isHovered ? (idx % 2 === 0 ? 2 : -2) : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                {/* Silver Wire Hook hooked over the rail */}
                <div className="relative h-5 w-3 -mt-3.5 z-10 flex justify-center">
                  <div className="h-full w-2.5 border-t-2 border-l-2 border-stone-300 rounded-tl-full shadow-sm" />
                </div>

                {/* Natural Light Wood Hanger */}
                <div className="relative h-2.5 w-14 sm:w-16 rounded-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 shadow-sm z-10 flex items-center justify-center border-t border-amber-500/40">
                  <div className="h-1 w-8 sm:w-10 rounded-full bg-amber-500/30" />
                </div>

                {/* Black Price Tag with String hanging from hook */}
                <motion.div
                  className="absolute top-5 -left-1.5 z-30 flex items-center rounded-[3px] bg-neutral-900/95 px-1.5 py-0.5 text-[9px] font-mono font-medium text-white border border-neutral-700 shadow-lg"
                  animate={{ scale: isHovered ? 1.15 : 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  {/* Tag hole */}
                  <div className="h-1 w-1 rounded-full bg-neutral-600 mr-1" />
                  {item.price}
                </motion.div>

                {/* Garment Silhouette Body */}
                <div className="relative mt-0.5 flex flex-col items-center">
                  <GarmentBody item={item} isHovered={isHovered} />

                  {/* Quick Cart Button on Hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={(e) => handleBag(item, e)}
                        className="absolute bottom-4 z-40 rounded-full bg-neutral-950/90 p-1.5 text-white shadow-xl border border-neutral-700 hover:bg-emerald-500 hover:text-black transition-colors"
                        title="Add to cart"
                      >
                        {baggedId === item.id ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <ShoppingBag className="h-3 w-3" />
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Optional Pill CTA Button (shown in Screenshot 1 preview card) */}
        {showCta && (
          <div className="mt-8 flex justify-center">
            <button className="rounded-full bg-neutral-950 px-6 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors shadow-md">
              Explore the rail
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GarmentBody({ item, isHovered }: { item: ClothingItem; isHovered: boolean }) {
  const shadowStyle = isHovered
    ? 'drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]'
    : 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]';

  // 1. Tank top
  if (item.type === 'tank') {
    return (
      <div
        className={cn('relative w-10 sm:w-12 h-44 rounded-t-sm shadow-md transition-all', shadowStyle)}
        style={{ backgroundColor: item.color }}
      >
        <div className="h-4 w-5 mx-auto bg-black/20 rounded-b-full" />
        <div className="absolute inset-y-6 inset-x-1.5 opacity-20 [background-image:repeating-linear-gradient(to_right,transparent,transparent_2px,#000_2px,#000_3px)]" />
      </div>
    );
  }

  // 2. Black CCgather graphic t-shirt
  if (item.type === 'graphic-tee') {
    return (
      <div
        className={cn(
          'relative w-16 sm:w-20 h-44 rounded-t-sm shadow-md transition-all flex flex-col items-center justify-start',
          shadowStyle
        )}
        style={{ backgroundColor: item.color }}
      >
        {/* Sleeves */}
        <div className="absolute -left-2 top-0 w-3 h-14 bg-neutral-900 rounded-tl-sm -rotate-12" />
        <div className="absolute -right-2 top-0 w-3 h-14 bg-neutral-900 rounded-tr-sm rotate-12" />
        {/* Crewneck */}
        <div className="h-2 w-6 bg-neutral-800 rounded-b-md border-b border-neutral-700/60" />
        {/* Bold White Graphic Text "CCgather" matching Screenshot 2 */}
        <div className="mt-8 font-sans font-black text-[11px] tracking-tight text-white/95 select-none text-center">
          CCgather
        </div>
      </div>
    );
  }

  // 3. Sky blue button-down shirt
  if (item.type === 'shirt') {
    return (
      <div
        className={cn('relative w-14 sm:w-16 h-48 rounded-t-sm shadow-md transition-all', shadowStyle)}
        style={{ backgroundColor: item.color }}
      >
        {/* Folded collar */}
        <div className="h-3 w-7 mx-auto bg-sky-300 rounded-b-sm border-b border-sky-400" />
        {/* Front placket and buttons */}
        <div className="h-full w-[2px] mx-auto bg-sky-300 flex flex-col justify-around py-4">
          <div className="h-1 w-1 rounded-full bg-white/80 mx-auto" />
          <div className="h-1 w-1 rounded-full bg-white/80 mx-auto" />
          <div className="h-1 w-1 rounded-full bg-white/80 mx-auto" />
          <div className="h-1 w-1 rounded-full bg-white/80 mx-auto" />
        </div>
        {/* Hanging sleeves */}
        <div className="absolute -left-1.5 top-0 w-2.5 h-40 bg-sky-300/90 rounded-b-sm" />
        <div className="absolute -right-1.5 top-0 w-2.5 h-40 bg-sky-300/90 rounded-b-sm" />
      </div>
    );
  }

  // 4. Olive knit cardigan / sweater
  if (item.type === 'sweater') {
    return (
      <div
        className={cn('relative w-15 sm:w-16 h-48 rounded-t-sm shadow-md transition-all', shadowStyle)}
        style={{ backgroundColor: item.color }}
      >
        <div className="h-3 w-6 mx-auto bg-stone-700 rounded-b-sm" />
        {/* Ribbed texture */}
        <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(to_right,transparent,transparent_3px,#000_3px,#000_4px)]" />
        {/* Sleeves */}
        <div className="absolute -left-2 top-0 w-3 h-44 bg-stone-800/80 rounded-b-sm" />
        <div className="absolute -right-2 top-0 w-3 h-44 bg-stone-800/80 rounded-b-sm" />
      </div>
    );
  }

  // 5. Heather grey hoodie
  if (item.type === 'hoodie') {
    return (
      <div
        className={cn('relative w-14 sm:w-16 h-46 rounded-t-sm shadow-md transition-all', shadowStyle)}
        style={{ backgroundColor: item.color }}
      >
        {/* Draped hood shape on shoulder matching Screenshot 2 */}
        <div className="absolute -top-1 -right-2 w-5 h-8 bg-slate-400 rounded-br-2xl shadow-sm border border-slate-300" />
        <div className="h-2 w-6 mx-auto bg-slate-400 rounded-b-md" />
        {/* Kangaroo pocket */}
        <div className="absolute bottom-6 inset-x-2 h-7 bg-slate-400/50 rounded-t-md border-t border-slate-300" />
      </div>
    );
  }

  // 6. Lilac crewneck
  if (item.type === 'crew') {
    return (
      <div
        className={cn('relative w-14 sm:w-16 h-44 rounded-t-sm shadow-md transition-all', shadowStyle)}
        style={{ backgroundColor: item.color }}
      >
        <div className="h-2.5 w-6 mx-auto bg-purple-400 rounded-b-md" />
        <div className="absolute -left-1.5 top-0 w-2.5 h-38 bg-purple-400/80 rounded-b-sm" />
        <div className="absolute -right-1.5 top-0 w-2.5 h-38 bg-purple-400/80 rounded-b-sm" />
      </div>
    );
  }

  // 7. Green polo shirt
  if (item.type === 'polo') {
    return (
      <div
        className={cn('relative w-14 sm:w-16 h-44 rounded-t-sm shadow-md transition-all', shadowStyle)}
        style={{ backgroundColor: item.color }}
      >
        {/* Polo collar */}
        <div className="h-3 w-7 mx-auto bg-emerald-900 rounded-b-sm border-b border-emerald-950 flex justify-center">
          <div className="h-4 w-1 bg-emerald-950" />
        </div>
        <div className="absolute -left-1.5 top-0 w-2.5 h-16 bg-emerald-900 rounded-b-sm" />
        <div className="absolute -right-1.5 top-0 w-2.5 h-16 bg-emerald-900 rounded-b-sm" />
      </div>
    );
  }

  // 8. Terracotta long sleeve
  if (item.type === 'longsleeve') {
    return (
      <div
        className={cn('relative w-14 sm:w-16 h-46 rounded-t-sm shadow-md transition-all', shadowStyle)}
        style={{ backgroundColor: item.color }}
      >
        <div className="h-2.5 w-6 mx-auto bg-orange-900 rounded-b-md" />
        <div className="absolute -left-2 top-0 w-3 h-42 bg-orange-900/90 rounded-b-sm" />
        <div className="absolute -right-2 top-0 w-3 h-42 bg-orange-900/90 rounded-b-sm" />
      </div>
    );
  }

  // 9. Black and white striped Breton shirt
  if (item.type === 'striped') {
    return (
      <div
        className={cn(
          'relative w-14 sm:w-16 h-46 rounded-t-sm shadow-md transition-all overflow-hidden [background-image:repeating-linear-gradient(to_bottom,#161616,#161616_4px,#ffffff_4px,#ffffff_8px)]',
          shadowStyle
        )}
      >
        <div className="h-2 w-6 mx-auto bg-neutral-900 rounded-b-md" />
      </div>
    );
  }

  // 10. Mustard yellow tee
  return (
    <div
      className={cn('relative w-15 sm:w-17 h-44 rounded-t-sm shadow-md transition-all', shadowStyle)}
      style={{ backgroundColor: item.color }}
    >
      <div className="h-2 w-6 mx-auto bg-amber-600 rounded-b-md" />
      <div className="absolute -left-2 top-0 w-3 h-16 bg-amber-600 rounded-b-sm -rotate-6" />
      <div className="absolute -right-2 top-0 w-3 h-16 bg-amber-600 rounded-b-sm rotate-6" />
    </div>
  );
}
