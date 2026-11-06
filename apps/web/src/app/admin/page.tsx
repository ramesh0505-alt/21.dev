'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  FolderTree,
  HardDrive,
  Plus,
  ArrowRight,
  Trash2,
  Edit,
  ExternalLink,
  Copy,
  Check,
  Search,
  CheckCircle2,
  UploadCloud,
  Image as ImageIcon,
  Film,
} from 'lucide-react';
import { DirectMediaUpload } from '@/components/admin/direct-media-upload';
import {
  useAdminComponents,
  useAdminIcons,
  useAdminCategories,
  getCustomComponents,
  getDeletedComponentSlugs,
  deleteAdminComponent,
  deleteAdminIcon,
} from '@/lib/admin-store';

export default function AdminOverviewPage() {
  const components = useAdminComponents();
  const icons = useAdminIcons();
  const categories = useAdminCategories();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [componentToDelete, setComponentToDelete] = useState<string | null>(null);
  const [iconToDelete, setIconToDelete] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadedVideo, setUploadedVideo] = useState<string>('');

  const customComponents = getCustomComponents();
  const deletedSlugs = getDeletedComponentSlugs();

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDeleteComp = (slug: string) => {
    deleteAdminComponent(slug);
    setComponentToDelete(null);
  };

  const handleDeleteIcon = (id: string) => {
    deleteAdminIcon(id);
    setIconToDelete(null);
  };

  return (
    <div className="space-y-10">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 mb-2">
            Control Center
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Library Administration
          </h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-1 max-w-2xl">
            Add, update, inspect, and remove UI components and SVG icons in your personal local-first development workspace.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/components"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Component</span>
          </Link>
          <Link
            href="/admin/icons"
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900/80 px-3.5 py-2 text-xs font-medium text-neutral-200 hover:text-white hover:border-neutral-600 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Icon</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Components */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">UI Components</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight text-white font-mono">
              {components.length}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
              <span className="text-emerald-400 font-semibold">{customComponents.length} custom</span>
              <span>•</span>
              <span>{deletedSlugs.length} hidden</span>
            </div>
          </div>
        </div>

        {/* Total Icons */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Icon Library</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight text-white font-mono">
              {icons.length}
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              SVG vectors ready to copy
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Active Categories</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <FolderTree className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight text-white font-mono">
              {categories.length}
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              Component groupings
            </div>
          </div>
        </div>

        {/* Storage Health */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Persistence Mode</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <HardDrive className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Local Storage
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              Synced with client event bus
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 Direct Media Studio: Local Disk Uploads */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UploadCloud className="h-4 w-4 text-emerald-400" />
              <span>Direct Media Studio (Disk Upload)</span>
            </h2>
            <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
              Direct Files, No Web Links Needed
            </span>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">
            Directly saved to: public/uploads/
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
            <DirectMediaUpload
              label="Direct Image Upload (from disk)"
              type="image"
              value={uploadedImage}
              onChange={(url) => setUploadedImage(url)}
              helperText="Upload any PNG, JPG, or WebP screenshot directly from your computer."
            />
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
            <DirectMediaUpload
              label="Direct Video Upload (from disk)"
              type="video"
              value={uploadedVideo}
              onChange={(url) => setUploadedVideo(url)}
              helperText="Upload any MP4, WebM, or MOV motion video directly from your computer."
            />
          </div>
        </div>
      </div>

      {/* 3. Section: Recent Components */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Active UI Components</h2>
            <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
              {components.length} total
            </span>
          </div>

          <Link
            href="/admin/components"
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <span>Manage All Components</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-800 bg-neutral-900/70 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Component</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-sans">
                {components.slice(0, 8).map((comp) => {
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
                      <td className="py-3 px-4 text-neutral-300">
                        {comp.category}
                      </td>
                      <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">
                        {comp.section}
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
                            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            onClick={() => setComponentToDelete(comp.slug)}
                            title="Delete / Remove component"
                            className="p-1 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
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
      </div>

      {/* 4. Section: Icons Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Icon Studio Assets</h2>
            <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
              {icons.length} icons
            </span>
          </div>

          <Link
            href="/admin/icons"
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <span>Open Icon Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Grid of Icon Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {icons.slice(0, 12).map((icon) => (
            <div
              key={icon.id}
              className="group relative rounded-xl border border-neutral-800 bg-neutral-900/40 p-3 hover:border-neutral-700 hover:bg-neutral-900/80 transition-all flex flex-col items-center justify-center text-center space-y-2"
            >
              {/* Icon SVG render */}
              <div className="h-10 w-10 flex items-center justify-center text-neutral-200 group-hover:text-emerald-400 transition-colors">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dangerouslySetInnerHTML={{ __html: icon.svgContent }}
                />
              </div>

              <div className="w-full">
                <span className="block text-xs font-semibold text-neutral-200 truncate">
                  {icon.name}
                </span>
                <span className="block text-[10px] text-neutral-500 truncate">
                  {icon.category}
                </span>
              </div>

              {/* Action buttons on hover */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopy(icon.id, icon.svgContent)}
                  title="Copy SVG paths"
                  className="p-1 rounded bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                >
                  {copiedId === icon.id ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
                <button
                  onClick={() => setIconToDelete(icon.id)}
                  title="Delete icon"
                  className="p-1 rounded bg-neutral-800 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Delete Component Confirmation */}
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
                onClick={() => handleDeleteComp(componentToDelete)}
                className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors cursor-pointer"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Icon Confirmation */}
      {iconToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#0c0c0e] p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Delete Icon?
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Are you sure you want to delete this icon? It will be removed from your Icon Studio and live suggestions.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIconToDelete(null)}
                className="rounded-lg px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteIcon(iconToDelete)}
                className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors cursor-pointer"
              >
                Delete Icon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

