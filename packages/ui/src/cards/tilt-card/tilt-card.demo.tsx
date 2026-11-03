'use client';

import React from 'react';
import { TiltCard } from './tilt-card';
import { ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';

export function TiltCardDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-8">
      <TiltCard className="w-80">
        <div className="flex items-center justify-between text-slate-400">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Cpu className="h-5 w-5" />
          </div>
          <span className="font-mono text-xs text-slate-400">v2.4.0</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-100">Neural Compiler</h3>
        <p className="mt-2 text-sm text-slate-400">
          Zero-overhead AST graph optimizer with automatic vectorization for serverless execution.
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
          <span className="text-xs font-medium text-emerald-400">Optimized for Edge</span>
          <ArrowUpRight className="h-4 w-4 text-slate-400" />
        </div>
      </TiltCard>

      <TiltCard className="w-80">
        <div className="flex items-center justify-between text-slate-400">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-mono text-xs text-slate-400">SOC2 Type II</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-100">Hardware Attestation</h3>
        <p className="mt-2 text-sm text-slate-400">
          Cryptographically verified secure enclave execution with zero knowledge key storage.
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
          <span className="text-xs font-medium text-sky-400">Verified</span>
          <ArrowUpRight className="h-4 w-4 text-slate-400" />
        </div>
      </TiltCard>
    </div>
  );
}

export default TiltCardDemo;
