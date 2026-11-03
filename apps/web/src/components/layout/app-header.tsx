'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gem,
  MessageSquare,
  Bookmark,
  Search,
  Command,
  Sun,
  Moon,
  Github,
} from 'lucide-react';

interface AppHeaderProps {
  onOpenSearch: () => void;
}

export function AppHeader({ onOpenSearch }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-neutral-900 bg-neutral-950 px-4 md:px-6 select-none">
      {/* Left: 21ST Brand Logo */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
            <span className="font-extrabold text-xs">21</span>
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">21ST</span>
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Upgrade pill */}
        <button className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer">
          <Gem className="h-3.5 w-3.5 text-purple-400" />
          <span>Upgrade</span>
        </button>

        {/* Feedback pill */}
        <button className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer">
          <MessageSquare className="h-3.5 w-3.5 text-neutral-400" />
          <span>Feedback</span>
        </button>

        {/* Bookmarks */}
        <Link
          href="/favorites"
          className="text-neutral-400 hover:text-white p-1 rounded-lg"
          title="Saved bookmarks"
        >
          <Bookmark className="h-4 w-4" />
        </Link>

        {/* User profile avatar circle (e.g. 'P' from screenshot) */}
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-xs shadow-md">
          P
        </div>
      </div>
    </header>
  );
}
