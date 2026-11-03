'use client';

import React from 'react';
import { TextShimmer } from './text-shimmer';

export function TextShimmerDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono">
        <TextShimmer duration={2}>✨ Introducing Antigravity Component System</TextShimmer>
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-white max-w-lg">
        Build high-performance web applications with{' '}
        <TextShimmer as="span" duration={3} className="font-extrabold">
          zero friction and pristine design.
        </TextShimmer>
      </h2>
    </div>
  );
}

export default TextShimmerDemo;

