'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Component,
  Sparkles,
  Layers,
  FolderHeart,
  FolderGit2,
  Clock,
  Bookmark,
  FlaskConical,
  PlaySquare,
  Settings,
  ChevronRight,
  Code2,
  Package,
  Compass,
} from 'lucide-react';
import { getFavorites, getRecentlyViewed, getCollections } from '@/lib/storage';
import { ALL_CATEGORIES, CATEGORIES_BY_SECTION } from '@/lib/categories';
import { registry } from '@/registry';

export function AppSidebar() {
  const pathname = usePathname();
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [recentCount, setRecentCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);
  const [elementsOpen, setElementsOpen] = useState(true);

  const updateCounts = () => {
    setFavoriteCount(getFavorites().length);
    setRecentCount(getRecentlyViewed().length);
    setCollectionCount(getCollections().length);
  };

  useEffect(() => {
    updateCounts();
    window.addEventListener('devui_storage_updated', updateCounts);
    return () => window.removeEventListener('devui_storage_updated', updateCounts);
  }, []);

  // Compute component count per category from registry
  const countsByCategory = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const item of registry) {
      map.set(item.category.toLowerCase(), (map.get(item.category.toLowerCase()) || 0) + 1);
    }
    return map;
  }, []);

  const navGroups = [
    {
      title: 'Discovery',
      items: [
        { label: 'Dashboard', href: '/', icon: LayoutDashboard },
        { label: 'All Elements', href: '/elements', icon: Component, count: registry.length },
        { label: 'Animations', href: '/animations', icon: Sparkles },
        { label: 'Sections', href: '/sections', icon: Layers },
        { label: 'Templates', href: '/templates', icon: Package },
        { label: 'Product Kits', href: '/product-kits', icon: Compass },
      ],
    },
    {
      title: 'Workspace',
      items: [
        { label: 'Favorites', href: '/favorites', icon: FolderHeart, count: favoriteCount },
        { label: 'Collections', href: '/collections', icon: FolderGit2, count: collectionCount },
        { label: 'Recent', href: '/recent', icon: Clock, count: recentCount },
        { label: 'References', href: '/references', icon: Bookmark },
        { label: 'Experiments', href: '/experiments', icon: FlaskConical },
        { label: 'Playground', href: '/playground', icon: PlaySquare },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border/80 bg-background/50 flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 select-none">
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h3 className="px-3 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/80 font-medium">
              {group.title}
            </h3>
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-muted-foreground'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Categories Section Browser */}
        <div className="space-y-1 pt-2">
          <button
            onClick={() => setElementsOpen(!elementsOpen)}
            className="flex w-full items-center justify-between px-3 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/80 hover:text-foreground font-medium cursor-pointer"
          >
            <span>Core Categories</span>
            <ChevronRight
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                elementsOpen ? 'rotate-90' : ''
              }`}
            />
          </button>

          {elementsOpen && (
            <div className="space-y-0.5 pt-1 pl-2">
              {ALL_CATEGORIES.slice(0, 14).map((cat) => {
                const count = countsByCategory.get(cat.name.toLowerCase()) || 0;
                const catHref = `/elements/${cat.slug}`;
                const isActive = pathname === catHref;
                return (
                  <Link
                    key={cat.slug}
                    href={catHref}
                    className={`flex items-center justify-between rounded-md px-2.5 py-1 text-xs transition-colors ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                        : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {count > 0 ? (
                      <span className="font-mono text-[10px] text-emerald-400 font-semibold">
                        {count}
                      </span>
                    ) : (
                      <span className="font-mono text-[9px] text-muted-foreground/40">0</span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom status & settings */}
      <div className="border-t border-border/80 p-3 bg-muted/10">
        <Link
          href="/settings"
          className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            pathname === '/settings'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Library Settings</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">v1.0</span>
        </Link>
      </div>
    </aside>
  );
}
