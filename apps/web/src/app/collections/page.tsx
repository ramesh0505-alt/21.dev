'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FolderGit2, Plus, ArrowRight, FolderPlus, Component, X } from 'lucide-react';
import { registry } from '@/registry';
import { ComponentCard } from '@/components/preview/component-card';
import { getCollections, createCollection, UserCollection } from '@/lib/storage';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');

  useEffect(() => {
    setCollections(getCollections());
    const handleUpdate = () => setCollections(getCollections());
    window.addEventListener('devui_storage_updated', handleUpdate);
    return () => window.removeEventListener('devui_storage_updated', handleUpdate);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    createCollection(newColName.trim(), newColDesc.trim());
    setNewColName('');
    setNewColDesc('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 mb-2">
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>Project Bundles</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Personal Collections</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Organize UI elements into project stacks, design system groupings, and client deliverable sets.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Collection</span>
          </button>
        </div>
      </div>

      {/* New Collection Modal / Inline Card */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-emerald-500/40 bg-slate-900/90 p-6 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderPlus className="h-4 w-4 text-emerald-400" />
              <span>Create New Component Collection</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              placeholder="Collection Name (e.g. Mobile E-commerce Stack)"
              required
              className="rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              value={newColDesc}
              onChange={(e) => setNewColDesc(e.target.value)}
              placeholder="Description (optional)"
              className="rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Collections List */}
      <div className="space-y-8">
        {collections.map((col) => {
          const comps = registry.filter((c) => col.componentSlugs.includes(c.slug));
          return (
            <div
              key={col.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="h-4 w-4 text-emerald-400" />
                    <span>{col.name}</span>
                  </h3>
                  {col.description && (
                    <p className="text-xs text-slate-400 mt-0.5">{col.description}</p>
                  )}
                </div>

                <div className="text-xs font-mono text-slate-400">
                  <span className="text-emerald-400 font-semibold">{comps.length}</span> components
                </div>
              </div>

              {comps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  {comps.map((c) => (
                    <ComponentCard key={c.id} component={c} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-500">
                  This collection is empty. Bookmark components to populate it.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

