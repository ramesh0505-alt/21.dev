'use client';

import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { ComponentMeta } from '@/types/registry';
import { componentDemos } from '@/registry';
import {
  isFavorite,
  toggleFavorite,
} from '@/lib/storage';

interface ComponentCardProps {
  component: ComponentMeta;
  ranking?: number;
  previewBg?: 'light' | 'dark';
  onSelect?: (component: ComponentMeta) => void;
}

export function ComponentCard({ component, ranking, previewBg = 'dark', onSelect }: ComponentCardProps) {
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

  const isLightPreview = previewBg === 'light';

  return (
    <div className="relative group select-none">
      {/* Background Watermark Ranking Number (e.g. 1, 2, 3, 4 from 21st.dev Screenshot 1) */}
      {ranking !== undefined && (
        <span className="pointer-events-none absolute -left-7 top-1/2 -translate-y-1/2 z-0 font-sans text-[110px] md:text-[130px] font-black tracking-tighter text-neutral-800/40 group-hover:text-neutral-800/70 transition-colors select-none">
          {ranking}
        </span>
      )}

      {/* Main Interactive Card */}
      <div
        onClick={() => onSelect?.(component)}
        className="relative z-10 flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/60 shadow-xl transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
      >
        {/* Live Interactive Preview Stage matching 21st.dev */}
        <div
          className={`relative flex h-[230px] sm:h-[250px] w-full items-center justify-center overflow-hidden rounded-t-2xl p-4 transition-colors ${
            isLightPreview
              ? 'bg-white text-neutral-950'
              : 'bg-neutral-950 text-white [background-image:radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:16px_16px]'
          }`}
        >
          {DemoComponent ? (
            <div className="w-full h-full flex items-center justify-center pointer-events-auto transform scale-[0.88] origin-center">
              <DemoComponent />
            </div>
          ) : (
            <div className="text-xs text-neutral-500 font-mono">Live Preview</div>
          )}

          {/* Quick slot indicators on top left */}
          <div className="absolute top-3 left-3 flex items-center gap-1 z-30">
            <span className="inline-flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-sm border border-neutral-800 px-2 py-0.5 text-[9px] font-mono text-neutral-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Preview Slot</span>
            </span>
          </div>

          {/* Floating Quick Action Overlay on Hover */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-30">
            <button
              onClick={handleCopyCode}
              title="Copy code"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-700/80 bg-neutral-900/90 text-neutral-300 hover:text-white shadow-md transition-colors"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={handleToggleSave}
              title="Bookmark"
              className={`flex h-7 w-7 items-center justify-center rounded-lg border shadow-md transition-colors ${
                saved
                  ? 'border-purple-500/40 bg-purple-600/20 text-purple-300'
                  : 'border-neutral-700/80 bg-neutral-900/90 text-neutral-300 hover:text-white'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-purple-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Card Info & Quick Actions Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-neutral-800/80 bg-neutral-950/80 px-4 py-2.5">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-neutral-200 group-hover:text-white transition-colors truncate max-w-[180px]">
              {component.name}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              {component.category}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[9px] font-mono text-neutral-400 border border-neutral-800">
              {component.framework}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
