'use client';

import React, { useState, useEffect } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Palette, Copy, Check, Sparkles, Sliders, RefreshCw, Sun, Moon } from 'lucide-react';
import { ShimmerButton } from '@ui-library/ui';

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  bg: string;
  surface: string;
  surfaceHover: string;
  border: string;
  accent: string;
  accentHover: string;
  textPrimary: string;
  textSecondary: string;
  cssVars: Record<string, string>;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'deep-navy',
    name: 'Deep Navy (Default)',
    description: 'Ultra-refined 21st.dev developer environment with deep obsidian navy and emerald accents.',
    bg: '#0B0F19',
    surface: '#111827',
    surfaceHover: '#1F2937',
    border: '#1E293B',
    accent: '#10B981',
    accentHover: '#059669',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    cssVars: {
      '--background': '222 47% 7%',
      '--foreground': '210 40% 98%',
      '--card': '222 47% 11%',
      '--card-foreground': '210 40% 98%',
      '--primary': '160 84% 39%',
      '--primary-foreground': '222 47% 7%',
      '--border': '217 33% 17%',
      '--muted': '217 33% 17%',
      '--muted-foreground': '215 20.2% 65.1%',
    },
  },
  {
    id: 'cyber-emerald',
    name: 'Cyber Emerald',
    description: 'High-contrast nocturnal forest theme with deep spruce slate and bioluminescent emerald.',
    bg: '#061412',
    surface: '#0B221F',
    surfaceHover: '#133530',
    border: '#16433C',
    accent: '#10B981',
    accentHover: '#34D399',
    textPrimary: '#ECFDF5',
    textSecondary: '#6EE7B7',
    cssVars: {
      '--background': '170 55% 5%',
      '--foreground': '152 80% 96%',
      '--card': '171 50% 9%',
      '--card-foreground': '152 80% 96%',
      '--primary': '160 84% 39%',
      '--primary-foreground': '170 55% 5%',
      '--border': '171 50% 17%',
      '--muted': '171 50% 17%',
      '--muted-foreground': '158 64% 52%',
    },
  },
  {
    id: 'charcoal-slate',
    name: 'Charcoal Slate',
    description: 'Technical Swiss modernist darkroom with neutral graphite and arctic sky highlights.',
    bg: '#0F172A',
    surface: '#1E293B',
    surfaceHover: '#334155',
    border: '#334155',
    accent: '#38BDF8',
    accentHover: '#0EA5E9',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    cssVars: {
      '--background': '222 47% 11%',
      '--foreground': '210 40% 98%',
      '--card': '217 33% 17%',
      '--card-foreground': '210 40% 98%',
      '--primary': '199 89% 48%',
      '--primary-foreground': '222 47% 11%',
      '--border': '215 25% 27%',
      '--muted': '215 25% 27%',
      '--muted-foreground': '215 20.2% 65.1%',
    },
  },
  {
    id: 'minimal-monochrome',
    name: 'Minimal Monochrome',
    description: 'Pure editorial zero-saturation studio black and zinc white precision palette.',
    bg: '#09090B',
    surface: '#18181B',
    surfaceHover: '#27272A',
    border: '#27272A',
    accent: '#FAFAFA',
    accentHover: '#E4E4E7',
    textPrimary: '#FAFAFA',
    textSecondary: '#A1A1AA',
    cssVars: {
      '--background': '240 10% 4%',
      '--foreground': '0 0% 98%',
      '--card': '240 5.9% 10%',
      '--card-foreground': '0 0% 98%',
      '--primary': '0 0% 98%',
      '--primary-foreground': '240 10% 4%',
      '--border': '240 3.7% 15.9%',
      '--muted': '240 3.7% 15.9%',
      '--muted-foreground': '240 5% 64.9%',
    },
  },
  {
    id: 'amber-terminal',
    name: 'Amber Terminal',
    description: 'Vintage high-performance console theme with rich bronze warmth and amber phosphor.',
    bg: '#0C0A09',
    surface: '#1C1917',
    surfaceHover: '#292524',
    border: '#292524',
    accent: '#F59E0B',
    accentHover: '#D97706',
    textPrimary: '#FAFAF9',
    textSecondary: '#A8A29E',
    cssVars: {
      '--background': '20 14% 4%',
      '--foreground': '60 9% 98%',
      '--card': '24 10% 10%',
      '--card-foreground': '60 9% 98%',
      '--primary': '38 92% 50%',
      '--primary-foreground': '20 14% 4%',
      '--border': '12 6% 15%',
      '--muted': '12 6% 15%',
      '--muted-foreground': '24 5% 64%',
    },
  },
];

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>(THEME_PRESETS[0]);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeWorkspaceTheme, setActiveWorkspaceTheme] = useState<string>('deep-navy');

  useEffect(() => {
    const saved = localStorage.getItem('devui_active_theme');
    if (saved) {
      setActiveWorkspaceTheme(saved);
      const found = THEME_PRESETS.find((t) => t.id === saved);
      if (found) setSelectedTheme(found);
    }
  }, []);

  const handleApplyGlobal = (theme: ThemePreset) => {
    localStorage.setItem('devui_active_theme', theme.id);
    setActiveWorkspaceTheme(theme.id);
  };

  const copyCssVars = () => {
    const cssString = `:root {\n${Object.entries(selectedTheme.cssVars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')}\n}`;
    navigator.clipboard.writeText(cssString);
    setCopiedType('css');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const copyTailwindTokens = () => {
    const twString = `// Tailwind CSS Theme Extensions\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        canvas: '${selectedTheme.bg}',\n        surface: '${selectedTheme.surface}',\n        border: '${selectedTheme.border}',\n        accent: '${selectedTheme.accent}',\n        'accent-hover': '${selectedTheme.accentHover}',\n      }\n    }\n  }\n};`;
    navigator.clipboard.writeText(twString);
    setCopiedType('tailwind');
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-100 overflow-hidden font-sans">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="border-b border-slate-800/80 pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Palette className="h-4 w-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Design System Studio
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-serif">
              Theme & Palette Tokens
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Calibrated developer color palettes engineered for contrast, accessibility, and high visual hierarchy.
              Test components live against any theme and export production CSS variables or Tailwind tokens with one click.
            </p>
          </div>

          {/* Palette Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {THEME_PRESETS.map((t) => {
              const isSelected = selectedTheme.id === t.id;
              const isGlobal = activeWorkspaceTheme === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTheme(t)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-slate-900 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/50'
                      : 'border-slate-800/80 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-xs text-white">{t.name}</span>
                      {isGlobal && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    {/* Swatches preview */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="h-5 w-5 rounded-full border border-white/20" style={{ backgroundColor: t.bg }} title="Background" />
                      <div className="h-5 w-5 rounded-full border border-white/20" style={{ backgroundColor: t.surface }} title="Surface" />
                      <div className="h-5 w-5 rounded-full border border-white/20" style={{ backgroundColor: t.border }} title="Border" />
                      <div className="h-5 w-5 rounded-full border border-white/20" style={{ backgroundColor: t.accent }} title="Accent" />
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Live Theme Preview Box */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  Live Theme Stage
                </h2>
                <button
                  onClick={() => handleApplyGlobal(selectedTheme)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-medium transition-colors"
                >
                  Set as Workspace Theme
                </button>
              </div>

              {/* The Mock Stage rendering in the theme's colors */}
              <div
                className="p-8 rounded-2xl border transition-colors shadow-2xl relative overflow-hidden"
                style={{
                  backgroundColor: selectedTheme.bg,
                  borderColor: selectedTheme.border,
                }}
              >
                <div className="space-y-6">
                  {/* Top Bar inside stage */}
                  <div
                    className="p-4 rounded-xl border flex items-center justify-between"
                    style={{
                      backgroundColor: selectedTheme.surface,
                      borderColor: selectedTheme.border,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: selectedTheme.accent, color: selectedTheme.bg }}
                      >
                        UI
                      </div>
                      <div>
                        <div className="text-xs font-semibold" style={{ color: selectedTheme.textPrimary }}>
                          Developer Workspace
                        </div>
                        <div className="text-[10px]" style={{ color: selectedTheme.textSecondary }}>
                          Active Preset: {selectedTheme.name}
                        </div>
                      </div>
                    </div>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded border"
                      style={{
                        borderColor: selectedTheme.border,
                        color: selectedTheme.accent,
                        backgroundColor: `${selectedTheme.accent}15`,
                      }}
                    >
                      READY v1.0.0
                    </span>
                  </div>

                  {/* Components Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      className="p-5 rounded-xl border space-y-3"
                      style={{
                        backgroundColor: selectedTheme.surface,
                        borderColor: selectedTheme.border,
                      }}
                    >
                      <div className="text-xs font-medium" style={{ color: selectedTheme.textSecondary }}>
                        Primary Action Element
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <button
                          className="px-4 py-2 rounded-lg text-xs font-semibold transition-transform active:scale-95"
                          style={{
                            backgroundColor: selectedTheme.accent,
                            color: selectedTheme.bg,
                          }}
                        >
                          Execute Deployment
                        </button>
                        <button
                          className="px-3 py-2 rounded-lg text-xs font-medium border"
                          style={{
                            borderColor: selectedTheme.border,
                            color: selectedTheme.textPrimary,
                            backgroundColor: selectedTheme.surfaceHover,
                          }}
                        >
                          Secondary
                        </button>
                      </div>
                    </div>

                    <div
                      className="p-5 rounded-xl border space-y-2"
                      style={{
                        backgroundColor: selectedTheme.surface,
                        borderColor: selectedTheme.border,
                      }}
                    >
                      <div className="text-xs font-medium" style={{ color: selectedTheme.textSecondary }}>
                        Status Telemetry
                      </div>
                      <div className="text-2xl font-bold font-mono" style={{ color: selectedTheme.textPrimary }}>
                        99.98%
                      </div>
                      <div className="text-[11px]" style={{ color: selectedTheme.accent }}>
                        ↑ 124ms response latency
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Token Export Panel */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-200">Export Theme Tokens</h2>

              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300">CSS Custom Properties</span>
                  <button
                    onClick={copyCssVars}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    {copiedType === 'css' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedType === 'css' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="text-[10px] font-mono p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 overflow-x-auto max-h-48 scrollbar-none">
                  {`:root {
${Object.entries(selectedTheme.cssVars)
  .map(([k, v]) => `  ${k}: ${v};`)
  .join('\n')}
}`}
                </pre>

                <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300">Tailwind Theme Config</span>
                  <button
                    onClick={copyTailwindTokens}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    {copiedType === 'tailwind' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedType === 'tailwind' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="text-[10px] font-mono p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 overflow-x-auto max-h-36 scrollbar-none">
{`colors: {
  canvas: '${selectedTheme.bg}',
  surface: '${selectedTheme.surface}',
  border: '${selectedTheme.border}',
  accent: '${selectedTheme.accent}',
}`}
                </pre>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
