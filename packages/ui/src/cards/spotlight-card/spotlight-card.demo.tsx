'use client';

import React from 'react';
import { SpotlightCard } from './spotlight-card';
import { Lock, Zap, Gauge } from 'lucide-react';

export function SpotlightCardDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-8">
      <SpotlightCard className="w-80" spotlightColor="rgba(16, 185, 129, 0.2)">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <Zap className="h-5 w-5" />
        </div>
        <h4 className="mt-4 text-base font-semibold text-white">Instant Compilation</h4>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          Near-instant feedback loop with multi-threaded Rust AST transformation engine.
        </p>
      </SpotlightCard>

      <SpotlightCard className="w-80" spotlightColor="rgba(56, 189, 248, 0.2)">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400">
          <Lock className="h-5 w-5" />
        </div>
        <h4 className="mt-4 text-base font-semibold text-white">Keyless Authentication</h4>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          OpenID Connect identity federation eliminates hardcoded long-lived service tokens.
        </p>
      </SpotlightCard>
    </div>
  );
}

export default SpotlightCardDemo;

