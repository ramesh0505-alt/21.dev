'use client';

import React from 'react';
import Link from 'next/link';
import {
  Gem,
  MessageSquare,
  Bookmark,
  ShieldCheck,
} from 'lucide-react';

interface AppHeaderProps {
  onOpenSearch: () => void;
}

export function AppHeader({ onOpenSearch }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between px-6 md:px-10 bg-[#09090b]/80 backdrop-blur-md select-none border-b border-transparent">
      {/* Left: empty/spacious breadcrumb area */}
      <div className="flex items-center gap-4">
        {/* subtle indicator or empty */}
      </div>

      {/* Right: Actions matching Screenshot 1 */}
      <div className="flex items-center gap-3">
        {/* Admin Studio link */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all cursor-pointer shadow-sm"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Admin</span>
        </Link>

        {/* Upgrade pill with diamond */}
        <button className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer">
          <Gem className="h-3.5 w-3.5 text-purple-400" />
          <span>Upgrade</span>
        </button>

        {/* Feedback pill with chat bubble */}
        <button className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer">
          <MessageSquare className="h-3.5 w-3.5 text-neutral-400" />
          <span>Feedback</span>
        </button>

        {/* Bookmark icon */}
        <Link
          href="/favorites"
          className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
          title="Saved bookmarks"
        >
          <Bookmark className="h-4 w-4" />
        </Link>

        {/* Profile Avatar 'P' in purple circle matching Screenshot 1 */}
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-xs shadow-md">
          P
        </div>
      </div>
    </header>
  );
}
