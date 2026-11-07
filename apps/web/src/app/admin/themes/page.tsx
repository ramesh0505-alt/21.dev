'use client';

import React, { useState, useMemo } from 'react';
import {
  Palette,
  Plus,
  Search,
  Trash2,
  Edit,
  Check,
  X,
  Sliders,
} from 'lucide-react';
import {
  useAdminThemes,
  saveAdminTheme,
  deleteAdminTheme,
  AdminTheme,
} from '@/lib/admin-store';

export default function AdminThemesPage() {
  const themes = useAdminThemes();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<AdminTheme | null>(null);
  const [themeToDelete, setThemeToDelete] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    slug: string;
    description: string;
    bg: string;
    surface: string;
    border: string;
    accent: string;
    status: 'draft' | 'published' | 'archived';
  }>({
    id: '',
    name: '',
    slug: '',
    description: '',
    bg: '#0B0F19',
    surface: '#111827',
    border: '#1E293B',
    accent: '#10B981',
    status: 'published',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const filteredThemes = useMemo(() => {
    return themes.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [themes, search, statusFilter]);

  const openAddModal = () => {
    setEditingTheme(null);
    setFormData({
      id: 'thm-' + Date.now(),
      name: '',
      slug: '',
      description: '',
      bg: '#0B0F19',
      surface: '#111827',
      border: '#1E293B',
      accent: '#10B981',
      status: 'published',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (thm: AdminTheme) => {
    setEditingTheme(thm);
    setFormData({
      id: thm.id,
      name: thm.name,
      slug: thm.slug,
      description: thm.description,
      bg: thm.bg,
      surface: thm.surface,
      border: thm.border,
      accent: thm.accent,
      status: thm.status,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Theme name is required.');
      return;
    }
    const finalSlug = formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newTheme: AdminTheme = {
      id: formData.id,
      name: formData.name.trim(),
      slug: finalSlug,
      description: formData.description.trim(),
      bg: formData.bg.trim(),
      surface: formData.surface.trim(),
      border: formData.border.trim(),
      accent: formData.accent.trim(),
      status: formData.status,
      createdAt: editingTheme ? editingTheme.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveAdminTheme(newTheme);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteAdminTheme(id);
    setThemeToDelete(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Color Token Governance
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
            Theme Management Studio
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Configure system palettes, background tokens, surface contrasts, and brand accent colors across the developer workspace.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 text-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Theme</span>
        </button>
      </div>

      {/* Controls: Search & Status Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search themes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {(['all', 'published', 'draft', 'archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1.5 rounded-lg border capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredThemes.map((thm) => (
          <div
            key={thm.id}
            className="p-5 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 hover:border-neutral-700 transition-colors flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                {/* Swatches preview */}
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: thm.bg }} title="Canvas" />
                  <div className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: thm.surface }} title="Surface" />
                  <div className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: thm.border }} title="Border" />
                  <div className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: thm.accent }} title="Accent" />
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                    thm.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : thm.status === 'draft'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-neutral-800 text-neutral-500 border-neutral-700'
                  }`}
                >
                  {thm.status}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white">{thm.name}</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                {thm.description}
              </p>

              {/* Tokens Table */}
              <div className="mt-4 pt-3 border-t border-neutral-800/80 grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="flex items-center justify-between p-1.5 rounded bg-neutral-800/60 border border-neutral-700">
                  <span className="text-neutral-400">Canvas</span>
                  <span className="text-slate-200">{thm.bg}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-neutral-800/60 border border-neutral-700">
                  <span className="text-neutral-400">Accent</span>
                  <span className="text-emerald-400">{thm.accent}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => openEditModal(thm)}
                className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title="Edit Theme"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setThemeToDelete(thm.id)}
                className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                title="Delete Theme"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredThemes.length === 0 && (
          <div className="col-span-full py-16 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
            No themes match the current query.
          </div>
        )}
      </div>

      {/* Modal: Create / Edit Theme */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0D1322] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-semibold text-white">
                {editingTheme ? 'Edit Theme' : 'Create New Theme'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Theme Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Cyber Spruce"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="auto-generated-if-empty"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'draft' | 'published' | 'archived',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Intended aesthetics and target device profiles..."
                />
              </div>

              {/* Color hex inputs */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-300 mb-1">Canvas Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.bg}
                      onChange={(e) => setFormData({ ...formData, bg: e.target.value })}
                      className="h-8 w-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.bg}
                      onChange={(e) => setFormData({ ...formData, bg: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Surface Card</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.surface}
                      onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                      className="h-8 w-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.surface}
                      onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Border Token</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.border}
                      onChange={(e) => setFormData({ ...formData, border: e.target.value })}
                      className="h-8 w-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.border}
                      onChange={(e) => setFormData({ ...formData, border: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Accent Phosphor</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accent}
                      onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                      className="h-8 w-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.accent}
                      onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold"
                >
                  Save Theme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {themeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0D1322] border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-white">Delete Theme?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove this theme? This action is saved locally and logged in activity history.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setThemeToDelete(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 text-xs hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(themeToDelete)}
                className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
