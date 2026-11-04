'use client';

import React, { useState, useMemo } from 'react';
import {
  FolderTree,
  Plus,
  Search,
  Trash2,
  Edit,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  useAdminCategories,
  useAdminComponents,
  saveAdminCategory,
  deleteAdminCategory,
  AdminCategory,
} from '@/lib/admin-store';

export default function AdminCategoriesPage() {
  const categories = useAdminCategories();
  const components = useAdminComponents();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    slug: string;
    description: string;
  }>({
    id: '',
    name: '',
    slug: '',
    description: '',
  });

  // Calculate component count per category
  const countsByCategory = useMemo(() => {
    const map = new Map<string, number>();
    components.forEach((c) => {
      const cat = c.category.toLowerCase();
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return map;
  }, [components]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      id: `cat-${Date.now()}`,
      name: '',
      slug: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setFormData({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug === '' || !editingCategory ? slug : prev.slug,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) return;

    const newCategory: AdminCategory = {
      id: formData.id || `cat-${Date.now()}`,
      name: formData.name.trim(),
      slug: formData.slug.trim().toLowerCase(),
      description: formData.description.trim(),
      createdAt: editingCategory?.createdAt || new Date().toISOString(),
    };

    saveAdminCategory(newCategory);
    setIsModalOpen(false);
  };

  const handleDelete = (slug: string) => {
    deleteAdminCategory(slug);
    setCategoryToDelete(null);
  };

  const filtered = useMemo(() => {
    return categories.filter((cat) => {
      const q = search.toLowerCase();
      return (
        !q ||
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q) ||
        (cat.description && cat.description.toLowerCase().includes(q))
      );
    });
  }, [categories, search]);

  return (
    <div className="space-y-8">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 mb-2">
            Taxonomy Architecture
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Category Management
          </h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Configure component categories, navigation labels, and taxonomy groupings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* 2. Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories by name or slug..."
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 pl-10 pr-4 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-emerald-500 transition-all"
        />
      </div>

      {/* 3. Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cat) => {
          const compCount = countsByCategory.get(cat.name.toLowerCase()) || 0;

          return (
            <div
              key={cat.slug}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4 hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                      <FolderTree className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                      {cat.name}
                    </h3>
                  </div>

                  <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-300">
                    {compCount} {compCount === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="font-mono text-[11px] text-neutral-500">
                  slug: /{cat.slug}
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-neutral-800/80">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Edit category"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setCategoryToDelete(cat.slug)}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Modal: Add / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#0c0c0e] p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Update taxonomy definition for organizing components.
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
              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Modals & Dialogs"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="e.g. modals-and-dialogs"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Brief description of components in this category..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

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
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Delete Category Confirmation */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#0c0c0e] p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Delete Category?
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Are you sure you want to delete category <span className="font-mono text-white font-semibold">{categoryToDelete}</span>? 
              Components assigned to it will remain in your library.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="rounded-lg px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(categoryToDelete)}
                className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors cursor-pointer"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
