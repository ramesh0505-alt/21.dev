'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, ArrowRight, Sparkles, Layout, Check, Copy, Eye, ExternalLink } from 'lucide-react';
import { useAdminTemplates, AdminTemplate } from '@/lib/admin-store';
import { componentDemos } from '@/registry';
import { SafePreviewBoundary } from '@/components/preview/safe-preview-boundary';

export default function TemplatesPage() {
  const templates = useAdminTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<AdminTemplate>(templates[0]);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const activeTpl = selectedTemplate || templates[0];

  const handleCopyStackInstall = (tpl: AdminTemplate) => {
    const cmd = `npx @ui-library/cli add ${tpl.componentSlugs.join(' ')}`;
    navigator.clipboard.writeText(cmd);
    setCopiedSlug(tpl.id);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 mb-2">
            <Package className="h-3.5 w-3.5" />
            <span>Full Application Compositions</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-serif">
            Production Templates
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Assembled multi-component layouts and turnkey full-page templates. Test component synergy in real time,
            preview composite viewports, and install the entire dependency stack with one command.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/templates"
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            Admin Templates Studio
          </Link>
          <div className="font-mono text-xs text-slate-400">
            <span className="text-emerald-400 font-bold">{templates.length}</span> Active Templates
          </div>
        </div>
      </div>

      {/* Templates Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((tpl) => {
          const isSelected = activeTpl?.id === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className={`flex flex-col justify-between rounded-2xl border p-6 transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 bg-slate-900 shadow-xl ring-1 ring-emerald-500/50'
                  : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {tpl.framework}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                      tpl.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {tpl.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{tpl.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {tpl.description}
                </p>

                <div className="pt-2">
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5">Integrated Components:</div>
                  <div className="flex flex-wrap gap-1">
                    {tpl.componentSlugs.map((comp) => (
                      <span
                        key={comp}
                        className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyStackInstall(tpl);
                  }}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  {copiedSlug === tpl.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedSlug === tpl.id ? 'Copied CLI Command' : 'Copy Stack CLI'}</span>
                </button>

                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <span>View Below</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Composite Preview Stage */}
      {activeTpl && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Eye className="h-3.5 w-3.5" />
                <span>COMPOSITE LIVE STAGE</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                {activeTpl.name}
              </h2>
            </div>

            <button
              onClick={() => handleCopyStackInstall(activeTpl)}
              className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition-colors"
            >
              {copiedSlug === activeTpl.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>Copy Full Stack Install Command</span>
            </button>
          </div>

          {/* Render composite children in order */}
          <div className="rounded-2xl border border-slate-800 bg-[#070A11] p-8 space-y-12">
            {activeTpl.componentSlugs.map((slug) => {
              const DemoComp = componentDemos[slug];
              return (
                <div key={slug} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Section: {slug}
                    </span>
                    <Link
                      href={`/components/${slug}`}
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Isolated Demo</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="flex items-center justify-center py-6">
                    {DemoComp ? (
                      <SafePreviewBoundary componentName={slug}>
                        <DemoComp />
                      </SafePreviewBoundary>
                    ) : (
                      <div className="text-xs font-mono text-slate-500">Component [{slug}] Demo Active</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
