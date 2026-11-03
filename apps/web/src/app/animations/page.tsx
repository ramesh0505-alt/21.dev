'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Play, Cpu, Zap, Activity } from 'lucide-react';
import { registry } from '@/registry';
import { ComponentCard } from '@/components/preview/component-card';

export default function AnimationsPage() {
  const animationComponents = registry.filter(
    (c) =>
      c.section === 'animations' ||
      c.tags.some((t) => ['motion', 'animation', 'shimmer', 'cursor', 'spring'].includes(t))
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-medium text-amber-400 mb-2">
            <Zap className="h-3.5 w-3.5" />
            <span>Motion & Physics Engine</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Animations & Micro-Interactions</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Spring physics, shimmer beams, and smooth transitions built with Motion and CSS transforms.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Activity className="h-4 w-4 text-emerald-400" />
          <span>60 FPS Hardware-Accelerated</span>
        </div>
      </div>

      {/* Grid of Animation Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animationComponents.map((component) => (
          <ComponentCard key={component.id} component={component} />
        ))}
      </div>
    </div>
  );
}
