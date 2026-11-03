'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Layers, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { registry } from '@/registry';
import { ComponentCard } from '@/components/preview/component-card';
import { ComponentStatus } from '@/types/registry';

export default function ElementsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Extract distinct categories present in registry
  const categories = useMemo(() => {
    const set = new Set<string>();
    registry.forEach((item) => set.add(item.category));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const statuses = ['All', 'Ready', 'Prototype', 'Reference', 'Inbox'];

  const filteredComponents = useMemo(() => {
    return registry.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        item.dependencies.some((d) => d.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesStatus =
        selectedStatus === 'All' || item.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 mb-2">
            <Layers className="h-3.5 w-3.5" />
            <span>Component Catalog</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">All UI Elements</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse, test, copy, and export production React components from your personal registry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-mono text-slate-300">
            Showing <span className="text-emerald-400 font-bold">{filteredComponents.length}</span> of {registry.length}
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by component name, tags, or dependencies..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Status Selector */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-500 hidden sm:block" />
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/80 p-1 text-xs">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`rounded-lg px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-slate-800 text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/20'
                  : 'border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Component Cards Grid */}
      {filteredComponents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => (
            <ComponentCard key={component.id} component={component} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-slate-500">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">No components found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or filters. Check the category folders in packages/ui/src/ to add new components.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
            className="inline-flex rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:text-white"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

