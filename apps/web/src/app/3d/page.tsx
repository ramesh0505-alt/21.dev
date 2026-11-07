'use client';

import React, { useState } from 'react';
import { Box, Layers, Eye, Code, Sliders, ExternalLink, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import {
  TiltCardDemo,
  CoverflowCarouselDemo,
  CardStackDemo,
  LanyardRosterDemo,
} from '@ui-library/ui';

interface ThreeDComponent {
  id: string;
  name: string;
  slug: string;
  description: string;
  demoComponent: React.ComponentType;
  tags: string[];
  techStack: string;
}

const THREE_D_ITEMS: ThreeDComponent[] = [
  {
    id: 'crd-tilt-card',
    name: '3D Tilt Card',
    slug: 'tilt-card',
    description: 'Hardware-accelerated 3D tilt interaction with interactive specular glare reflection and gyro dampening.',
    demoComponent: TiltCardDemo,
    tags: ['3D', 'Gyro', 'Perspective', 'Glare', 'Motion'],
    techStack: 'CSS 3D Transforms + Pointer Physics',
  },
  {
    id: 'crd-coverflow-carousel',
    name: '3D Coverflow Carousel',
    slug: 'coverflow-carousel',
    description: 'Apple-style 3D Coverflow perspective carousel with non-linear angle falloff and smooth looping ring.',
    demoComponent: CoverflowCarouselDemo,
    tags: ['3D', 'Carousel', 'Coverflow', 'Perspective'],
    techStack: 'CSS Perspective + Motion Springs',
  },
  {
    id: 'crd-card-stack',
    name: 'Holographic Card Stack',
    slug: 'card-stack',
    description: 'Layered 3D z-axis offset cards with holographic foil reflection and smooth swipe gestures.',
    demoComponent: CardStackDemo,
    tags: ['3D', 'Z-Index', 'Cards', 'Stack'],
    techStack: '3D Matrix Transforms + Motion',
  },
  {
    id: 'gal-lanyard-roster',
    name: 'Hanging 3D Lanyard ID Badge',
    slug: 'lanyard-roster',
    description: 'Physics-inspired badge lanyard swaying with natural pendular dampening and depth perspective.',
    demoComponent: LanyardRosterDemo,
    tags: ['3D', 'Physics', 'Pendulum', 'Lanyard'],
    techStack: 'Pendulum Dynamics + 3D Rotation',
  },
];

export default function ThreeDComponentsPage() {
  const [selectedItem, setSelectedItem] = useState<ThreeDComponent>(THREE_D_ITEMS[0]);
  const [perspectiveDepth, setPerspectiveDepth] = useState<number>(1000);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const DemoComponent = selectedItem.demoComponent;

  const handleCopyInstall = (slug: string) => {
    navigator.clipboard.writeText(`npx @ui-library/cli add ${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
      {/* Header */}
          <div className="border-b border-slate-800/80 pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Box className="h-4 w-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Spatial & Matrix Primitives
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-serif">
              3D & Perspective Components
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Spatial UI elements utilizing GPU-accelerated CSS 3D transforms, matrix depth projection, and pointer physics.
              Tested for fluid 60fps interaction on standard devices without heavy WebGL engine overhead.
            </p>
          </div>

          {/* Component Selector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {THREE_D_ITEMS.map((item) => {
              const isSelected = selectedItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-slate-900 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/50'
                      : 'border-slate-800/80 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                        {item.techStack.split('+')[0]}
                      </span>
                      <Box className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                    <h3 className="font-semibold text-xs text-white mb-1.5">{item.name}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live 3D Interactive Stage */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-400" />
                  Interactive 3D Stage: {selectedItem.name}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {selectedItem.techStack}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Sliders className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Perspective Field:</span>
                  <input
                    type="range"
                    min="500"
                    max="1800"
                    step="50"
                    value={perspectiveDepth}
                    onChange={(e) => setPerspectiveDepth(Number(e.target.value))}
                    className="w-24 accent-emerald-500 cursor-pointer"
                  />
                  <span className="font-mono text-emerald-400 w-12">{perspectiveDepth}px</span>
                </div>

                <button
                  onClick={() => handleCopyInstall(selectedItem.slug)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  {copiedSlug === selectedItem.slug ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedSlug === selectedItem.slug ? 'Copied CLI' : 'Copy CLI Command'}</span>
                </button>

                <Link
                  href={`/components/${selectedItem.slug}`}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                >
                  <span>Open Details</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Stage viewport */}
            <div
              className="min-h-[460px] rounded-2xl border border-slate-800 bg-[#070A11] p-8 flex items-center justify-center relative overflow-hidden"
              style={{
                perspective: `${perspectiveDepth}px`,
              }}
            >
              {/* Subtle background grid */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="relative z-10 w-full flex items-center justify-center">
                <DemoComponent />
              </div>
            </div>
          </div>
    </div>
  );
}
