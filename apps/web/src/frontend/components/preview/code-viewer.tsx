'use client';

import React, { useState } from 'react';
import { Copy, Check, FileCode, Maximize2, Minimize2 } from 'lucide-react';

interface CodeViewerProps {
  files: {
    name: string;
    code: string;
    language?: string;
  }[];
  className?: string;
}

export function CodeViewer({ files, className }: CodeViewerProps) {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFile = files[activeFileIndex] || files[0];

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = activeFile ? activeFile.code.split('\n') : [];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs shadow-2xl transition-all ${
        isExpanded ? 'fixed inset-4 z-50 max-h-none' : 'max-h-[600px]'
      } ${className || ''}`}
    >
      {/* Top File Switcher Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-3 py-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {files.map((file, idx) => {
            const isActive = idx === activeFileIndex;
            return (
              <button
                key={file.name}
                onClick={() => setActiveFileIndex(idx)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-mono transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700/60 font-medium'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <FileCode className="h-3.5 w-3.5 text-slate-400" />
                <span>{file.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md border border-slate-700/80 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-sans">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="font-sans">Copy File</span>
              </>
            )}
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Expand code viewer"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
          >
            {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Code Display with Line Numbers */}
      <div className="max-h-[520px] overflow-auto p-4 flex gap-4 bg-slate-950 leading-relaxed text-slate-200">
        {/* Line Numbers */}
        <div className="select-none text-right font-mono text-slate-600 text-xs pr-2 border-r border-slate-800/60">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Content */}
        <pre className="flex-1 overflow-x-auto font-mono text-xs">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="hover:bg-slate-900/60 rounded px-1">
                {line || '\n'}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

