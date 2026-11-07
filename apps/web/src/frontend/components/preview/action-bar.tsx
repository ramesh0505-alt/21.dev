'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bookmark,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Code2,
  Terminal,
} from 'lucide-react';
import { ComponentMeta } from '@/types/registry';
import {
  isFavorite,
  toggleFavorite,
  getInstallCommand,
  getPackageManagerPreference,
} from '@/lib/storage';
import { downloadComponentZip } from '@/lib/export-zip';

interface ActionBarProps {
  component: ComponentMeta;
  onOpenRemix?: () => void;
  onToggleSimilar?: () => void;
  isSimilarView?: boolean;
}

export function ActionBar({
  component,
  onOpenRemix,
  onToggleSimilar,
  isSimilarView = false,
}: ActionBarProps) {
  const [saved, setSaved] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [copyDropdownOpen, setCopyDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSaved(isFavorite(component.slug));
    const update = () => setSaved(isFavorite(component.slug));
    window.addEventListener('devui_storage_updated', update);
    return () => window.removeEventListener('devui_storage_updated', update);
  }, [component.slug]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCopyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleSave = () => {
    const next = toggleFavorite(component.slug);
    setSaved(next);
  };

  const handleCopy = (type: 'source' | 'install' | 'prompt' | 'usage') => {
    let content = '';
    const pm = getPackageManagerPreference();

    if (type === 'source' || type === 'prompt') {
      content = component.code?.component || '';
    } else if (type === 'install') {
      content = getInstallCommand(component.dependencies, pm);
    } else if (type === 'usage') {
      content = `import { ${component.name.replace(/[^a-zA-Z0-9]/g, '')} } from '@/components/ui/${component.slug}';`;
    }

    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setCopyDropdownOpen(false);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="relative mx-auto flex flex-col items-center gap-2 pointer-events-auto select-none">
      {/* 1. Main Action Bar matching 21st.dev Screenshot & Video */}
      <div className="flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-neutral-800/90 bg-neutral-900/95 p-1.5 shadow-2xl backdrop-blur-xl text-xs">
        {/* Remix Button */}
        {onOpenRemix ? (
          <button
            onClick={onOpenRemix}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-950/80 px-3.5 py-2 font-medium text-neutral-200 hover:border-neutral-700 hover:text-white transition-colors cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Remix</span>
          </button>
        ) : (
          <Link
            href={`/remix/${component.slug}`}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-950/80 px-3.5 py-2 font-medium text-neutral-200 hover:border-neutral-700 hover:text-white transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Remix</span>
          </Link>
        )}

        {/* Save Bookmark Button */}
        <button
          onClick={handleToggleSave}
          className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-medium transition-colors cursor-pointer ${
            saved
              ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
              : 'border-neutral-800 bg-neutral-950/80 text-neutral-300 hover:border-neutral-700 hover:text-white'
          }`}
        >
          <Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-purple-400 text-purple-400' : ''}`} />
          <span>{saved ? 'Saved' : 'Save'}</span>
        </button>

        {/* Primary Blue Button: Copy Prompt / Copy Code with Dropdown caret */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30 overflow-hidden">
            <button
              onClick={() => handleCopy('prompt')}
              className="flex items-center gap-2 px-4 py-2 font-semibold text-white cursor-pointer"
            >
              {copiedType ? (
                <>
                  <Check className="h-3.5 w-3.5 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy prompt</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCopyDropdownOpen(!copyDropdownOpen)}
              className="border-l border-blue-400/30 px-2 py-2 hover:bg-blue-700/40 transition-colors cursor-pointer"
              title="More copy options"
            >
              <ChevronDown className={`h-3.5 w-3.5 text-white transition-transform ${copyDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Copy Dropdown Menu */}
          {copyDropdownOpen && (
            <div className="absolute bottom-full right-0 mb-3 w-64 rounded-2xl border border-neutral-800 bg-neutral-950 p-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 z-50">
              <div className="px-2 py-1 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                Copy Options
              </div>
              <button
                onClick={() => handleCopy('source')}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
              >
                <Code2 className="h-3.5 w-3.5 text-neutral-400" />
                <span>Copy component code</span>
              </button>
              <button
                onClick={() => handleCopy('install')}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
              >
                <Terminal className="h-3.5 w-3.5 text-neutral-400" />
                <span>Copy install command</span>
              </button>
              <button
                onClick={() => handleCopy('usage')}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5 text-neutral-400" />
                <span>Copy import statement</span>
              </button>
              <div className="my-1 border-t border-neutral-900" />
              <button
                onClick={() => downloadComponentZip(component)}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-emerald-400" />
                <span>Download .ZIP package</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. "See similar v" / "Back to preview ^" Trigger Button matching the video */}
      {onToggleSimilar && (
        <button
          onClick={onToggleSimilar}
          className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-950/95 px-4 py-1.5 text-[11px] font-medium text-neutral-300 hover:border-neutral-700 hover:text-white hover:bg-neutral-900 transition-all shadow-lg cursor-pointer"
        >
          <span>{isSimilarView ? 'Back to preview' : 'See similar'}</span>
          {isSimilarView ? (
            <ChevronUp className="h-3.5 w-3.5 text-neutral-400" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
          )}
        </button>
      )}
    </div>
  );
}
