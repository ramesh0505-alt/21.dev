'use client';

import React from 'react';
import { ClothingRail } from './clothing-rail';

export function ClothingRailDemo() {
  return (
    <div className="w-full">
      <ClothingRail showCta={false} />
    </div>
  );
}

export function ClothingRailCardPreview() {
  return (
    <div className="w-full bg-white text-neutral-900 rounded-xl overflow-hidden py-4 px-2 scale-[0.85] origin-center">
      <ClothingRail theme="light" showCta={true} />
    </div>
  );
}
