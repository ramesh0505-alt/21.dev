'use client';

import React from 'react';
import { Bookmark, ExternalLink, Palette, Type, Sliders, Shield } from 'lucide-react';

export default function ReferencesPage() {
  const colorTokens = [
    { name: 'Canvas Dark', value: '#090D16', label: 'Primary background' },
    { name: 'Surface Slate', value: '#0F1624', label: 'Card surfaces' },
    { name: 'Subtle Border', value: '#1E293B', label: 'Card & divider borders' },
    { name: 'Emerald 500', value: '#10B981', label: 'Primary accent & focus ring' },
    { name: 'Emerald 400', value: '#34D399', label: 'Hover & highlighted text' },
    { name: 'Foreground', value: '#F1F5F9', label: 'Primary typography' },
    { name: 'Muted Text', value: '#94A3B8', label: 'Secondary metadata' },
  ];

  const externalReferences = [
    {
      title: '21st.dev Component Catalog',
      url: 'https://21st.dev',
      description: 'Design inspiration and discovery workflow reference for craft UI.',
    },
    {
      title: 'Motion for React (Framer Motion)',
      url: 'https://motion.dev',
      description: 'Physics-based layout animations, spring interpolation, and gesture handlers.',
    },
    {
      title: 'Tailwind CSS Documentation',
      url: 'https://tailwindcss.com',
      description: 'Utility-first styling primitives and configuration standards.',
    },
    {
      title: 'Lucide Icons Directory',
      url: 'https://lucide.dev',
      description: 'Consistent, clean SVG icon system for modern developer tools.',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 mb-2">
            <Bookmark className="h-3.5 w-3.5" />
            <span>Design Tokens & Foundations</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Design References</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Token standards, typography systems, and architectural references guiding component implementations.
          </p>
        </div>
      </div>

      {/* Color Tokens Palette */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Palette className="h-4 w-4 text-emerald-400" />
          <span>Core Design System Palette</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {colorTokens.map((token) => (
            <div
              key={token.name}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-2"
            >
              <div
                className="h-12 w-full rounded-lg border border-white/10 shadow-inner"
                style={{ backgroundColor: token.value }}
              />
              <div>
                <div className="text-xs font-semibold text-white">{token.name}</div>
                <div className="font-mono text-[10px] text-emerald-400">{token.value}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{token.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* External References Grid */}
      <section className="space-y-4 pt-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ExternalLink className="h-4 w-4 text-emerald-400" />
          <span>External Architecture & Design References</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {externalReferences.map((ref) => (
            <a
              key={ref.title}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-all hover:border-emerald-500/40 hover:bg-slate-900/80 group"
            >
              <div className="space-y-1">
                <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>{ref.title}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{ref.description}</p>
                <div className="font-mono text-[10px] text-slate-500 pt-1">{ref.url}</div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

