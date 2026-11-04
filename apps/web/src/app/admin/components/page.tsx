'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  ExternalLink,
  RotateCcw,
  LayoutGrid,
  List,
  Check,
  X,
  Code2,
  Sparkles,
} from 'lucide-react';
import {
  useAdminComponents,
  useAdminCategories,
  getCustomComponents,
  getDeletedComponentSlugs,
  saveAdminComponent,
  deleteAdminComponent,
  resetAllComponents,
} from '@/lib/admin-store';
import { ComponentMeta, ComponentStatus, SectionType } from '@/types/registry';
import { componentDemos } from '@/registry';

export default function AdminComponentsPage() {
  const components = useAdminComponents();
  const categories = useAdminCategories();
  const customComponents = getCustomComponents();
  const deletedSlugs = getDeletedComponentSlugs();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<ComponentMeta | null>(null);
  const [componentToDelete, setComponentToDelete] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    slug: string;
    category: string;
    section: SectionType;
    status: ComponentStatus;
    description: string;
    tags: string;
    dependencies: string;
    previewReference: string;
    componentCode: string;
    demoCode: string;
  }>({
    id: '',
    name: '',
    slug: '',
    category: 'Buttons',
    section: 'elements',
    status: 'Ready',
    description: '',
    tags: 'react, tailwind, ui',
    dependencies: 'lucide-react, motion',
    previewReference: 'animated-button',
    componentCode: `import React from 'react';\n\nexport function CustomComponent() {\n  return (\n    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-center">\n      <h3 className="font-bold text-white">Custom Component</h3>\n      <p className="text-xs text-neutral-400 mt-1">Ready for production</p>\n    </div>\n  );\n}`,
    demoCode: `import { CustomComponent } from './custom-component';\n\nexport default function Demo() {\n  return <CustomComponent />;\n}`,
  });

  const availableDemoSlugs = Object.keys(componentDemos);

  const sectionsList: SectionType[] = [
    'elements',
    'navigation',
    'sections',
    'media',
    'animations',
    'data-display',
    'product-kits',
  ];

  // Open modal for new component
  const handleAddNew = () => {
    setEditingComponent(null);
    setFormData({
      id: `custom-${Date.now()}`,
      name: '',
      slug: '',
      category: categories[0]?.name || 'Buttons',
      section: 'elements',
      status: 'Ready',
      description: '',
      tags: 'react, tailwind, ui',
      dependencies: 'lucide-react, motion',
      previewReference: 'animated-button',
      componentCode: `import React from 'react';\n\nexport function CustomComponent() {\n  return (\n    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-center">\n      <h3 className="font-bold text-white">Custom Component</h3>\n      <p className="text-xs text-neutral-400 mt-1">Ready for production</p>\n    </div>\n  );\n}`,
      demoCode: `import { CustomComponent } from './custom-component';\n\nexport default function Demo() {\n  return <CustomComponent />;\n}`,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing component
  const handleEdit = (comp: ComponentMeta) => {
    setEditingComponent(comp);
    setFormData({
      id: comp.id,
      name: comp.name,
      slug: comp.slug,
      category: comp.category,
      section: comp.section,
      status: comp.status,
      description: comp.description,
      tags: comp.tags.join(', '),
      dependencies: comp.dependencies.join(', '),
      previewReference: comp.previewReference || 'animated-button',
      componentCode: comp.code?.component || '',
      demoCode: comp.code?.demo || '',
    });
    setIsModalOpen(true);
  };

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug === '' || !editingComponent ? slug : prev.slug,
    }));
  };

  // Save component
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) return;

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const depsArray = formData.dependencies
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const now = new Date().toISOString();

    const newComponent: ComponentMeta = {
      id: formData.id || `comp-${Date.now()}`,
      name: formData.name.trim(),
      slug: formData.slug.trim().toLowerCase(),
      category: formData.category,
      section: formData.section,
      description: formData.description.trim() || `${formData.name} component.`,
      tags: tagsArray.length > 0 ? tagsArray : ['component'],
      framework: 'React',
      stylingSystem: 'Tailwind CSS',
      dependencies: depsArray,
      version: '1.0.0',
      status: formData.status,
      previewReference: formData.previewReference,
      sourceFileLocations: {
        component: `packages/ui/src/${formData.section}/${formData.slug}/${formData.slug}.tsx`,
        demo: `packages/ui/src/${formData.section}/${formData.slug}/${formData.slug}.demo.tsx`,
        meta: `packages/ui/src/${formData.section}/${formData.slug}/${formData.slug}.meta.json`,
      },
      createdAt: editingComponent?.createdAt || now,
      updatedAt: now,
      code: {
        component: formData.componentCode,
        demo: formData.demoCode,
      },
    };

    saveAdminComponent(newComponent);
    setIsModalOpen(false);
  };

  // Delete component
  const handleDelete = (slug: string) => {
    deleteAdminComponent(slug);
    setComponentToDelete(null);
  };

  // Reset all
  const handleReset = () => {
    resetAllComponents();
    setShowResetConfirm(false);
  };

  // Filtered components
  const filtered = useMemo(() => {
    return components.filter((comp) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        comp.name.toLowerCase().includes(q) ||
        comp.slug.toLowerCase().includes(q) ||
        comp.category.toLowerCase().includes(q) ||
        comp.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === 'All' ||
        comp.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSec =
        selectedSection === 'All' || comp.section.toLowerCase() === selectedSection.toLowerCase();

      return matchesSearch && matchesCat && matchesSec;
    });
  }, [components, search, selectedCategory, selectedSection]);

  return (
    <div className="space-y-8">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 mb-2">
            Component Manager
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Manage UI Components
          </h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Add custom components to your library, customize metadata, or hide built-in elements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {deletedSlugs.length > 0 && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restore ({deletedSlugs.length}) Hidden</span>
            </button>
          )}

          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Component</span>
          </button>
        </div>
      </div>

      {/* 2. Search, Filters & View Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug, or tag..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 pl-10 pr-4 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Filters & View */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-xs text-neutral-300 outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Section Filter */}
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-xs text-neutral-300 outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="All">All Sections</option>
            {sectionsList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-900/80 p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Components Presentation (Table or Grid) */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-800 bg-neutral-900/70 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Component</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4">Tags & Dependencies</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-sans">
                {filtered.map((comp) => {
                  const isCustom = customComponents.some((c) => c.slug === comp.slug);

                  return (
                    <tr key={comp.slug} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-neutral-200">
                            {comp.name}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {comp.slug}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-300 font-medium">
                        {comp.category}
                      </td>
                      <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">
                        {comp.section}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {comp.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="rounded bg-neutral-800 px-1.5 py-0.5 text-[9px] text-neutral-400 font-mono"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ${
                            isCustom
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : comp.status === 'Ready'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {isCustom ? 'Custom' : comp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/components/${comp.slug}`}
                            target="_blank"
                            title="View in library"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            onClick={() => handleEdit(comp)}
                            title="Edit component"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => setComponentToDelete(comp.slug)}
                            title="Remove component"
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((comp) => {
            const isCustom = customComponents.some((c) => c.slug === comp.slug);
            const Demo = componentDemos[comp.slug] || componentDemos[comp.previewReference];

            return (
              <div
                key={comp.slug}
                className="group rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                {/* Mini Preview Stage */}
                <div className="h-36 w-full rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-center overflow-hidden p-2 relative">
                  {Demo ? (
                    <div className="transform scale-[0.65] origin-center pointer-events-none">
                      <Demo />
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <Sparkles className="h-5 w-5 text-neutral-600 mx-auto" />
                      <span className="text-[10px] text-neutral-500 font-mono">Custom UI Element</span>
                    </div>
                  )}

                  <span className="absolute top-2 right-2 rounded bg-neutral-900/90 border border-neutral-800 px-1.5 py-0.5 text-[9px] font-mono text-neutral-400">
                    {comp.section}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors truncate">
                      {comp.name}
                    </h3>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                        isCustom
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {isCustom ? 'Custom' : comp.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                    {comp.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {comp.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/components/${comp.slug}`}
                      target="_blank"
                      className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleEdit(comp)}
                      className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setComponentToDelete(comp.slug)}
                      className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Modal: Add / Edit Component */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-[#0c0c0e] p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingComponent ? 'Edit Component' : 'Add New UI Component'}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Component will immediately be saved to local-first storage and indexed in library.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Component Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Neon Glow Button"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Identifier Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="e.g. neon-glow-button"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section */}
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        section: e.target.value as SectionType,
                      }))
                    }
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                  >
                    {sectionsList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as ComponentStatus,
                      }))
                    }
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Ready">Ready</option>
                    <option value="Prototype">Prototype</option>
                    <option value="Inbox">Inbox</option>
                    <option value="Reference">Reference</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Describe purpose, styling, and interactions..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              {/* Tags & Dependencies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    placeholder="button, animation, glow"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Dependencies (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.dependencies}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, dependencies: e.target.value }))
                    }
                    placeholder="motion, lucide-react"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Preview Demo Mapping */}
              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">Preview Demo Base</label>
                <select
                  value={formData.previewReference}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      previewReference: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono text-[11px]"
                >
                  {availableDemoSlugs.map((slug) => (
                    <option key={slug} value={slug}>
                      {slug}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-neutral-500">
                  Select a live preview harness for rendering in cards and modal stages.
                </p>
              </div>

              {/* Component Source Code */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Component React Source Code</span>
                  </label>
                </div>
                <textarea
                  rows={6}
                  value={formData.componentCode}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, componentCode: e.target.value }))
                  }
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-neutral-200 outline-none focus:border-emerald-500 font-mono text-[11px] leading-relaxed"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-5 py-2 font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors cursor-pointer shadow-md"
                >
                  {editingComponent ? 'Update Component' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Delete Confirmation */}
      {componentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#0c0c0e] p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Remove Component from Library?
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Are you sure you want to remove <span className="font-mono text-white font-semibold">{componentToDelete}</span>? 
              If this is a built-in component, it will be hidden from the library until restored. If custom, its record will be cleared.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setComponentToDelete(null)}
                className="rounded-lg px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(componentToDelete)}
                className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors cursor-pointer"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal: Reset All Components Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#0c0c0e] p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Restore All Built-in Components?
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              This will unhide all previously removed built-in components and reset any modifications.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                Confirm Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

