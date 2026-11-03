'use client';

import React from 'react';
import { MagneticButton } from './magnetic-button';
import { Compass, Sparkles, MoveRight } from 'lucide-react';

export function MagneticButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-8">
      <MagneticButton variant="emerald">
        <Compass className="h-4 w-4" />
        Attract Cursor
      </MagneticButton>

      <MagneticButton variant="outline" magneticStrength={0.5}>
        <Sparkles className="h-4 w-4 text-emerald-400" />
        Strong Magnetism
      </MagneticButton>

      <MagneticButton variant="slate" magneticStrength={0.2}>
        Subtle Spring
        <MoveRight className="h-4 w-4 text-slate-400" />
      </MagneticButton>
    </div>
  );
}

export default MagneticButtonDemo;

