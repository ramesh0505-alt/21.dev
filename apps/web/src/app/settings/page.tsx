'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Github,
  HardDrive,
  Terminal,
  Trash2,
  Check,
  Copy,
  FolderGit2,
  Package,
  Layers,
  Shield,
} from 'lucide-react';
import {
  PackageManager,
  getPackageManagerPreference,
  setPackageManagerPreference,
  getFavorites,
  getCollections,
  getRecentlyViewed,
} from '@/lib/storage';
import { registry } from '@/registry';

export default function SettingsPage() {
  const [pm, setPm] = useState<PackageManager>('pnpm');
  const [favCount, setFavCount] = useState(0);
  const [colCount, setColCount] = useState(0);
  const [recentCount, setRecentCount] = useState(0);
  const [copiedGit, setCopiedGit] = useState(false);

  useEffect(() => {
    setPm(getPackageManagerPreference());
    setFavCount(getFavorites().length);
    setColCount(getCollections().length);
    setRecentCount(getRecentlyViewed().length);
  }, []);

  const handlePmChange = (newPm: PackageManager) => {
    setPm(newPm);
    setPackageManagerPreference(newPm);
  };

  const handleClearCache = () => {
    if (confirm('Clear local favorites, recent history, and custom collections?')) {
      localStorage.removeItem('devui_favorites');
      localStorage.removeItem('devui_recent');
      localStorage.removeItem('devui_collections');
      setFavCount(0);
      setColCount(0);
      setRecentCount(0);
      window.dispatchEvent(new Event('devui_storage_updated'));
    }
  };

  const gitBackupCommands = `# 1. Initialize local repository (if not already done)
git init

# 2. Stage all components, demos, documentation, and registry
git add .

# 3. Commit current snapshot
git commit -m "feat(ui): personal local-first component library"

# 4. Connect to your private GitHub backup
git remote add origin git@github.com:your-username/private-ui-library.git

# 5. Push main branch
git branch -M main
git push -u origin main`;

  const handleCopyGit = () => {
    navigator.clipboard.writeText(gitBackupCommands);
    setCopiedGit(true);
    setTimeout(() => setCopiedGit(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 mb-2">
          <Settings className="h-3.5 w-3.5" />
          <span>Configuration & Workflows</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Library Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize package manager output, inspect storage volumes, and configure private GitHub backups.
        </p>
      </div>

      {/* Setting 1: Package Manager Preference */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-400" />
              <span>Default Package Manager</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Determines CLI commands generated in one-click copy buttons throughout the library.
            </p>
          </div>

          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs font-mono">
            {(['pnpm', 'npm', 'yarn', 'bun'] as PackageManager[]).map((pkg) => (
              <button
                key={pkg}
                onClick={() => handlePmChange(pkg)}
                className={`rounded-lg px-3 py-1 transition-colors cursor-pointer ${
                  pm === pkg
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {pkg}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Setting 2: Local Filesystem Storage */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-emerald-400" />
              <span>Local Storage & File Paths</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Component source code and metadata reside entirely in your filesystem. Zero cloud databases required.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
            <span className="text-[11px] text-slate-500 font-mono">Components Root</span>
            <div className="text-xs font-mono text-emerald-400">packages/ui/src/</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
            <span className="text-[11px] text-slate-500 font-mono">Central Registry</span>
            <div className="text-xs font-mono text-emerald-400">apps/web/src/registry/</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
            <span className="text-[11px] text-slate-500 font-mono">Registry Script</span>
            <div className="text-xs font-mono text-emerald-400">scripts/generate-registry.ts</div>
          </div>
        </div>
      </section>

      {/* Setting 3: Private GitHub Backup */}
      <section id="backup" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Github className="h-4 w-4 text-emerald-400" />
              <span>Private GitHub Backup Compatibility</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Keep your personal UI library versioned and synchronized with your private GitHub repository.
            </p>
          </div>

          <button
            onClick={handleCopyGit}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors cursor-pointer"
          >
            {copiedGit ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedGit ? 'Copied Commands' : 'Copy Git Script'}</span>
          </button>
        </div>

        <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
          <code>{gitBackupCommands}</code>
        </pre>
      </section>

      {/* Setting 4: Browser Cache Management */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-rose-400" />
              <span>Browser State Management</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Reset cached browser bookmarks, collections, and history counters.
            </p>
          </div>

          <button
            onClick={handleClearCache}
            className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
          >
            Clear Browser Cache
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2 text-center">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <div className="font-mono text-lg font-bold text-white">{favCount}</div>
            <div className="text-[11px] text-slate-500">Favorites</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <div className="font-mono text-lg font-bold text-white">{colCount}</div>
            <div className="text-[11px] text-slate-500">Collections</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <div className="font-mono text-lg font-bold text-white">{recentCount}</div>
            <div className="text-[11px] text-slate-500">Recent Views</div>
          </div>
        </div>
      </section>
    </div>
  );
}

