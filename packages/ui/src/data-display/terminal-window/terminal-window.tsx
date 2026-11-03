'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TerminalLine {
  type?: 'command' | 'output' | 'success' | 'error';
  text: string;
}

export interface TerminalWindowProps {
  title?: string;
  lines: TerminalLine[];
  className?: string;
}

export function TerminalWindow({
  title = 'zsh — 80x24',
  lines,
  className,
}: TerminalWindowProps) {
  const [copied, setCopied] = useState(false);

  const fullText = lines.map((l) => l.text).join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'w-full max-w-2xl overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl font-mono text-xs',
        className
      )}
    >
      {/* Chrome header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <Terminal className="h-3.5 w-3.5 text-slate-500" />
          <span>{title}</span>
        </div>

        <button
          onClick={handleCopy}
          aria-label="Copy terminal contents"
          className="flex h-6 w-6 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Terminal body */}
      <div className="p-4 space-y-2 overflow-x-auto">
        {lines.map((line, idx) => {
          if (line.type === 'command') {
            return (
              <div key={idx} className="flex items-center gap-2 text-slate-200">
                <span className="text-emerald-400 select-none">❯</span>
                <span className="text-slate-100 font-semibold">{line.text}</span>
              </div>
            );
          }
          if (line.type === 'success') {
            return (
              <div key={idx} className="text-emerald-400/90 pl-4">
                {line.text}
              </div>
            );
          }
          if (line.type === 'error') {
            return (
              <div key={idx} className="text-red-400/90 pl-4">
                {line.text}
              </div>
            );
          }
          return (
            <div key={idx} className="text-slate-400 pl-4 leading-relaxed">
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

