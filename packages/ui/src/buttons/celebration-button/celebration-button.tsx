'use client';

import React, { useState, useRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Sparkles, Trophy } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CelebrationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  particleColors?: string[];
  particleCount?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

export function CelebrationButton({
  children = 'Level Up!',
  particleColors = ['#ffffff', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#38bdf8'],
  particleCount = 32,
  className,
  onClick,
  ...props
}: CelebrationButtonProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [active, setActive] = useState(false);
  const nextId = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActive(true);
    setTimeout(() => setActive(false), 600);

    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (i * (360 / particleCount) * Math.PI) / 180;
      const distance = 55 + (i % 5) * 14;
      const x = Math.round(Math.cos(angle) * distance);
      const y = Math.round(Math.sin(angle) * distance);
      const rotation = (i * 27) % 360;
      const color = particleColors[i % particleColors.length];

      newParticles.push({
        id: nextId.current++,
        x,
        y,
        rotation,
        color,
      });
    }

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 900);

    onClick?.(e);
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <button
        onClick={handleClick}
        className={cn(
          'relative z-10 flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-100 px-6 py-3 font-semibold text-neutral-900 shadow-xl transition-all duration-150 active:scale-95 hover:-translate-y-0.5 cursor-pointer',
          active && 'ring-4 ring-purple-500/30',
          className
        )}
        {...props}
      >
        <Sparkles className="h-4 w-4 text-purple-600 animate-pulse" />
        <span>{children}</span>
      </button>

      {/* Particle Explosions matching celebration-button.html */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="pointer-events-none absolute z-20 h-2 w-2 rounded-xs"
          style={{
            backgroundColor: p.color,
            transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`,
            transition: 'all 800ms cubic-bezier(0.2, 0.9, 0.3, 1)',
            opacity: active ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}
