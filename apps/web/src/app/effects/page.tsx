'use client';

import React, { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Sparkles, Sliders, Copy, Check, Eye, Code, Zap } from 'lucide-react';

interface EffectDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  tailwindClasses: string;
  cssCode: string;
}

const EFFECTS: EffectDefinition[] = [
  {
    id: 'film-grain',
    name: 'Analog Film Grain',
    category: 'Texture Overlay',
    description: 'Subtle high-frequency noise texture that eliminates digital banding on dark surfaces.',
    tailwindClasses: 'relative before:absolute before:inset-0 before:bg-[radial-gradient(#1e293b_1px,transparent_1px)] before:[background-size:16px_16px] before:opacity-40',
    cssCode: `.film-grain {
  background-image: radial-gradient(#1e293b 1px, transparent 1px);
  background-size: 16px 16px;
  opacity: 0.4;
}`,
  },
  {
    id: 'cursor-spotlight',
    name: 'Radial Cursor Spotlight',
    category: 'Interactive Shader',
    description: 'Follows mouse cursor with an emerald luminance field over dark carbon surfaces.',
    tailwindClasses: 'relative overflow-hidden before:pointer-events-none before:absolute before:-inset-px before:bg-[radial-gradient(600px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(16,185,129,0.12),transparent_40%)]',
    cssCode: `.cursor-spotlight {
  background: radial-gradient(
    600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(16, 185, 129, 0.12),
    transparent 40%
  );
}`,
  },
  {
    id: 'cyber-grid',
    name: 'Cybernetic Perspective Grid',
    category: 'Geometric Background',
    description: 'Crisp isometric technical grid with fading horizon opacity for terminal and dashboard backdrops.',
    tailwindClasses: 'bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]',
    cssCode: `.cyber-grid {
  background-size: 4rem 4rem;
  background-image: linear-gradient(to right, #1e293b15 1px, transparent 1px),
                    linear-gradient(to bottom, #1e293b15 1px, transparent 1px);
  mask-image: radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%);
}`,
  },
  {
    id: 'shimmer-beam',
    name: 'Conic Shimmer Beam Tracer',
    category: 'Light Animation',
    description: 'Sweeping high-velocity conic gradient highlight designed for card borders and action states.',
    tailwindClasses: 'animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_280deg,#10B981_360deg)]',
    cssCode: `@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.shimmer-beam {
  animation: spin 4s linear infinite;
  background: conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, #10B981 360deg);
}`,
  },
  {
    id: 'deep-mesh',
    name: 'Atmospheric Aura Mesh',
    category: 'Ambient Gradient',
    description: 'Multi-point blurred color anchors creating an organic, slow-drifting luminescence field.',
    tailwindClasses: 'bg-[radial-gradient(at_top_left,rgba(16,185,129,0.08)_0%,transparent_50%),radial-gradient(at_bottom_right,rgba(56,189,248,0.05)_0%,transparent_50%)]',
    cssCode: `.deep-mesh {
  background: radial-gradient(at top left, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
              radial-gradient(at bottom right, rgba(56, 189, 248, 0.05) 0%, transparent 50%);
}`,
  },
];

export default function EffectsPage() {
  const [activeEffect, setActiveEffect] = useState<EffectDefinition>(EFFECTS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(60);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Atmosphere & Shaders
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-serif">
              Backgrounds & Effects
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Production-grade background shaders, micro-textures, and optical beam shaders for dark developer interfaces.
              Zero external heavy libraries — pure CSS and Tailwind primitives.
            </p>
          </div>

          {/* Effect Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {EFFECTS.map((eff) => {
              const isSelected = activeEffect.id === eff.id;
              return (
                <div
                  key={eff.id}
                  onClick={() => setActiveEffect(eff)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-slate-900 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/50'
                      : 'border-slate-800/80 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                      {eff.category}
                    </span>
                    <h3 className="font-semibold text-xs text-white mb-2">{eff.name}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {eff.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Live Effect Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-400" />
                  Live Shader Stage: {activeEffect.name}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Intensity:</span>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-24 accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-emerald-400 w-8">{intensity}%</span>
                </div>
              </div>

              {/* Stage viewport */}
              <div
                onMouseMove={handleMouseMove}
                className="h-[380px] rounded-2xl border border-slate-800 bg-[#070A11] relative overflow-hidden flex items-center justify-center p-8 select-none"
                style={
                  {
                    '--mouse-x': `${mousePos.x}%`,
                    '--mouse-y': `${mousePos.y}%`,
                  } as React.CSSProperties
                }
              >
                {/* Effect layer */}
                {activeEffect.id === 'film-grain' && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(#334155 1.2px, transparent 1.2px)',
                      backgroundSize: '16px 16px',
                      opacity: intensity / 100,
                    }}
                  />
                )}

                {activeEffect.id === 'cursor-spotlight' && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(450px circle at ${mousePos.x}% ${mousePos.y}%, rgba(16, 185, 129, ${
                        (intensity / 100) * 0.25
                      }), transparent 50%)`,
                    }}
                  />
                )}

                {activeEffect.id === 'cyber-grid' && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundSize: '3.5rem 3.5rem',
                      backgroundImage:
                        'linear-gradient(to right, rgba(30, 41, 59, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 41, 59, 0.4) 1px, transparent 1px)',
                      maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 60%, transparent 100%)',
                      opacity: intensity / 100,
                    }}
                  />
                )}

                {activeEffect.id === 'shimmer-beam' && (
                  <div className="relative p-1 rounded-2xl overflow-hidden">
                    <div
                      className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
                      style={{
                        background:
                          'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, #10B981 360deg)',
                        opacity: intensity / 100,
                      }}
                    />
                    <div className="relative z-10 px-8 py-5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs font-mono text-emerald-400">BEAM TRACER</div>
                      <div className="text-sm font-semibold text-white mt-1">Conic Sweep Active</div>
                    </div>
                  </div>
                )}

                {activeEffect.id === 'deep-mesh' && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(at top left, rgba(16, 185, 129, ${
                        (intensity / 100) * 0.2
                      }) 0%, transparent 55%), radial-gradient(at bottom right, rgba(56, 189, 248, ${
                        (intensity / 100) * 0.15
                      }) 0%, transparent 55%)`,
                    }}
                  />
                )}

                {/* Stage Center Card to test contrast */}
                {activeEffect.id !== 'shimmer-beam' && (
                  <div className="relative z-10 max-w-md w-full p-6 rounded-xl border border-slate-800/90 bg-slate-900/80 backdrop-blur-md text-center space-y-3 shadow-2xl">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                      <Zap className="h-3 w-3" />
                      SHADER ACTIVE
                    </div>
                    <h4 className="text-base font-semibold text-white">Visual Layer Testing Target</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Testing contrast, optical sharpness, and text legibility over {activeEffect.name.toLowerCase()}.
                      Notice how the texture remains restrained without causing eye strain.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Implementation Code Box */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-200">Implementation Code</h2>

              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300">Tailwind CSS Utility</span>
                  <button
                    onClick={() => copyCode(activeEffect.tailwindClasses, 'tw')}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    {copiedId === 'tw' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedId === 'tw' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="text-[10px] font-mono p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 overflow-x-auto max-h-36 scrollbar-none whitespace-pre-wrap">
                  {activeEffect.tailwindClasses}
                </pre>

                <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300">Raw CSS Rule</span>
                  <button
                    onClick={() => copyCode(activeEffect.cssCode, 'css')}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    {copiedId === 'css' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedId === 'css' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="text-[10px] font-mono p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 overflow-x-auto max-h-48 scrollbar-none">
                  {activeEffect.cssCode}
                </pre>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
