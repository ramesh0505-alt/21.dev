'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Plus,
  ArrowRight,
  FolderPlus,
  Trash2,
  Sparkles,
  Code2,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { useAdminComponents } from '@/lib/admin-store';
import { ComponentCard } from '@/components/preview/component-card';
import { getCollections, createCollection, UserCollection, getRemixes, deleteRemix, RemixedComponent } from '@/lib/storage';

export default function CollectionsPage() {
  const registry = useAdminComponents();
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [remixes, setRemixes] = useState<RemixedComponent[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  useEffect(() => {
    setCollections(getCollections());
    setRemixes(getRemixes());
    const handleUpdate = () => {
      setCollections(getCollections());
      setRemixes(getRemixes());
    };
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

  const handleCopyRemixCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 mb-2">
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>Workspace Collections</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-serif">Collections & Custom Remixes</h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Custom component stacks and customized variations preserved locally in your browser storage.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 active:scale-95 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Collection</span>
          </button>
        </div>
      </div>

      {/* New Collection Modal / Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderPlus className="h-4 w-4 text-blue-400" />
              <span>Create New Component Collection</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-neutral-400 hover:text-white"
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
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={newColDesc}
              onChange={(e) => setNewColDesc(e.target.value)}
              placeholder="Description (optional)"
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* SECTION: Custom Remixes */}
      {remixes.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Saved Remix Variations ({remixes.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {remixes.map((remix) => (
              <div
                key={remix.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      Custom Remix
                    </span>
                    <button
                      onClick={() => deleteRemix(remix.id)}
                      className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                      title="Delete remix"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-white">{remix.name}</h4>
                  <p className="text-[11px] text-neutral-400">Derived from {remix.originalSlug}</p>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                  <button
                    onClick={() => handleCopyRemixCode(remix.id, remix.customCode)}
                    className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs text-neutral-300 hover:text-white"
                  >
                    {copiedCodeId === remix.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy JSX</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/remix/${remix.originalSlug}`}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Edit in Studio →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION: Stacks & Collections */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FolderGit2 className="h-4 w-4 text-blue-400" />
          <span>Curated Stacks ({collections.length})</span>
        </h2>

        <div className="space-y-6">
          {collections.map((col) => {
            const comps = registry.filter((c) => col.componentSlugs.includes(c.slug));
            return (
              <div
                key={col.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FolderGit2 className="h-4 w-4 text-blue-400" />
                      <span>{col.name}</span>
                    </h3>
                    {col.description && (
                      <p className="text-xs text-neutral-400 mt-0.5">{col.description}</p>
                    )}
                  </div>

                  <div className="text-xs font-mono text-neutral-400">
                    <span className="text-emerald-400 font-semibold">{comps.length}</span> components
                  </div>
                </div>

                {comps.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    {comps.map((c) => (
                      <ComponentCard key={c.id} component={c} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-neutral-800 p-6 text-center text-xs text-neutral-500">
                    This collection is currently empty.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
