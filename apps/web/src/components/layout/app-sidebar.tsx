'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutGrid,
  Palette,
  LayoutTemplate,
  AppWindow,
  Shapes,
  Video,
  Bookmark,
  Sparkles,
  Bot,
  Terminal,
  Plus,
  ChevronRight,
  Search,
  Command,
} from 'lucide-react';
import { getFavorites } from '@/lib/storage';

interface AppSidebarProps {
  onOpenSearch?: () => void;
}

export function AppSidebar({ onOpenSearch }: AppSidebarProps) {
  const pathname = usePathname();
  const [favoriteCount, setFavoriteCount] = React.useState(0);

  React.useEffect(() => {
    setFavoriteCount(getFavorites().length);
    const update = () => setFavoriteCount(getFavorites().length);
    window.addEventListener('devui_storage_updated', update);
    return () => window.removeEventListener('devui_storage_updated', update);
  }, []);

  const exploreItems = [
    { label: 'Components', href: '/elements', icon: LayoutGrid, hasChevron: true },
    { label: 'Themes', href: '/references', icon: Palette, hasChevron: true },
    { label: 'Templates', href: '/templates', icon: LayoutTemplate, hasChevron: true },
    { label: 'Apps', href: '/product-kits', icon: AppWindow, badge: 'New', hasChevron: true },
    { label: 'Animations', href: '/animations', icon: Shapes, badge: 'New', hasChevron: true },
    { label: 'Sections', href: '/sections', icon: Video, badge: 'New', hasChevron: true },
    { label: 'Bookmarks', href: '/favorites', icon: Bookmark, count: favoriteCount },
  ];

  const buildItems = [
    { label: 'Creator Studio', href: '/playground', icon: Sparkles, hasChevron: true },
    { label: '21st AI', href: '/experiments', icon: Sparkles },
    { label: 'Design Bug Bot', href: '/playground', icon: Bot, badge: 'Try free' },
    { label: 'CLI & MCP', href: '/settings', icon: Terminal },
  ];

  return (
    <aside className="w-56 shrink-0 border-r border-neutral-900 bg-neutral-950 flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 select-none text-xs">
      {/* Search Button inside Sidebar */}
      <div className="p-3 pb-2">
        <button
          onClick={onOpenSearch}
          className="flex w-full items-center justify-between rounded-xl border border-neutral-800/80 bg-neutral-900/60 px-3 py-2 text-neutral-400 hover:border-neutral-700 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-neutral-400" />
            <span className="text-xs">Search</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-5 scrollbar-none">
        {/* Home Item */}
        <div className="pt-1">
          <Link
            href="/"
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname === '/'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </div>

        {/* Section: Explore */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-semibold text-neutral-500">Explore</div>
          <div className="space-y-0.5 pt-0.5">
            {exploreItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-1.5 font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white font-semibold'
                      : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-neutral-400" />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="rounded bg-blue-600/20 text-blue-400 px-1.5 py-0.2 text-[9px] font-bold">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span className="rounded-full bg-neutral-800 px-1.5 text-[10px] font-mono text-neutral-400">
                        {item.count}
                      </span>
                    )}
                    {item.hasChevron && (
                      <ChevronRight className="h-3 w-3 text-neutral-600" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Section: Build */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-semibold text-neutral-500">Build</div>
          <div className="space-y-0.5 pt-0.5">
            {buildItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-1.5 font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white font-semibold'
                      : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-neutral-400" />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="rounded bg-neutral-800 text-neutral-300 px-1.5 py-0.2 text-[9px] font-semibold">
                        {item.badge}
                      </span>
                    )}
                    {item.hasChevron && (
                      <ChevronRight className="h-3 w-3 text-neutral-600" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Publish Pill */}
      <div className="p-3 border-t border-neutral-900">
        <Link
          href="/playground"
          className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5 text-neutral-400" />
          <span className="font-semibold text-xs">Publish Component</span>
        </Link>
      </div>
    </aside>
  );
}
