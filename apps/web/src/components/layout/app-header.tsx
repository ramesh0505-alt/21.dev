'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Moon,
  Sun,
  Github,
  Layers,
  Sparkles,
  Command,
  Download,
  Terminal,
} from 'lucide-react';
import {
  PackageManager,
  getPackageManagerPreference,
  setPackageManagerPreference,
} from '@/lib/storage';
import { registry } from '@/registry';

interface AppHeaderProps {
  onOpenSearch: () => void;
}

export function AppHeader({ onOpenSearch }: AppHeaderProps) {
  const [isDark, setIsDark] = useState(true);
  const [pm, setPm] = useState<PackageManager>('pnpm');

  useEffect(() => {
    // Check initial dark mode
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
    setPm(getPackageManagerPreference());

    const handleUpdate = () => {
      setPm(getPackageManagerPreference());
    };
    window.addEventListener('devui_storage_updated', handleUpdate);
    return () => window.removeEventListener('devui_storage_updated', handleUpdate);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const handlePmChange = (newPm: PackageManager) => {
    setPm(newPm);
    setPackageManagerPreference(newPm);
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-border/80 bg-background/90 px-4 md:px-6 backdrop-blur-md">
      {/* Left: Brand & stats */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform">
            <Layers className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold tracking-tight text-foreground text-sm">DevUI</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">Studio</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-2 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] text-muted-foreground font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{registry.length} Components Ready</span>
        </div>
      </div>

      {/* Center: Search trigger */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <button
          onClick={onOpenSearch}
          className="flex w-full items-center justify-between rounded-lg border border-border/80 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:border-emerald-500/40 hover:bg-muted/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Search components, tags, hooks...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 text-[10px] font-mono text-muted-foreground">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* Right: Controls & actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          aria-label="Open search"
          className="sm:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Package Manager Toggle */}
        <div className="hidden sm:flex items-center rounded-lg border border-border bg-muted/30 p-0.5 text-[11px] font-mono">
          {(['pnpm', 'npm', 'yarn', 'bun'] as PackageManager[]).map((pkg) => (
            <button
              key={pkg}
              onClick={() => handlePmChange(pkg)}
              className={`rounded-md px-2 py-0.5 transition-colors cursor-pointer ${
                pm === pkg
                  ? 'bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {pkg}
            </button>
          ))}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-background text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer"
        >
          {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
        </button>

        {/* GitHub / Backup Link */}
        <Link
          href="/settings#backup"
          className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-emerald-500/40 transition-colors"
        >
          <Github className="h-3.5 w-3.5" />
          <span>Local Repo</span>
        </Link>
      </div>
    </header>
  );
}
