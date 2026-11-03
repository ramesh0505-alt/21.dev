'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Copy,
  Check,
  Heart,
  Terminal,
  ArrowUpRight,
  Sparkles,
  Download,
} from 'lucide-react';
import { ComponentMeta } from '@/types/registry';
import { componentDemos } from '@/registry';
import {
  isFavorite,
  toggleFavorite,
  getInstallCommand,
  getPackageManagerPreference,
} from '@/lib/storage';
import { downloadComponentZip } from '@/lib/export-zip';

interface ComponentCardProps {
  component: ComponentMeta;
}

export function ComponentCard({ component }: ComponentCardProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    setStarred(isFavorite(component.slug));
    const handleUpdate = () => setStarred(isFavorite(component.slug));
    window.addEventListener('devui_storage_updated', handleUpdate);
    return () => window.removeEventListener('devui_storage_updated', handleUpdate);
  }, [component.slug]);

  const DemoComponent = componentDemos[component.slug];

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (component.code?.component) {
      navigator.clipboard.writeText(component.code.component);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyCli = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const pm = getPackageManagerPreference();
    const cmd = getInstallCommand(component.dependencies, pm);
    navigator.clipboard.writeText(cmd);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleToggleStar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFavorite(component.slug);
    setStarred(newState);
  };

  const handleDownloadZip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadComponentZip(component);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-emerald-950/20">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Link
            href={`/components/${component.slug}`}
            className="text-xs font-semibold text-slate-200 hover:text-emerald-400 transition-colors"
          >
            {component.name}
          </Link>
          <span className="rounded-full border border-slate-700/80 bg-slate-800/80 px-2 py-0.2 text-[10px] text-slate-400">
            {component.category}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToggleStar}
            aria-label="Add to favorites"
            className={`flex h-7 w-7 items-center justify-center rounded-md border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer ${
              starred ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : 'bg-slate-900'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${starred ? 'fill-rose-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Live Interactive Preview Stage */}
      <div className="relative flex min-h-[220px] w-full items-center justify-center overflow-hidden bg-slate-950/50 p-6 [background-image:radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:16px_16px]">
        {DemoComponent ? (
          <div className="w-full flex items-center justify-center">
            <DemoComponent />
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-mono">Interactive preview active</div>
        )}
      </div>

      {/* Description & metadata */}
      <div className="px-4 py-3 border-t border-slate-800/60 bg-slate-900/30">
        <p className="line-clamp-2 text-xs text-slate-400 leading-relaxed">
          {component.description}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {component.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-800/60 px-1.5 py-0.5 text-[9px] font-mono text-slate-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950/50 px-3 py-2 text-xs">
        <div className="flex items-center gap-1.5">
          {/* Copy Component Code */}
          <button
            onClick={handleCopyCode}
            title="Copy component code"
            className="flex items-center gap-1.5 rounded-md border border-slate-700/80 bg-slate-800/70 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-emerald-500/40 hover:text-white transition-colors cursor-pointer"
          >
            {copiedCode ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Code</span>
              </>
            )}
          </button>

          {/* Copy Installation CLI */}
          <button
            onClick={handleCopyCli}
            title="Copy installation CLI command"
            className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors cursor-pointer"
          >
            {copiedCli ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Terminal className="h-3 w-3" />
            )}
            <span>Install</span>
          </button>

          {/* Download ZIP */}
          <button
            onClick={handleDownloadZip}
            title="Download ZIP component package"
            className="flex items-center justify-center rounded-md border border-slate-800 bg-slate-900 h-7 w-7 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors cursor-pointer"
          >
            <Download className="h-3 w-3" />
          </button>
        </div>

        {/* View Details Link */}
        <Link
          href={`/components/${component.slug}`}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>Inspect</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
