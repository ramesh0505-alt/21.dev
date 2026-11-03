'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Pin, Camera, Heart } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PolaroidPhoto {
  id: string;
  title: string;
  location: string;
  date: string;
  gradient: string;
  rotation: number;
}

const DEFAULT_PHOTOS: PolaroidPhoto[] = [
  {
    id: '1',
    title: 'Alpine Peak',
    location: 'Dolomites, Italy',
    date: 'Oct 2026',
    gradient: 'from-amber-600 via-rose-500 to-indigo-800',
    rotation: -4,
  },
  {
    id: '2',
    title: 'Silver Ridge',
    location: 'Swiss Alps',
    date: 'Nov 2026',
    gradient: 'from-teal-600 via-emerald-700 to-slate-900',
    rotation: 2,
  },
  {
    id: '3',
    title: 'Echo Valley',
    location: 'Oregon, USA',
    date: 'Sep 2026',
    gradient: 'from-blue-600 via-indigo-700 to-purple-950',
    rotation: -2,
  },
];

export function PolaroidGallery({ photos = DEFAULT_PHOTOS, className }: { photos?: PolaroidPhoto[]; className?: string }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className={cn('relative w-full overflow-hidden rounded-2xl bg-neutral-950 p-8 select-none', className)}>
      {/* Clothesline / Hanging wire */}
      <div className="relative mx-auto max-w-lg mb-4">
        <div className="h-0.5 w-full bg-stone-700/80 shadow-sm" />
      </div>

      {/* Hanging Polaroid Photos */}
      <div className="flex items-start justify-center gap-6 sm:gap-8 flex-wrap">
        {photos.map((photo) => {
          const isHovered = hoveredId === photo.id;
          return (
            <motion.div
              key={photo.id}
              onMouseEnter={() => setHoveredId(photo.id)}
              onMouseLeave={() => setHoveredId(null)}
              animate={{
                rotate: isHovered ? 0 : photo.rotation,
                y: isHovered ? -10 : 0,
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group relative flex flex-col items-center cursor-pointer"
            >
              {/* Wooden Peg / Clip on Wire */}
              <div className="relative -top-2 z-20 h-5 w-2 rounded-sm bg-amber-700/90 border border-amber-600 shadow-md flex items-center justify-center">
                <div className="h-1 w-1 rounded-full bg-stone-400" />
              </div>

              {/* Polaroid Frame */}
              <div className="relative -mt-2 w-44 rounded-sm bg-stone-100 p-3 pb-5 shadow-2xl text-stone-900 transition-all duration-300">
                {/* Photo Surface */}
                <div className={cn('relative h-36 w-full overflow-hidden rounded-sm bg-gradient-to-tr shadow-inner', photo.gradient)}>
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />
                  <div className="absolute bottom-2 right-2 text-white/70">
                    <Camera className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Hand-written Style Caption */}
                <div className="mt-3 text-center">
                  <div className="font-serif italic font-bold text-xs text-stone-800 tracking-wide">
                    {photo.title}
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                    {photo.location}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

