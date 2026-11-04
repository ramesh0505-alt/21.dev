'use client';

import React from 'react';
import { Layers, ArrowRight, LayoutTemplate } from 'lucide-react';
import { useAdminComponents } from '@/lib/admin-store';
import { ComponentCard } from '@/components/preview/component-card';

export default function SectionsPage() {
  const registry = useAdminComponents();
  const sectionComponents = registry.filter(
    (c) =>
      c.section === 'sections' ||
      c.tags.some((t) => ['sections', 'hero', 'landing', 'features', 'bento'].includes(t))
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-0.5 text-xs font-medium text-sky-400 mb-2">
            <LayoutTemplate className="h-3.5 w-3.5" />
            <span>Layout Building Blocks</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Website Sections</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Pre-assembled section structures: Hero headlines, feature bento grids, and technical overview sections.
          </p>
        </div>

        <div className="font-mono text-xs text-slate-400">
          <span className="text-emerald-400 font-bold">{sectionComponents.length}</span> Sections Ready
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sectionComponents.map((component) => (
          <div key={component.id} className="col-span-1 md:col-span-2">
            <ComponentCard component={component} />
          </div>
        ))}
      </div>
    </div>
  );
}

