'use client';

import React, { useState, useMemo } from 'react';
import {
  LayoutTemplate,
  Plus,
  Search,
  Trash2,
  Edit,
  Check,
  X,
  Layers,
  Filter,
} from 'lucide-react';
import {
  useAdminSections,
  saveAdminSection,
  deleteAdminSection,
  useAdminComponents,
  AdminSection,
} from '@/lib/admin-store';

export default function AdminSectionsPage() {
  const sections = useAdminSections();
  const components = useAdminComponents();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<AdminSection | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    slug: string;
    category: string;
    description: string;
    componentSlugs: string[];
    status: 'draft' | 'published' | 'archived';
  }>({
    id: '',
    name: '',
    slug: '',
    category: 'Hero',
    description: '',
    componentSlugs: [],
    status: 'published',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const filteredSections = useMemo(() => {
    return sections.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sections, search, statusFilter]);

  const openAddModal = () => {
    setEditingSection(null);
    setFormData({
      id: 'sec-' + Date.now(),
      name: '',
      slug: '',
      category: 'Hero',
      description: '',
      componentSlugs: [],
      status: 'published',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sec: AdminSection) => {
    setEditingSection(sec);
    setFormData({
      id: sec.id,
      name: sec.name,
      slug: sec.slug,
      category: sec.category,
      description: sec.description,
      componentSlugs: [...sec.componentSlugs],
      status: sec.status,
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
      setFormError('Section name is required.');
      return;
    }
    const finalSlug = formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newSection: AdminSection = {
      id: formData.id,
      name: formData.name.trim(),
      slug: finalSlug,
      category: formData.category,
      description: formData.description.trim(),
      componentSlugs: formData.componentSlugs,
      status: formData.status,
      createdAt: editingSection ? editingSection.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveAdminSection(newSection);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteAdminSection(id);
    setSectionToDelete(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Layout Compositions
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
            Sections Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Compose, curate, and configure multi-component layout sections (Heros, Feature Bento Grids, Social Proof Banners).
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 text-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Section</span>
        </button>
      </div>

      {/* Controls: Search & Status Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search sections..."
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

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSections.map((sec) => (
          <div
            key={sec.id}
            className="p-5 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 hover:border-neutral-700 transition-colors flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {sec.category}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                    sec.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : sec.status === 'draft'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-neutral-800 text-neutral-500 border-neutral-700'
                  }`}
                >
                  {sec.status}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white">{sec.name}</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                {sec.description}
              </p>

              {/* Child components */}
              <div className="mt-4 pt-3 border-t border-neutral-800/80">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2">
                  Composition Components ({sec.componentSlugs.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sec.componentSlugs.map((slug) => (
                    <span
                      key={slug}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800/80 text-emerald-400 border border-neutral-700"
                    >
                      {slug}
                    </span>
                  ))}
                  {sec.componentSlugs.length === 0 && (
                    <span className="text-[11px] text-neutral-500 italic">No components attached</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => openEditModal(sec)}
                className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title="Edit Section"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setSectionToDelete(sec.id)}
                className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                title="Delete Section"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="col-span-full py-16 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
            No sections match the current query.
          </div>
        )}
      </div>

      {/* Modal: Create / Edit Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0D1322] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-semibold text-white">
                {editingSection ? 'Edit Section' : 'Create New Section'}
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
                <label className="block text-slate-300 mb-1">Section Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Hero Geometric Suite"
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
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Hero">Hero</option>
                    <option value="Features">Features</option>
                    <option value="Testimonials">Testimonials</option>
                    <option value="Pricing">Pricing</option>
                    <option value="Galleries">Galleries</option>
                    <option value="CTA">Call To Action</option>
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
                  placeholder="Brief description of layout flow and purpose..."
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
                  Select Child Components ({formData.componentSlugs.length} selected)
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
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {sectionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0D1322] border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-white">Delete Section?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove this section? This action is saved locally and logged in activity history.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSectionToDelete(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 text-xs hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(sectionToDelete)}
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
