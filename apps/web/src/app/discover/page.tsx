'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Sparkles,
  ArrowUpDown,
  Component as ComponentIcon,
  Check,
  Bookmark,
  Layers,
} from 'lucide-react';
import { useAdminComponents } from '@/lib/admin-store';
import { ComponentCard } from '@/components/preview/component-card';
import { ComponentModal } from '@/components/preview/component-modal';
import { ComponentMeta } from '@/types/registry';
import { getFavorites } from '@/lib/storage';

export default function DiscoverPage() {
  const registry = useAdminComponents();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTech, setSelectedTech] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'name' | 'saved'>('trending');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedComponent, setSelectedComponent] = useState<ComponentMeta | null>(null);

  // Extract categories & technologies
  const categories = useMemo(() => {
    const set = new Set<string>();
    registry.forEach((c) => set.add(c.category));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const technologies = ['All', 'React 19', 'Tailwind CSS', 'Motion'];

  const filteredComponents = useMemo(() => {
    let result = registry.filter((c) => {
      const matchesSearch =
        !search.trim() ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || c.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesStatus =
        selectedStatus === 'All' || c.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [search, selectedCategory, selectedStatus, sortBy]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-0.5 text-xs font-medium text-blue-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curated Visual Discovery</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Component Discovery</h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-1 max-w-2xl">
            Explore hundreds of verified React UI components. Inspect in real time, customize properties, and copy directly into your workspace.
          </p>
        </div>

        {/* View mode toggle & item counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-900 p-1">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <div className="font-mono text-xs text-neutral-400">
            <span className="text-emerald-400 font-bold">{filteredComponents.length}</span> components
          </div>
        </div>
      </div>

      {/* Filter Bar & Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, tag, or description..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-300 outline-none hover:border-neutral-700 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Ready">Ready</option>
            <option value="Prototype">Prototype</option>
            <option value="Reference">Reference</option>
          </select>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-300 outline-none hover:border-neutral-700 cursor-pointer"
          >
            <option value="trending">Sort: Trending</option>
            <option value="newest">Sort: Newest</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Horizontal Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white text-black font-semibold'
                  : 'border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Gallery Cards Grid / List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredComponents.map((comp) => (
            <ComponentCard
              key={comp.id}
              component={comp}
              onSelect={(c) => setSelectedComponent(c)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComponents.map((comp) => (
            <div
              key={comp.id}
              onClick={() => setSelectedComponent(comp)}
              className="group flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 hover:border-neutral-700 hover:bg-neutral-900/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-950 border border-neutral-800 text-blue-400">
                  <ComponentIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {comp.name}
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-1">{comp.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-[10px] font-mono text-neutral-300">
                  {comp.category}
                </span>
                <span className="font-mono text-xs text-emerald-400">{comp.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Component Modal */}
      <ComponentModal
        component={selectedComponent}
        onClose={() => setSelectedComponent(null)}
      />
    </div>
  );
}

