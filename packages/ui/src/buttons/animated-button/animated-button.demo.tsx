'use client';

import React, { useState } from 'react';
import { AnimatedButton } from './animated-button';
import { ArrowRight, Sparkles, Download, Check } from 'lucide-react';

export function AnimatedButtonDemo() {
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    }, 1200);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-6">
      <AnimatedButton variant="emerald" shimmer icon={ArrowRight}>
        Get Started
      </AnimatedButton>

      <AnimatedButton variant="primary" icon={Sparkles} iconPosition="left">
        Generate UI
      </AnimatedButton>

      <AnimatedButton
        variant="secondary"
        icon={downloaded ? Check : Download}
        loading={loading}
        onClick={handleDownload}
      >
        {downloaded ? 'Saved!' : 'Download Kit'}
      </AnimatedButton>

      <AnimatedButton variant="outline" size="sm">
        Documentation
      </AnimatedButton>

      <AnimatedButton variant="ghost" size="sm">
        Dismiss
      </AnimatedButton>
    </div>
  );
}

export default AnimatedButtonDemo;

