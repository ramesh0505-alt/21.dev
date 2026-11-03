'use client';

import React from 'react';
import { HeroGeometric } from './hero-geometric';

export function HeroGeometricDemo() {
  return (
    <div className="w-full">
      <HeroGeometric
        badge="Engineered with Next.js 15 & Motion"
        title="Supercharge your development with"
        highlightedText="Battle-Tested React Components"
        description="A private, local-first library inspired by 21st.dev. Preview, configure, copy and export production-grade components straight into your projects."
        primaryCta={{ label: 'Explore 24+ Components' }}
        secondaryCta={{ label: 'View Source Code' }}
        command="pnpm add @ui-library/ui"
      />
    </div>
  );
}

export default HeroGeometricDemo;

