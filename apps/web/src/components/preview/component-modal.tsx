'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Maximize2,
  Copy,
  Check,
  Bookmark,
  Share2,
  Sparkles,
  ChevronDown,
  Terminal,
  ExternalLink,
  Download,
  RotateCcw,
} from 'lucide-react';
import { ComponentMeta } from '@/types/registry';
import { componentDemos } from '@/registry';
import { isFavorite, toggleFavorite, getInstallCommand, getPackageManagerPreference } from '@/lib/storage';
import { downloadComponentZip } from '@/lib/export-zip';

interface ComponentModalProps {
  component: ComponentMeta | null;
  onClose: () => void;
}

export function ComponentModal({ component, onClose }: ComponentModalProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [saved, setSaved] = useState(false);
  const [remountKey, setRemountKey] = useState(0);

  useEffect(() => {
    if (component) {
      setSaved(isFavorite(component.slug));
    }
  }, [component]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!component) return null;

  const DemoComponent = componentDemos[component.slug];

  const handleCopyCode = () => {
    if (component.code?.component) {
      navigator.clipboard.writeText(component.code.component);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleToggleSave = () => {
    const next = toggleFavorite(component.slug);
    setSaved(next);
  };

  const handleDownloadZip = () => {
    downloadComponentZip(component);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-950 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-purple-500 via-rose-500 to-amber-500 p-0.5 flex items-center justify-center">
              <div className="h-full w-full rounded-full bg-neutral-950 flex items-center justify-center text-[10px] font-bold text-white">
                21
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-neutral-100">{component.name}</h3>
                <span className="rounded-full bg-neutral-800 px-2 py-0.2 text-[10px] text-neutral-400 font-mono">
                  {component.category}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/components/${component.slug}`}
              className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-850"
              title="Open full page"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setRemountKey((k) => k + 1)}
              className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-850"
              title="Reset state"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-850"
              title="Close modal (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Center Canvas Stage */}
        <div className="relative flex-1 overflow-auto bg-neutral-950 p-6 md:p-10 flex items-center justify-center min-h-[380px]">
          <div key={remountKey} className="w-full flex items-center justify-center">
            {DemoComponent ? (
              <DemoComponent />
            ) : (
              <div className="text-neutral-500 text-sm font-mono">No demo component registered</div>
            )}
          </div>
        </div>

        {/* Bottom Action Dock Bar */}
        <div className="flex flex-wrap items-center justify-between border-t border-neutral-800/80 bg-neutral-950 px-6 py-3.5 gap-3">
          {/* Left Buttons: Remix & Save */}
          <div className="flex items-center gap-2">
            <Link
              href="/playground"
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-neutral-400" />
              <span>Remix</span>
            </Link>

            <button
              onClick={handleToggleSave}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                saved
                  ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700 hover:text-white'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-purple-400' : ''}`} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleDownloadZip}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
              title="Download standalone ZIP"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>ZIP</span>
            </button>
          </div>

          {/* Right Action: Copy code */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? 'Copied code!' : 'Copy code'}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70 ml-1 border-l border-blue-400/30 pl-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
