'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Trash2, ArrowRight } from 'lucide-react';
import { registry } from '@/registry';
import { ComponentCard } from '@/components/preview/component-card';
import { getRecentlyViewed } from '@/lib/storage';

export default function RecentPage() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    setRecentSlugs(getRecentlyViewed());
    const handleUpdate = () => setRecentSlugs(getRecentlyViewed());
    window.addEventListener('devui_storage_updated', handleUpdate);
    return () => window.removeEventListener('devui_storage_updated', handleUpdate);
  }, []);

  const recentComponents = registry.filter((c) => recentSlugs.includes(c.slug));

  const handleClear = () => {
    localStorage.removeItem('devui_recent');
    setRecentSlugs([]);
    window.dispatchEvent(new Event('devui_storage_updated'));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 mb-2">
            <Clock className="h-3.5 w-3.5" />
            <span>Inspection History</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Recently Viewed</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Quickly return to components you have inspected, customized, or copied.
          </p>
        </div>

        {recentComponents.length > 0 && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {recentComponents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentComponents.map((component) => (
            <ComponentCard key={component.id} component={component} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-500">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">No recent activity</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Components you view will automatically appear here for easy reference.
          </p>
          <div className="pt-2">
            <Link
              href="/elements"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
