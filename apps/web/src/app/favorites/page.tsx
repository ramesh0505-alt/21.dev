'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Sparkles, ArrowRight, Component } from 'lucide-react';
import { registry } from '@/registry';
import { ComponentCard } from '@/components/preview/component-card';
import { getFavorites } from '@/lib/storage';

export default function FavoritesPage() {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteSlugs(getFavorites());
    const handleUpdate = () => setFavoriteSlugs(getFavorites());
    window.addEventListener('devui_storage_updated', handleUpdate);
    return () => window.removeEventListener('devui_storage_updated', handleUpdate);
  }, []);

  const favoriteComponents = registry.filter((c) => favoriteSlugs.includes(c.slug));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-0.5 text-xs font-medium text-rose-400 mb-2">
            <Heart className="h-3.5 w-3.5 fill-rose-400" />
            <span>Personal Bookmarks</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Favorite Components</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Quick access to your starred components saved across browser sessions.
          </p>
        </div>

        <div className="font-mono text-xs text-slate-400">
          <span className="text-rose-400 font-bold">{favoriteComponents.length}</span> Starred
        </div>
      </div>

      {favoriteComponents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteComponents.map((component) => (
            <ComponentCard key={component.id} component={component} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-500">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">No favorites saved yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click the heart icon on any component card or component detail page to bookmark it here for quick reuse.
          </p>
          <div className="pt-2">
            <Link
              href="/elements"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              <span>Explore Components</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
