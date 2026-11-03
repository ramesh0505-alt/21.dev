'use client';

import React from 'react';
import { ShimmerButton } from './shimmer-button';
import { Sparkles, Zap, Flame } from 'lucide-react';

export function ShimmerButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-8">
      <ShimmerButton shimmerColor="#10b981">
        <Sparkles className="h-4 w-4 text-emerald-400" />
        Emerald Shimmer
      </ShimmerButton>

      <ShimmerButton shimmerColor="#38bdf8" shimmerDuration="3s">
        <Zap className="h-4 w-4 text-sky-400" />
        Electric Cyan
      </ShimmerButton>

      <ShimmerButton shimmerColor="#f59e0b" borderRadius="12px">
        <Flame className="h-4 w-4 text-amber-400" />
        Amber Glow
      </ShimmerButton>
    </div>
  );
}

export default ShimmerButtonDemo;
