'use client';

import React, { useState, useMemo } from 'react';
import { Package, Search, Copy, Check, ExternalLink, ShieldCheck, Layers } from 'lucide-react';
import { registry } from '@/registry';
import Link from 'next/link';

interface DepAnalysis {
  name: string;
  usageCount: number;
  components: { name: string; slug: string }[];
  tier: 'Core Utility' | 'Animation Engine' | '3D / Graphics' | 'Specialized';
  versionEstimate: string;
}

const TIER_MAPPINGS: Record<string, 'Core Utility' | 'Animation Engine' | '3D / Graphics' | 'Specialized'> = {
  clsx: 'Core Utility',
  'tailwind-merge': 'Core Utility',
  'lucide-react': 'Core Utility',
  motion: 'Animation Engine',
  'framer-motion': 'Animation Engine',
  'canvas-confetti': 'Specialized',
  three: '3D / Graphics',
  '@react-three/fiber': '3D / Graphics',
  '@react-three/drei': '3D / Graphics',
};

export default function DependenciesPage() {
  const [search, setSearch] = useState('');
  const [packageManager, setPackageManager] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm');
  const [copiedDep, setCopiedDep] = useState<string | null>(null);

  // Group dependencies from registry
  const dependencies = useMemo(() => {
    const map = new Map<string, { count: number; components: { name: string; slug: string }[] }>();

    for (const comp of registry) {
      for (const dep of comp.dependencies) {
        const existing = map.get(dep) || { count: 0, components: [] };
        existing.count += 1;
        existing.components.push({ name: comp.name, slug: comp.slug });
        map.set(dep, existing);
      }
    }

    const list: DepAnalysis[] = [];
    for (const [name, info] of map.entries()) {
      list.push({
        name,
        usageCount: info.count,
        components: info.components,
        tier: TIER_MAPPINGS[name] || 'Specialized',
        versionEstimate: '^1.0.0',
      });
    }

    return list.sort((a, b) => b.usageCount - a.usageCount);
  }, []);

  const filtered = useMemo(() => {
    return dependencies.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  }, [dependencies, search]);

  const copyInstallCommand = (depName: string) => {
    const cmd =
      packageManager === 'pnpm'
        ? `pnpm add ${depName}`
        : packageManager === 'npm'
        ? `npm install ${depName}`
        : packageManager === 'yarn'
        ? `yarn add ${depName}`
        : `bun add ${depName}`;
    navigator.clipboard.writeText(cmd);
    setCopiedDep(depName);
    setTimeout(() => setCopiedDep(null), 2000);
  };

  const copyAllDepsCommand = () => {
    const allNames = dependencies.map((d) => d.name).join(' ');
    const cmd =
      packageManager === 'pnpm'
        ? `pnpm add ${allNames}`
        : packageManager === 'npm'
        ? `npm install ${allNames}`
        : packageManager === 'yarn'
        ? `yarn add ${allNames}`
        : `bun add ${allNames}`;
    navigator.clipboard.writeText(cmd);
    setCopiedDep('all');
    setTimeout(() => setCopiedDep(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
      {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Package className="h-4 w-4" />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                  Package Analysis
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white font-serif">
                Dependency Manager
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                Audit, inspect, and install runtime peer dependencies required across all 28 registered components.
                Zero bloat: only vetted developer utilities and motion libraries are included.
              </p>
            </div>

            <button
              onClick={copyAllDepsCommand}
              className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition-colors"
            >
              {copiedDep === 'all' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copiedDep === 'all' ? 'Copied All Dependencies' : 'Copy All Packages Command'}</span>
            </button>
          </div>

          {/* Package Manager Selector + Search */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 mr-1">Package Manager:</span>
              {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => (
                <button
                  key={pm}
                  onClick={() => setPackageManager(pm)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-colors ${
                    packageManager === pm
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>

            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search packages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Dependencies Table / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((dep) => (
              <div
                key={dep.name}
                className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                      {dep.tier}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Used by {dep.usageCount} {dep.usageCount === 1 ? 'component' : 'components'}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white font-mono">{dep.name}</h3>

                  {/* Components using this package */}
                  <div className="mt-3">
                    <div className="text-[11px] text-slate-400 mb-1.5">Referenced in:</div>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto scrollbar-none">
                      {dep.components.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/components/${c.slug}`}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 transition-colors"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    {packageManager} add {dep.name}
                  </span>
                  <button
                    onClick={() => copyInstallCommand(dep.name)}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    {copiedDep === dep.name ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedDep === dep.name ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
    </div>
  );
}
