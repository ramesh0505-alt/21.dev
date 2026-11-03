'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { QrCode, Sparkles, User, ExternalLink } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  strapColor: string;
  avatarSeed: string;
  passType: 'SPEAKER' | 'VIP' | 'ALL ACCESS' | 'CREW' | 'DEV';
}

const DEFAULT_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Sophia Chen', role: 'Staff Design Engineer', strapColor: 'bg-rose-500', avatarSeed: 'sophia', passType: 'ALL ACCESS' },
  { id: '2', name: 'Liam Walker', role: 'Frontend Architect', strapColor: 'bg-blue-500', avatarSeed: 'liam', passType: 'SPEAKER' },
  { id: '3', name: 'Elena Rostova', role: 'Design Systems Lead', strapColor: 'bg-emerald-500', avatarSeed: 'elena', passType: 'VIP' },
  { id: '4', name: 'Marcus Vance', role: 'Creative Developer', strapColor: 'bg-amber-500', avatarSeed: 'marcus', passType: 'DEV' },
  { id: '5', name: 'Aria Patel', role: 'Motion UI Specialist', strapColor: 'bg-purple-500', avatarSeed: 'aria', passType: 'ALL ACCESS' },
  { id: '6', name: 'Julian Thorne', role: 'Graphics & Shaders', strapColor: 'bg-cyan-500', avatarSeed: 'julian', passType: 'CREW' },
];

export function LanyardRoster({
  headline = 'A team roster you can actually flip through.',
  subtitle = 'MEET THE TEAM • ALL-ACCESS BADGES',
  theme = 'light',
  className,
}: {
  headline?: string;
  subtitle?: string;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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

      {/* Wire & Hanging Lanyards */}
      <div className="relative mx-auto max-w-2xl overflow-x-auto pb-4 scrollbar-none px-2">
        {/* Steel suspension cable wire */}
        <div className="relative mx-2 h-1 bg-gradient-to-r from-stone-400 via-stone-300 to-stone-400 rounded-full shadow-inner flex items-center justify-between">
          <div className="h-3 w-3 rounded-full bg-stone-500 border border-stone-300 shadow -ml-1" />
          <div className="h-3 w-3 rounded-full bg-stone-500 border border-stone-300 shadow -mr-1" />
        </div>

        {/* Badges Array */}
        <div className="flex items-start justify-center gap-2 sm:gap-3 px-2 pt-0 min-w-[500px]">
          {DEFAULT_MEMBERS.map((member, idx) => {
            const isHovered = hoveredId === member.id;

            return (
              <motion.div
                key={member.id}
                onMouseEnter={() => setHoveredId(member.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative flex flex-col items-center cursor-pointer"
                animate={{
                  y: isHovered ? -10 : 0,
                  rotate: isHovered ? (idx % 2 === 0 ? 3 : -3) : 0,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              >
                {/* Metallic clip hooked to wire */}
                <div className="h-4 w-1.5 bg-stone-400 border border-stone-300 rounded-sm -mt-1 shadow-sm" />

                {/* Fabric lanyard strap */}
                <div className={cn('h-6 w-3 rounded-t-xs shadow-sm', member.strapColor)} />

                {/* Swivel clip clasp */}
                <div className="h-2 w-2.5 rounded-sm bg-stone-300 border border-stone-400 -mt-0.5" />

                {/* ID Badge Pass Card */}
                <div className="relative mt-0.5 w-16 sm:w-20 h-28 rounded-lg bg-white border border-neutral-300/80 shadow-md p-1.5 flex flex-col justify-between text-neutral-900 group-hover:shadow-xl transition-shadow overflow-hidden">
                  {/* Top lanyard hole */}
                  <div className="h-1 w-4 mx-auto rounded-full bg-neutral-300 mb-1" />

                  {/* Header badge strip */}
                  <div
                    className={cn(
                      'text-[7px] font-mono font-bold tracking-wider text-center text-white rounded-[2px] py-0.5',
                      member.strapColor
                    )}
                  >
                    {member.passType}
                  </div>

                  {/* Member Avatar */}
                  <div className="my-auto flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-700 shadow-inner">
                      {member.name.charAt(0)}
                    </div>
                    <div className="mt-1 font-bold text-[8px] text-neutral-900 truncate max-w-[60px] text-center">
                      {member.name}
                    </div>
                    <div className="text-[6px] font-mono text-neutral-500 truncate max-w-[60px] text-center">
                      {member.role}
                    </div>
                  </div>

                  {/* Bottom barcode / QR */}
                  <div className="flex items-center justify-between border-t border-neutral-200 pt-0.5 px-0.5">
                    <QrCode className="h-2.5 w-2.5 text-neutral-600" />
                    <span className="text-[6px] font-mono text-neutral-400">#00{idx + 1}</span>
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
