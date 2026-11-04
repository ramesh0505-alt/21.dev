'use client';

import React from 'react';
import { TextRotate } from './text-rotate';

const words = ['extraordinary', 'unforgettable', 'hyper-tactile', 'production-ready', 'beautiful'];

export function TextRotateDemo() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center select-none">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 flex-wrap justify-center">
        <span>Build</span>
        <span className="rounded-xl bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-purple-400">
          <TextRotate texts={words} rotationInterval={2200} />
        </span>
        <span>interfaces.</span>
      </h2>
      <p className="text-xs text-neutral-400 font-mono mt-3">
        Zero layout shift kinetic text rotator
      </p>
    </div>
  );
}
