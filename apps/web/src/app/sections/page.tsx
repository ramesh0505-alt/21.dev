'use client';

import React from 'react';
import { Layers, ArrowRight, LayoutTemplate, PlusCircle, Check, Copy } from 'lucide-react';
import { useAdminComponents, useAdminSections } from '@/lib/admin-store';
import { ComponentCard } from '@/components/preview/component-card';
import Link from 'next/link';

export default function SectionsPage() {
  const registry = useAdminComponents();
  const customSections = useAdminSections();

  const sectionComponents = registry.filter(
    (c) =>
      c.section === 'sections' ||
      c.type === 'section' ||
      c.tags.some((t) => ['sections', 'hero', 'landing', 'features', 'bento'].includes(t))
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 mb-2">
            <LayoutTemplate className="h-3.5 w-3.5" />
            <span>Layout Building Blocks</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-serif">
            Website Sections
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Pre-assembled section structures: Hero headlines, feature bento grids, and technical overview sections.
            Synchronized live with the Admin Studio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/sections"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span>Manage Sections</span>
          </Link>
          <div className="font-mono text-xs text-slate-400">
            <span className="text-emerald-400 font-bold">{sectionComponents.length}</span> Component Sections
          </div>
        </div>
      </div>

      {/* Custom Curated Section Compositions */}
      {customSections.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono text-slate-400 uppercase tracking-wider">
              Curated Layout Compositions ({customSections.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customSections.map((sec) => (
              <div
                key={sec.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {sec.category}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {sec.componentSlugs.length} components
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-white">{sec.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mt-1">
                    {sec.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {sec.componentSlugs.map((slug) => (
                      <span
                        key={slug}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-emerald-400 border border-slate-700"
                      >
                        {slug}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <Link
                    href={`/templates`}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                  >
                    <span>View in Templates</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual Section Components Grid */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="text-sm font-mono text-slate-400 uppercase tracking-wider">
          Section Primitives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sectionComponents.map((component) => (
            <div key={component.id} className="col-span-1 md:col-span-2">
              <ComponentCard component={component} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
