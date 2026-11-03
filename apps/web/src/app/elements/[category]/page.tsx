'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Component, FolderPlus, ExternalLink } from 'lucide-react';
import { registry } from '@/registry';
import { ComponentCard } from '@/components/preview/component-card';
import { getCategoryBySlug, ALL_CATEGORIES } from '@/lib/categories';

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.category;

  const categoryInfo = getCategoryBySlug(categorySlug);
  const categoryName = categoryInfo ? categoryInfo.name : categorySlug.replace(/-/g, ' ');

  const components = registry.filter(
    (item) => item.category.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div>
        <Link
          href="/elements"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Elements</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 mb-2">
              <Component className="h-3.5 w-3.5" />
              <span className="capitalize">{categoryInfo?.section || 'elements'}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white capitalize">{categoryName}</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {categoryInfo?.description || `Explore ${categoryName} components in your library.`}
            </p>
          </div>

          <div className="font-mono text-xs text-slate-400">
            <span className="text-emerald-400 font-bold">{components.length}</span> components registered
          </div>
        </div>
      </div>

      {/* Component Grid or Empty State */}
      {components.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map((comp) => (
            <ComponentCard key={comp.id} component={comp} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
            <FolderPlus className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-100">No components in this category yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            As per library policy, this category folder remains clean without fake implementations until real components are added to:
          </p>
          <div className="rounded-lg bg-slate-950 p-3 font-mono text-[11px] text-emerald-400/90 border border-slate-800">
            packages/ui/src/{categorySlug}/
          </div>
          <div className="pt-2">
            <Link
              href="/elements"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <span>Explore Active Categories</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

