'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Trash2,
  Copy,
  Check,
  Edit,
  Code2,
  X,
  Sliders,
  Sun,
  Moon,
  RotateCcw,
} from 'lucide-react';
import {
  useAdminIcons,
  saveAdminIcon,
  deleteAdminIcon,
  resetAllIcons,
  AdminIcon,
} from '@/lib/admin-store';

export default function AdminIconsPage() {
  const icons = useAdminIcons();

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Selected Icon for Interactive Inspector
  const [selectedIcon, setSelectedIcon] = useState<AdminIcon | null>(null);

  // Inspector interactive customization controls
  const [iconSize, setIconSize] = useState<number>(32);
  const [iconColor, setIconColor] = useState<string>('#10b981'); // Emerald default
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [inspectorBg, setInspectorBg] = useState<'dark' | 'light'>('dark');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIcon, setEditingIcon] = useState<AdminIcon | null>(null);
  const [iconToDelete, setIconToDelete] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Add / Edit Form State
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    category: AdminIcon['category'];
    tags: string;
    svgContent: string;
  }>({
    id: '',
    name: '',
    category: 'Interface',
    tags: 'icon, vector',
    svgContent: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
  });

  const categories: AdminIcon['category'][] = [
    'Navigation',
    'Media',
    'Actions',
    'Interface',
    'Development',
    'Badges',
  ];

  const colorSwatches = [
    { label: 'Emerald', hex: '#10b981' },
    { label: 'White', hex: '#ffffff' },
    { label: 'Sky', hex: '#38bdf8' },
    { label: 'Purple', hex: '#c084fc' },
    { label: 'Amber', hex: '#fbbf24' },
    { label: 'Rose', hex: '#fb7185' },
    { label: 'Slate', hex: '#94a3b8' },
  ];

  // Helper to normalize pasted SVG (if full <svg> is pasted, extract inner contents)
  const normalizeSvg = (input: string): string => {
    const trimmed = input.trim();
    if (trimmed.startsWith('<svg') && trimmed.endsWith('</svg>')) {
      const match = trimmed.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return trimmed;
  };

  const handleOpenAdd = () => {
    setEditingIcon(null);
    setFormData({
      id: `icon-${Date.now()}`,
      name: '',
      category: 'Interface',
      tags: 'vector, icon',
      svgContent: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (icon: AdminIcon) => {
    setEditingIcon(icon);
    setFormData({
      id: icon.id,
      name: icon.name,
      category: icon.category,
      tags: icon.tags.join(', '),
      svgContent: icon.svgContent,
    });
    setIsModalOpen(true);
  };

  const handleSaveIcon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.svgContent.trim()) return;

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const cleanSvg = normalizeSvg(formData.svgContent);

    const newIcon: AdminIcon = {
      id: formData.id || `icon-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      tags: tagsArray.length > 0 ? tagsArray : ['icon'],
      svgContent: cleanSvg,
      createdAt: editingIcon?.createdAt || new Date().toISOString(),
    };

    saveAdminIcon(newIcon);
    if (selectedIcon?.id === newIcon.id) {
      setSelectedIcon(newIcon);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteAdminIcon(id);
    if (selectedIcon?.id === id) {
      setSelectedIcon(null);
    }
    setIconToDelete(null);
  };

  const handleReset = () => {
    resetAllIcons();
    setSelectedIcon(null);
    setShowResetConfirm(false);
  };

  // Copy JSX Snippet
  const handleCopyJsx = (icon: AdminIcon) => {
    const snippet = `<svg\n  xmlns="http://www.w3.org/2000/svg"\n  viewBox="0 0 24 24"\n  width="${iconSize}"\n  height="${iconSize}"\n  fill="none"\n  stroke="${iconColor}"\n  strokeWidth="${strokeWidth}"\n  strokeLinecap="round"\n  strokeLinejoin="round"\n  className="icon-${icon.id}"\n>\n  ${icon.svgContent}\n</svg>`;
    navigator.clipboard.writeText(snippet);
    setCopiedType('jsx');
    setTimeout(() => setCopiedType(null), 1500);
  };

  // Copy Raw SVG
  const handleCopyRawSvg = (icon: AdminIcon) => {
    const raw = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon.svgContent}</svg>`;
    navigator.clipboard.writeText(raw);
    setCopiedType('svg');
    setTimeout(() => setCopiedType(null), 1500);
  };

  // Filtered Icons
  const filtered = useMemo(() => {
    return icons.filter((icon) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        icon.name.toLowerCase().includes(q) ||
        icon.category.toLowerCase().includes(q) ||
        icon.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === 'All' ||
        icon.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [icons, search, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 mb-2">
            Asset Studio
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Icon Library & Inspector
          </h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Add custom SVG icons, preview at various sizes, test colors, and copy React JSX snippets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Icons</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Icon</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons by name or tag..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 pl-10 pr-4 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`rounded-xl px-3 py-1.5 text-xs transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            All ({icons.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-neutral-800 text-emerald-400 font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Studio Workspace: Grid on Left + Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Icons Grid (7 cols on lg, or full if no icon selected) */}
        <div className={`space-y-4 ${selectedIcon ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
            {filtered.map((icon) => {
              const isSelected = selectedIcon?.id === icon.id;

              return (
                <div
                  key={icon.id}
                  onClick={() => setSelectedIcon(icon)}
                  className={`group relative rounded-2xl border p-4 transition-all flex flex-col items-center justify-between text-center space-y-3 cursor-pointer select-none ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500 shadow-md'
                      : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/70'
                  }`}
                >
                  {/* SVG Stage */}
                  <div className="h-14 w-14 rounded-xl bg-neutral-950 flex items-center justify-center text-neutral-200 group-hover:text-emerald-400 transition-colors shadow-inner">
                    <svg
                      viewBox="0 0 24 24"
                      width="28"
                      height="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      dangerouslySetInnerHTML={{ __html: icon.svgContent }}
                    />
                  </div>

                  <div className="w-full">
                    <h4 className="font-semibold text-xs text-white truncate">
                      {icon.name}
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-mono block">
                      {icon.category}
                    </span>
                  </div>

                  {/* Hover Quick Action Strip */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyRawSvg(icon);
                      }}
                      title="Copy SVG"
                      className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(icon);
                      }}
                      title="Edit Icon"
                      className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIconToDelete(icon.id);
                      }}
                      title="Delete Icon"
                      className="p-1.5 rounded-lg bg-neutral-800 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Icon Inspector (5 cols on lg) */}
        {selectedIcon && (
          <div className="lg:col-span-5 sticky top-24 rounded-2xl border border-neutral-800 bg-[#0c0c0e] p-5 space-y-6 shadow-2xl">
            {/* Inspector Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Icon Inspector</h3>
              </div>
              <button
                onClick={() => setSelectedIcon(null)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Live Interactive Preview Canvas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-semibold text-white">{selectedIcon.name}</span>
                <button
                  onClick={() =>
                    setInspectorBg(inspectorBg === 'dark' ? 'light' : 'dark')
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  {inspectorBg === 'dark' ? (
                    <>
                      <Sun className="h-3 w-3 text-amber-400" /> Light
                    </>
                  ) : (
                    <>
                      <Moon className="h-3 w-3 text-sky-400" /> Dark
                    </>
                  )}
                </button>
              </div>

              <div
                className={`h-48 w-full rounded-2xl border transition-colors flex items-center justify-center p-4 ${
                  inspectorBg === 'dark'
                    ? 'border-neutral-800 bg-neutral-950 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:16px_16px]'
                    : 'border-neutral-200 bg-white [background-image:radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:16px_16px]'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={iconSize}
                  height={iconSize}
                  fill="none"
                  stroke={iconColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dangerouslySetInnerHTML={{ __html: selectedIcon.svgContent }}
                />
              </div>
            </div>

            {/* Customization Sliders */}
            <div className="space-y-4 text-xs">
              {/* Size */}
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span className="text-neutral-300">Size</span>
                  <span className="text-emerald-400 font-mono">{iconSize}px</span>
                </div>
                <div className="flex items-center gap-2">
                  {[16, 20, 24, 32, 48, 64].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setIconSize(sz)}
                      className={`flex-1 rounded-lg py-1 text-[11px] font-mono transition-colors cursor-pointer ${
                        iconSize === sz
                          ? 'bg-neutral-800 text-white font-bold border border-neutral-700'
                          : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stroke Width */}
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span className="text-neutral-300">Stroke Width</span>
                  <span className="text-emerald-400 font-mono">{strokeWidth}px</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 1.5, 2, 2.5, 3].map((w) => (
                    <button
                      key={w}
                      onClick={() => setStrokeWidth(w)}
                      className={`flex-1 rounded-lg py-1 text-[11px] font-mono transition-colors cursor-pointer ${
                        strokeWidth === w
                          ? 'bg-neutral-800 text-white font-bold border border-neutral-700'
                          : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatches */}
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span className="text-neutral-300">Stroke Color</span>
                  <span className="font-mono text-neutral-400">{iconColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {colorSwatches.map((swatch) => (
                    <button
                      key={swatch.hex}
                      onClick={() => setIconColor(swatch.hex)}
                      title={swatch.label}
                      style={{ backgroundColor: swatch.hex }}
                      className={`h-6 w-6 rounded-full border-2 transition-transform cursor-pointer ${
                        iconColor === swatch.hex
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-transparent hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Export & Copy Actions */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => handleCopyJsx(selectedIcon)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors cursor-pointer shadow-md"
              >
                {copiedType === 'jsx' ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied React JSX!</span>
                  </>
                ) : (
                  <>
                    <Code2 className="h-4 w-4" />
                    <span>Copy React JSX Snippet</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCopyRawSvg(selectedIcon)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/60 py-2 text-xs text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
                >
                  {copiedType === 'svg' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>Copy Raw SVG</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(selectedIcon)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/60 py-2 text-xs text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit Icon</span>
                </button>
              </div>

              <button
                onClick={() => setIconToDelete(selectedIcon.id)}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Icon</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Modal: Add / Edit Icon */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-[#0c0c0e] p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingIcon ? 'Edit Icon' : 'Add New SVG Icon'}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Paste standard SVG inner elements (path, circle, line) or full SVG tag.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveIcon} className="space-y-4 text-xs">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Icon Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Shield Check"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value as AdminIcon['category'],
                      }))
                    }
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="shield, check, security, verified"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              {/* SVG Content */}
              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">
                  SVG Markup (inner paths or full &lt;svg&gt;) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.svgContent}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, svgContent: e.target.value }))
                  }
                  placeholder='<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>'
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-neutral-200 outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              {/* Real-time Preview Stage */}
              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">Live Preview Test</label>
                <div className="h-20 w-full rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-center text-emerald-400">
                  <svg
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ __html: normalizeSvg(formData.svgContent) }}
                  />
                </div>
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
                  {editingIcon ? 'Update Icon' : 'Save Icon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Delete Icon Confirmation */}
      {iconToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#0c0c0e] p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Delete Icon from Library?
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Are you sure you want to delete this icon? It will be removed from your Icon Studio and suggestions.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIconToDelete(null)}
                className="rounded-lg px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(iconToDelete)}
                className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors cursor-pointer"
              >
                Delete Icon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal: Reset Icons Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#0c0c0e] p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Reset Icon Library to Defaults?
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              This will restore the 12 original starter icons and remove any custom added icons.
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
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

