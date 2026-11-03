'use client';

import React from 'react';
import { FlaskConical, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import { registry } from '@/registry';
import { ComponentCard } from '@/components/preview/component-card';

export default function ExperimentsPage() {
  const experimentalComponents = registry.filter(
    (c) => c.status === 'Prototype' || c.status === 'Reference' || c.status === 'Inbox'
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-0.5 text-xs font-medium text-purple-400 mb-2">
            <FlaskConical className="h-3.5 w-3.5" />
            <span>R&D Laboratory</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Experimental Sandbox</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Early prototypes, experimental animation shaders, and prospective components undergoing evaluation.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-mono text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Isolated Component Execution</span>
        </div>
      </div>

      {experimentalComponents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experimentalComponents.map((component) => (
            <ComponentCard key={component.id} component={component} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-4 text-center max-w-lg mx-auto">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-purple-400">
            <FlaskConical className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-white">All components currently promoted to Ready</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            When you add a new component manifest with status <code className="text-purple-400 font-mono">&quot;Prototype&quot;</code> or <code className="text-purple-400 font-mono">&quot;Inbox&quot;</code>, it will be sequestered here for lab testing before promotion to the core catalog.
          </p>
        </div>
      )}
    </div>
  );
}

