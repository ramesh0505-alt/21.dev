'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Component,
  FolderHeart,
  PlaySquare,
  Search,
  Zap,
  Terminal,
  Layers,
  Clock,
  Compass,
} from 'lucide-react';
import { registry } from '@/registry';
import { ComponentCard } from '@/components/preview/component-card';
import { ALL_CATEGORIES } from '@/lib/categories';
import { getRecentlyViewed, getFavorites } from '@/lib/storage';

export default function DashboardPage() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);

  useEffect(() => {
    setRecentSlugs(getRecentlyViewed());
    setFavoriteSlugs(getFavorites());

    const handleUpdate = () => {
      setRecentSlugs(getRecentlyViewed());
      setFavoriteSlugs(getFavorites());
    };
    window.addEventListener('devui_storage_updated', handleUpdate);
    return () => window.removeEventListener('devui_storage_updated', handleUpdate);
  }, []);

  const recentComponents = registry.filter((c) => recentSlugs.includes(c.slug));
  const featuredComponents = registry.slice(0, 6);

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Local-First Personal Component System</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Discover, preview, and export{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
              craft-grade React UI
            </span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Your private offline component workbench inspired by 21st.dev. Zero cloud overhead, instant copyable source code, multi-package manager CLI installation, and complete ZIP package exports.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/elements"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
            >
              <Component className="h-4 w-4" />
              <span>Browse All Elements</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/playground"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-5 py-2.5 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white transition-all"
            >
              <PlaySquare className="h-4 w-4 text-emerald-400" />
              <span>Interactive Playground</span>
            </Link>

            <Link
              href="/animations"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all"
            >
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Motion Showcase</span>
            </Link>
          </div>
        </div>

        {/* Metric Badges Strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-800/80 pt-6">
          <div className="space-y-1">
            <div className="font-mono text-2xl font-bold text-white">{registry.length}</div>
            <div className="text-xs text-slate-400">Production Components</div>
          </div>
          <div className="space-y-1">
            <div className="font-mono text-2xl font-bold text-emerald-400">100%</div>
            <div className="text-xs text-slate-400">Local-first & Offline</div>
          </div>
          <div className="space-y-1">
            <div className="font-mono text-2xl font-bold text-white">4 Types</div>
            <div className="text-xs text-slate-400">pnpm, npm, yarn, bun</div>
          </div>
          <div className="space-y-1">
            <div className="font-mono text-2xl font-bold text-sky-400">ZIP Export</div>
            <div className="text-xs text-slate-400">Self-Contained Bundles</div>
          </div>
        </div>
      </section>

      {/* Recently Viewed (if any) */}
      {recentComponents.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Recently Inspected</h2>
            </div>
            <Link
              href="/recent"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View history →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentComponents.slice(0, 3).map((comp) => (
              <ComponentCard key={comp.id} component={comp} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Components Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Trending & Ready Components</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Interact directly with live working components before copying or exporting.
            </p>
          </div>

          <Link
            href="/elements"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            <span>Browse All ({registry.length})</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredComponents.map((comp) => (
            <ComponentCard key={comp.id} component={comp} />
          ))}
        </div>
      </section>

      {/* Explore Categories Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Compass className="h-4 w-4 text-emerald-400" />
            <span>Component Directory by Category</span>
          </h2>
          <Link
            href="/elements"
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            All categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {ALL_CATEGORIES.slice(0, 12).map((cat) => {
            const count = registry.filter(
              (r) => r.category.toLowerCase() === cat.name.toLowerCase()
            ).length;
            return (
              <Link
                key={cat.slug}
                href={`/elements/${cat.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-3.5 transition-all hover:border-emerald-500/40 hover:bg-slate-900/90"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </div>
                  <div className="mt-1 line-clamp-2 text-[10px] text-slate-400 leading-tight">
                    {cat.description}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] font-mono">
                  <span className={count > 0 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                    {count} {count === 1 ? 'item' : 'items'}
                  </span>
                  <ArrowRight className="h-3 w-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
