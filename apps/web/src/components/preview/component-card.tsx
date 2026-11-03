'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Copy,
  Check,
  Bookmark,
  Sparkles,
  ArrowUpRight,
  Download,
  Terminal,
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
  ranking?: number;
  onSelect?: (component: ComponentMeta) => void;
}

export function ComponentCard({ component, ranking, onSelect }: ComponentCardProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isFavorite(component.slug));
    const handleUpdate = () => setSaved(isFavorite(component.slug));
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

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavorite(component.slug);
    setSaved(next);
  };

  const handleDownloadZip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadComponentZip(component);
  };

  return (
    <div
      onClick={() => onSelect?.(component)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/40 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/80 cursor-pointer"
    >
      {/* Background Watermark Ranking Number (e.g. 1, 2, 3, 4 from 21st.dev Screenshot 1) */}
      {ranking !== undefined && (
        <span className="pointer-events-none absolute -bottom-6 -left-3 select-none font-sans text-9xl font-black text-neutral-800/30 group-hover:text-neutral-800/50 transition-colors">
          {ranking}
        </span>
      )}

      {/* Live Interactive Preview Stage (High-contrast canvas like 21st.dev) */}
      <div className="relative flex min-h-[240px] w-full items-center justify-center overflow-hidden rounded-t-2xl bg-neutral-950 p-6 [background-image:radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:16px_16px]">
        {DemoComponent ? (
          <div className="w-full flex items-center justify-center pointer-events-auto">
            <DemoComponent />
          </div>
        ) : (
          <div className="text-xs text-neutral-500 font-mono">Live Preview</div>
        )}
      </div>

      {/* Card Info & Quick Actions Footer */}
      <div className="relative z-10 flex items-center justify-between border-t border-neutral-800/80 bg-neutral-950/70 px-4 py-3">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-neutral-200 group-hover:text-white transition-colors truncate max-w-[170px]">
            {component.name}
          </span>
          <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
            {component.category}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Copy Code Button */}
          <button
            onClick={handleCopyCode}
            title="Copy component code"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
          >
            {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          {/* Quick Save Bookmark Button */}
          <button
            onClick={handleToggleSave}
            title="Bookmark component"
            className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
              saved
                ? 'border-purple-500/40 bg-purple-500/10 text-purple-400'
                : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-purple-400' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
