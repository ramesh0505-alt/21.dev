'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ShoppingBag, Sparkles, Check } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ClothingItem {
  id: string;
  name: string;
  price: string;
  color: string;
  hangerType?: 'wood' | 'metal';
  category: string;
  badge?: string;
  iconText?: string;
}

export interface ClothingRailProps {
  headline?: string;
  subtitle?: string;
  items?: ClothingItem[];
  className?: string;
}

const DEFAULT_ITEMS: ClothingItem[] = [
  { id: '1', name: 'Raw Edge Linen Tee', price: '$48', color: 'bg-amber-100/90 text-stone-800', category: 'Tops' },
  { id: '2', name: 'Oversized Heavy Jersey', price: '$52', color: 'bg-neutral-900 text-stone-100', iconText: 'CCgather', category: 'Graphic' },
  { id: '3', name: 'Oxford Button-Down', price: '$74', color: 'bg-sky-200 text-sky-950', category: 'Shirts' },
  { id: '4', name: 'Ribbed Knit Cardigan', price: '$96', color: 'bg-stone-700 text-stone-100', category: 'Knitwear' },
  { id: '5', name: 'Loopback Zip Hoodie', price: '$68', color: 'bg-slate-300 text-slate-800', category: 'Hoodies' },
  { id: '6', name: 'Lavender Fleece Crew', price: '$78', color: 'bg-purple-300 text-purple-950', category: 'Sweatshirts' },
  { id: '7', name: 'Piqué Tennis Polo', price: '$62', color: 'bg-emerald-800 text-emerald-100', category: 'Polos' },
  { id: '8', name: 'Terracotta Overshirt', price: '$56', color: 'bg-orange-800/90 text-orange-100', category: 'Overshirts' },
  { id: '9', name: 'Breton Stripe Longsleeve', price: '$58', color: 'bg-stone-100 text-slate-900 border-2 border-slate-900', iconText: '≡≡≡', category: 'Basics' },
  { id: '10', name: 'Mustard Work Shirt', price: '$52', color: 'bg-amber-500 text-stone-950', category: 'Workwear' },
];

export function ClothingRail({
  headline = 'A clothing rail you can handle, right on the page.',
  subtitle = 'NEW SEASON • TEN PIECES ON THE RAIL',
  items = DEFAULT_ITEMS,
  className,
}: ClothingRailProps) {
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [baggedId, setBaggedId] = useState<string | null>(null);

  const handleBag = (item: ClothingItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setBaggedId(item.id);
    setTimeout(() => setBaggedId(null), 2000);
  };

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl bg-neutral-950 px-6 py-10 text-white select-none',
        className
      )}
    >
      {/* Header text */}
      <div className="text-center space-y-2 mb-10">
        <div className="text-[10px] tracking-widest font-mono text-neutral-400 uppercase">
          {subtitle}
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white max-w-xl mx-auto">
          {headline}
        </h2>
      </div>

      {/* Rail & Sliding Hangers Container */}
      <div className="relative mx-auto max-w-5xl overflow-x-auto pb-6 scrollbar-none">
        {/* The Metal Wardrobe Rail Bar */}
        <div className="relative mx-4 flex items-center">
          {/* Left bracket */}
          <div className="h-6 w-3 rounded-l-md bg-stone-400 border border-stone-300 shadow-md" />
          {/* Metallic pole */}
          <div className="h-3 flex-1 bg-gradient-to-b from-stone-200 via-stone-400 to-stone-500 rounded-sm shadow-inner" />
          {/* Right bracket */}
          <div className="h-6 w-3 rounded-r-md bg-stone-400 border border-stone-300 shadow-md" />
        </div>

        {/* Hanging Garments */}
        <div className="flex items-start justify-between px-6 pt-1 gap-2 min-w-[700px]">
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
                  y: isHovered ? -12 : 0,
                  rotate: isHovered ? (idx % 2 === 0 ? 2 : -2) : 0,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              >
                {/* Metal Hook */}
                <div className="relative h-4 w-3 border-t-2 border-l-2 border-stone-300 rounded-tl-full -mt-2.5 z-10" />

                {/* Wooden Hanger */}
                <div className="relative h-2 w-14 rounded-full bg-amber-800/90 shadow-sm z-10 flex items-center justify-center">
                  <div className="h-1 w-8 rounded-full bg-amber-700/60" />
                </div>

                {/* Price Tag Pill */}
                <motion.div
                  className="absolute top-6 -left-1 z-30 flex items-center rounded bg-black/90 px-1.5 py-0.5 text-[9px] font-mono text-stone-200 border border-white/20 shadow-md"
                  animate={{ scale: isHovered ? 1.15 : 1 }}
                >
                  {item.price}
                </motion.div>

                {/* Garment Silhouette Body */}
                <div
                  className={cn(
                    'relative mt-1 flex flex-col items-center justify-start rounded-t-xl shadow-xl transition-all duration-300',
                    item.color,
                    isHovered ? 'ring-2 ring-emerald-400 shadow-2xl scale-105' : 'opacity-95'
                  )}
                  style={{
                    width: idx === 1 ? '72px' : idx === 3 ? '68px' : '58px',
                    height: idx === 3 || idx === 7 ? '180px' : '150px',
                  }}
                >
                  {/* Collar neckline detail */}
                  <div className="h-2 w-5 rounded-b-md bg-black/20 mt-1" />

                  {/* Brand graphic text if present */}
                  {item.iconText && (
                    <div className="mt-8 font-mono text-[9px] font-extrabold tracking-wider opacity-80">
                      {item.iconText}
                    </div>
                  )}

                  {/* Quick Add Button on Hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={(e) => handleBag(item, e)}
                        className="absolute bottom-3 rounded-full bg-black/80 p-1.5 text-white shadow-lg hover:bg-emerald-500 hover:text-black transition-colors"
                      >
                        {baggedId === item.id ? (
                          <Check className="h-3 w-3 text-emerald-300" />
                        ) : (
                          <ShoppingBag className="h-3 w-3" />
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Garment Label preview */}
                <div className="mt-3 text-center">
                  <div className="text-[10px] font-medium text-stone-300 truncate max-w-[64px]">
                    {item.name}
                  </div>
                  <div className="font-mono text-[9px] text-emerald-400 font-semibold">
                    {item.price}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
