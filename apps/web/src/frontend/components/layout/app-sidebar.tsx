'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutGrid,
  Palette,
  LayoutTemplate,
  AppWindow,
  Sparkles,
  Video,
  Bookmark,
  Terminal,
  Bot,
  PlusCircle,
  ChevronRight,
  ChevronDown,
  Search,
  Layers,
  Box,
  BookOpen,
  Package,
} from 'lucide-react';
import { registry } from '@/registry';

interface AppSidebarProps {
  onOpenSearch?: () => void;
}

export function AppSidebar({ onOpenSearch }: AppSidebarProps) {
  const pathname = usePathname();
  const [componentsExpanded, setComponentsExpanded] = useState(false);

  const categories = [
    { name: 'Buttons', slug: 'buttons' },
    { name: 'Cards', slug: 'cards' },
    { name: 'Product galleries', slug: 'product-galleries' },
    { name: 'Image galleries', slug: 'image-galleries' },
    { name: 'Navigation', slug: 'navigation-bars' },
    { name: 'Badges', slug: 'badges' },
    { name: 'Animations', slug: 'text-animations' },
    { name: 'Data Display', slug: 'terminal-interfaces' },
    { name: 'Sections', slug: 'hero-sections' },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-900/90 bg-[#09090b] flex flex-col h-screen sticky top-0 select-none text-xs z-40">
      {/* 1. Top Logo matching 21st.dev Screenshot 1 */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          {/* Blue geometric 21st logo */}
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H12V12H4V4Z" fill="white" />
              <path d="M12 12H20V20H12V12Z" fill="white" />
            </svg>
          </div>
          <span className="font-black text-lg tracking-tight text-white font-sans">
            21ST
          </span>
        </Link>
      </div>

      {/* 2. Search Input matching 21st.dev Screenshot 1 */}
      <div className="px-3 py-2">
        <button
          onClick={onOpenSearch}
          className="flex w-full items-center justify-between rounded-xl border border-neutral-800/80 bg-neutral-900/50 px-3 py-2 text-neutral-400 hover:border-neutral-700 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-neutral-400" />
            <span>Search</span>
          </div>
          <kbd className="inline-flex items-center rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 3. Main Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-4 scrollbar-none pb-4">
        {/* Home Item */}
        <div>
          <Link
            href="/"
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname === '/'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
            }`}
          >
            <Home className="h-4 w-4 text-neutral-300" />
            <span>Home</span>
          </Link>
        </div>

        {/* Explore Section matching Screenshot 1 */}
        <div className="space-y-0.5">
          <div className="px-3 py-1 text-[11px] font-semibold text-neutral-500">
            Explore
          </div>

          {/* Components (expandable) */}
          <div>
            <div
              className={`flex items-center justify-between rounded-xl px-3 py-2 font-medium transition-colors cursor-pointer ${
                pathname.startsWith('/elements')
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
              }`}
              onClick={() => setComponentsExpanded(!componentsExpanded)}
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="h-4 w-4 text-neutral-400" />
                <Link href="/elements" onClick={(e) => e.stopPropagation()}>
                  <span>Components</span>
                </Link>
              </div>
              <ChevronRight
                className={`h-3.5 w-3.5 text-neutral-500 transition-transform ${
                  componentsExpanded ? 'rotate-90' : ''
                }`}
              />
            </div>

            {componentsExpanded && (
              <div className="ml-6 pl-2 border-l border-neutral-800 space-y-0.5 mt-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/elements/${cat.slug}`}
                    className="block rounded-lg px-2.5 py-1 text-[11px] text-neutral-400 hover:text-white hover:bg-neutral-900/60 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Themes */}
          <Link
            href="/themes"
            className={`flex items-center justify-between rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname === '/themes'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Palette className="h-4 w-4 text-neutral-400" />
              <span>Themes</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
          </Link>

          {/* 3D Primitives */}
          <Link
            href="/3d"
            className={`flex items-center justify-between rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname === '/3d'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Box className="h-4 w-4 text-neutral-400" />
              <span>3D Components</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
          </Link>

          {/* Effects & Backgrounds */}
          <Link
            href="/effects"
            className={`flex items-center justify-between rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname === '/effects'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-neutral-400" />
              <span>Backgrounds & Effects</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
          </Link>

          {/* Templates */}
          <Link
            href="/templates"
            className={`flex items-center justify-between rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname === '/templates'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutTemplate className="h-4 w-4 text-neutral-400" />
              <span>Templates</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
          </Link>

          {/* Apps */}
          <Link
            href="/product-kits"
            className={`flex items-center justify-between rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname === '/product-kits'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AppWindow className="h-4 w-4 text-neutral-400" />
              <span>Apps</span>
            </div>
            <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 text-[9px] font-mono">
              Ready
            </span>
          </Link>

          {/* Icons */}
          <Link
            href="/icons"
            className={`flex items-center justify-between rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname === '/icons'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-neutral-400" />
              <span>Icons</span>
            </div>
            <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 text-[9px] font-mono">
              Vector
            </span>
          </Link>

          {/* Animations */}
          <Link
            href="/animations"
            className={`flex items-center justify-between rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname === '/animations'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Video className="h-4 w-4 text-neutral-400" />
              <span>Animations</span>
            </div>
          </Link>

          {/* Bookmarks */}
          <Link
            href="/favorites"
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname === '/favorites'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
            }`}
          >
            <Bookmark className="h-4 w-4 text-neutral-400" />
            <span>Bookmarks</span>
          </Link>
        </div>

        {/* Build Section matching Screenshot 1 */}
        <div className="space-y-0.5">
          <div className="px-3 py-1 text-[11px] font-semibold text-neutral-500">
            Build
          </div>

          {/* Creator Studio */}
          <Link
            href="/playground"
            className="flex items-center justify-between rounded-xl px-3 py-2 font-medium text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-neutral-400" />
              <span>Creator Studio</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
          </Link>

          {/* 21st AI */}
          <Link
            href="/experiments"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200 transition-colors"
          >
            <Bot className="h-4 w-4 text-neutral-400" />
            <span>21st AI</span>
          </Link>

          {/* Design Bug Bot [Try free] */}
          <Link
            href="/playground"
            className="flex items-center justify-between rounded-xl px-3 py-2 font-medium text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="h-4 w-4 text-neutral-400" />
              <span>Design Bug Bot</span>
            </div>
            <span className="rounded bg-sky-500/20 text-sky-400 px-1.5 py-0.2 text-[9px] font-bold">
              Try free
            </span>
          </Link>

          {/* Documentation */}
          <Link
            href="/docs"
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname === '/docs'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="h-4 w-4 text-neutral-400" />
            <span>Documentation</span>
          </Link>

          {/* Dependencies */}
          <Link
            href="/dependencies"
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname === '/dependencies'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
            }`}
          >
            <Package className="h-4 w-4 text-neutral-400" />
            <span>Dependencies</span>
          </Link>

          {/* CLI & MCP */}
          <Link
            href="/settings"
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname === '/settings'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
            }`}
          >
            <Terminal className="h-4 w-4 text-neutral-400" />
            <span>CLI & Settings</span>
          </Link>

          {/* Admin Studio */}
          <Link
            href="/admin"
            className={`flex items-center justify-between rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname.startsWith('/admin')
                ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20'
                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span>Admin Studio</span>
            </div>
            <span className="rounded bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 text-[9px] font-mono">
              Admin
            </span>
          </Link>
        </div>
      </div>

      {/* 4. Bottom Publish Button matching Screenshot 1 */}
      <div className="p-3 border-t border-neutral-900/90">
        <Link
          href="/admin/components"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-neutral-400 hover:text-white hover:bg-neutral-900/50 transition-colors font-medium text-xs"
        >
          <PlusCircle className="h-4 w-4 text-neutral-400" />
          <span>Publish Component</span>
        </Link>
      </div>
    </aside>
  );
}
