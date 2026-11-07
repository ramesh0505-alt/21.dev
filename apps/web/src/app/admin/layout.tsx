'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  FolderTree,
  DownloadCloud,
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  LayoutTemplate,
  AppWindow,
  Palette,
  History,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Components', href: '/admin/components', icon: Layers },
    { name: 'Sections', href: '/admin/sections', icon: LayoutTemplate },
    { name: 'Templates', href: '/admin/templates', icon: AppWindow },
    { name: 'Themes', href: '/admin/themes', icon: Palette },
    { name: 'Icon Studio', href: '/admin/icons', icon: Sparkles },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Activity Log', href: '/admin/activity', icon: History },
    { name: 'Backup & Export', href: '/admin/export', icon: DownloadCloud },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 flex flex-col font-sans">
      {/* Top Admin Command Bar */}
      <header className="sticky top-0 z-40 border-b border-neutral-800/90 bg-[#09090b]/95 backdrop-blur-md px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left Title & Status */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Library</span>
            </Link>

            <span className="text-neutral-700">/</span>

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h1 className="font-bold text-sm tracking-tight text-white">
                DevUI Admin Studio
              </h1>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Local-First Storage
            </span>
          </div>

          {/* Right Links & Quick Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
            >
              <span>Live Library</span>
              <ExternalLink className="h-3 w-3 text-neutral-400" />
            </Link>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-neutral-900 pt-2">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-800/90 text-white font-semibold shadow-sm border border-neutral-700/60'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isActive ? 'text-emerald-400' : 'text-neutral-500'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Admin View Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

