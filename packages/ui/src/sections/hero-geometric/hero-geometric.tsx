'use client';

import React from 'react';
import { ArrowRight, Sparkles, Terminal, Copy, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface HeroGeometricProps {
  badge?: string;
  title: string;
  highlightedText?: string;
  description: string;
  primaryCta?: {
    label: string;
    onClick?: () => void;
  };
  secondaryCta?: {
    label: string;
    onClick?: () => void;
  };
  command?: string;
  className?: string;
}

export function HeroGeometric({
  badge = 'Introducing v2.0 with React 19',
  title = 'The Engineering Standard for',
  highlightedText = 'Modern User Interfaces',
  description = 'A meticulously crafted personal component system designed to build high-grade developer tools, SaaS applications, and interactive digital products.',
  primaryCta = { label: 'Explore Components' },
  secondaryCta = { label: 'Documentation' },
  command = 'pnpm add @ui-library/ui motion lucide-react',
  className,
}: HeroGeometricProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className={cn(
        'relative overflow-hidden py-16 px-6 text-center border-b border-slate-800/80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950',
        className
      )}
    >
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Release Pill Badge */}
        {badge && (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{badge}</span>
          </div>
        )}

        {/* Editorial Heading */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
          {title}{' '}
          <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            {highlightedText}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
          {description}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={primaryCta.onClick}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <span>{primaryCta.label}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={secondaryCta.onClick}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-6 py-3 text-sm font-medium text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <span>{secondaryCta.label}</span>
          </button>
        </div>

        {/* Terminal Quick Copy Bar */}
        {command && (
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-2 font-mono text-xs text-slate-300 shadow-inner">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              <span>{command}</span>
              <button
                onClick={handleCopy}
                aria-label="Copy terminal command"
                className="ml-2 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
