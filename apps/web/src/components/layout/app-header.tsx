'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bookmark,
  ShieldCheck,
  Search,
  BookOpen,
  Sliders,
} from 'lucide-react';
import { useAdminRealtimeStatus } from '@/lib/admin-store';

interface AppHeaderProps {
  onOpenSearch: () => void;
}

export function AppHeader({ onOpenSearch }: AppHeaderProps) {
  const { isSynced } = useAdminRealtimeStatus();

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between px-6 md:px-10 bg-navy-900/90 backdrop-blur-md select-none border-b border-navy-700/60">
      {/* Left: Real-time Live Sync Indicator */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400 select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-Time Sync Active</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        {/* Admin Studio link */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all cursor-pointer shadow-sm"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Admin Studio</span>
        </Link>

        {/* Documentation link */}
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <BookOpen className="h-3.5 w-3.5 text-neutral-400" />
          <span>Docs</span>
        </Link>

        {/* Bookmark icon */}
        <Link
          href="/favorites"
          className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-900 transition-colors"
          title="Saved bookmarks"
        >
          <Bookmark className="h-4 w-4" />
        </Link>

        {/* Developer Workspace Avatar */}
        <Link
          href="/settings"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 text-emerald-400 font-bold text-xs shadow-sm hover:border-emerald-500 transition-colors"
          title="Settings"
        >
          D
        </Link>
      </div>
    </header>
  );
}
