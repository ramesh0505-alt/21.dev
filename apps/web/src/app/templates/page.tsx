'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ArrowRight, Sparkles, Layout, Check } from 'lucide-react';

export default function TemplatesPage() {
  const templates = [
    {
      id: 'tpl-dev-platform',
      title: 'Developer Platform Landing Page',
      category: 'SaaS & DevTools',
      description: 'Complete high-conversion landing template combining Geometric Hero, Bento Feature Grid, Terminal Preview, and Stats Card.',
      componentsUsed: ['hero-geometric', 'bento-grid', 'terminal-window', 'stats-card'],
      status: 'Ready',
    },
    {
      id: 'tpl-minimal-portfolio',
      title: 'Minimalist Engineering Portfolio',
      category: 'Portfolio',
      description: 'Clean personal showcase with macOS Floating Dock navigation, 3D Tilt project cards, and animated text shimmer headings.',
      componentsUsed: ['floating-dock', 'tilt-card', 'text-shimmer', 'animated-button'],
      status: 'Ready',
    },
    {
      id: 'tpl-dashboard-cockpit',
      title: 'API & Telemetry Dashboard',
      category: 'Dashboard',
      description: 'Telemetry monitoring cockpit with live Status Badges, metric KPI Stats Cards, and Sliding Indicator Tabs.',
      componentsUsed: ['stats-card', 'status-badge', 'tabs-slider', 'floating-input'],
      status: 'Prototype',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-0.5 text-xs font-medium text-purple-400 mb-2">
            <Package className="h-3.5 w-3.5" />
            <span>Full Compositions</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Website Templates</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Curated full-page layouts and multi-component compositions ready to assemble into Next.js applications.
          </p>
        </div>

        <div className="font-mono text-xs text-slate-400">
          <span className="text-emerald-400 font-bold">{templates.length}</span> Production Templates
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-slate-700 hover:bg-slate-900/90"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  {tpl.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{tpl.status}</span>
              </div>
              <h3 className="text-base font-bold text-white">{tpl.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{tpl.description}</p>

              <div className="pt-2">
                <div className="text-[11px] font-medium text-slate-300 mb-1.5">Composed of:</div>
                <div className="flex flex-wrap gap-1">
                  {tpl.componentsUsed.map((comp) => (
                    <Link
                      key={comp}
                      href={`/components/${comp}`}
                      className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 hover:text-emerald-400 transition-colors"
                    >
                      {comp}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <Link
                href={`/elements`}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <span>Inspect Stack</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
