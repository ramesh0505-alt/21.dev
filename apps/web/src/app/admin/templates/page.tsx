'use client';

import React, { useState, useMemo } from 'react';
import {
  AppWindow,
  Plus,
  Search,
  Trash2,
  Edit,
  Check,
  X,
  Layers,
  FileCode,
} from 'lucide-react';
import {
  useAdminTemplates,
  saveAdminTemplate,
  deleteAdminTemplate,
  useAdminComponents,
  AdminTemplate,
} from '@/lib/admin-store';

export default function AdminTemplatesPage() {
  const templates = useAdminTemplates();
  const components = useAdminComponents();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AdminTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    slug: string;
    description: string;
    framework: string;
    pages: string;
    componentSlugs: string[];
    status: 'draft' | 'published' | 'archived';
  }>({
    id: '',
    name: '',
    slug: '',
    description: '',
    framework: 'Next.js 15 + React 19',
    pages: 'Landing, Features, Pricing',
    componentSlugs: [],
    status: 'published',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.framework.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [templates, search, statusFilter]);

  const openAddModal = () => {
    setEditingTemplate(null);
    setFormData({
      id: 'tpl-' + Date.now(),
      name: '',
      slug: '',
      description: '',
      framework: 'Next.js 15 + React 19',
      pages: 'Landing, Features, Pricing',
      componentSlugs: [],
      status: 'published',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tpl: AdminTemplate) => {
    setEditingTemplate(tpl);
    setFormData({
      id: tpl.id,
      name: tpl.name,
      slug: tpl.slug,
      description: tpl.description,
      framework: tpl.framework,
      pages: tpl.pages.join(', '),
      componentSlugs: [...tpl.componentSlugs],
      status: tpl.status,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleToggleComponent = (slug: string) => {
    setFormData((prev) => {
      const exists = prev.componentSlugs.includes(slug);
      return {
        ...prev,
        componentSlugs: exists
          ? prev.componentSlugs.filter((s) => s !== slug)
          : [...prev.componentSlugs, slug],
      };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Template name is required.');
      return;
    }
    const finalSlug = formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const pagesArray = formData.pages
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const newTemplate: AdminTemplate = {
      id: formData.id,
      name: formData.name.trim(),
      slug: finalSlug,
      description: formData.description.trim(),
      framework: formData.framework.trim(),
      pages: pagesArray.length > 0 ? pagesArray : ['Landing'],
      componentSlugs: formData.componentSlugs,
      status: formData.status,
      createdAt: editingTemplate ? editingTemplate.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveAdminTemplate(newTemplate);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteAdminTemplate(id);
    setTemplateToDelete(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Full-Stack Kits
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
            Template Architecture Studio
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Configure complete turn-key multi-page application templates combining registered heros, bento grids, and dynamic galleries.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 text-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Template</span>
        </button>
      </div>

      {/* Controls: Search & Status Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search templates..."
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

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="p-5 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 hover:border-neutral-700 transition-colors flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-emerald-400 border border-neutral-700">
                  {tpl.framework}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                    tpl.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : tpl.status === 'draft'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-neutral-800 text-neutral-500 border-neutral-700'
                  }`}
                >
                  {tpl.status}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white">{tpl.name}</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                {tpl.description}
              </p>

              {/* Pages included */}
              <div className="mt-3 flex flex-wrap gap-1">
                {tpl.pages.map((p) => (
                  <span key={p} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                    {p}
                  </span>
                ))}
              </div>

              {/* Included Components */}
              <div className="mt-3 pt-3 border-t border-neutral-800/80">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2">
                  Integrated Primitives ({tpl.componentSlugs.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tpl.componentSlugs.map((slug) => (
                    <span
                      key={slug}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800/80 text-neutral-300 border border-neutral-700"
                    >
                      {slug}
                    </span>
                  ))}
                  {tpl.componentSlugs.length === 0 && (
                    <span className="text-[11px] text-neutral-500 italic">No components attached</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => openEditModal(tpl)}
                className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title="Edit Template"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTemplateToDelete(tpl.id)}
                className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                title="Delete Template"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-16 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
            No templates match the current query.
          </div>
        )}
      </div>

      {/* Modal: Create / Edit Template */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0D1322] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-semibold text-white">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
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
                <label className="block text-slate-300 mb-1">Template Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Modern SaaS Developer Landing"
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
                  <label className="block text-slate-300 mb-1">Framework</label>
                  <input
                    type="text"
                    value={formData.framework}
                    onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Next.js 15 + React 19"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Pages (comma separated)</label>
                <input
                  type="text"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Landing, Features, Pricing, Docs"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Overview of layout flow, target audience and architectural features..."
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

              {/* Attach components */}
              <div>
                <label className="block text-slate-300 mb-1.5">
                  Select Integrated Components ({formData.componentSlugs.length} selected)
                </label>
                <div className="max-h-36 overflow-y-auto border border-slate-800 rounded-lg p-2 bg-slate-950 space-y-1">
                  {components.map((c) => {
                    const isSelected = formData.componentSlugs.includes(c.slug);
                    return (
                      <button
                        type="button"
                        key={c.slug}
                        onClick={() => handleToggleComponent(c.slug)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'hover:bg-slate-900 text-slate-400'
                        }`}
                      >
                        <span className="font-mono">{c.name}</span>
                        {isSelected && <Check className="h-3 w-3 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
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
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {templateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0D1322] border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-white">Delete Template?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove this template definition? This action is saved locally and logged in activity history.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setTemplateToDelete(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 text-xs hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(templateToDelete)}
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
