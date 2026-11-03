'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  RotateCcw,
  Save,
  Copy,
  Check,
  Download,
  Sliders,
  Code2,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { getComponentBySlug, componentDemos } from '@/registry';
import { saveRemix, RemixedComponent } from '@/lib/storage';
import { downloadComponentZip } from '@/lib/export-zip';
import { AnimatedButton, ShimmerButton, MagneticButton, TiltCard, StatusBadge, TextShimmer, FloatingInput } from '@ui-library/ui';

export default function RemixPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const component = getComponentBySlug(slug);
  const router = useRouter();

  if (!component) {
    notFound();
  }

  // State for customizable parameters
  const [text, setText] = useState(
    component.slug === 'clothing-rail'
      ? 'A clothing rail you can handle, right on the page.'
      : component.slug === 'text-shimmer'
      ? 'Next-Generation Component Engineering'
      : 'Launch Deployment'
  );
  const [colorPreset, setColorPreset] = useState<'emerald' | 'sky' | 'purple' | 'amber' | 'rose' | 'slate'>('emerald');
  const [sizeScale, setSizeScale] = useState<'sm' | 'md' | 'lg'>('md');
  const [radiusPreset, setRadiusPreset] = useState<'none' | 'md' | 'xl' | 'full'>('xl');
  const [shimmerEnabled, setShimmerEnabled] = useState(true);
  const [glareEnabled, setGlareEnabled] = useState(true);
  const [maxTilt, setMaxTilt] = useState(15);
  const [statusVal, setStatusVal] = useState<'online' | 'busy' | 'warning' | 'offline'>('online');
  const [remountKey, setRemountKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const colorHexMap = {
    emerald: '#10b981',
    sky: '#0ea5e9',
    purple: '#a855f7',
    amber: '#f59e0b',
    rose: '#f43f5e',
    slate: '#475569',
  };

  const handleReset = () => {
    setText('Launch Deployment');
    setColorPreset('emerald');
    setSizeScale('md');
    setRadiusPreset('xl');
    setShimmerEnabled(true);
    setGlareEnabled(true);
    setMaxTilt(15);
    setStatusVal('online');
    setRemountKey((k) => k + 1);
  };

  const generatedCustomCode = React.useMemo(() => {
    switch (component.slug) {
      case 'animated-button':
        return `<AnimatedButton
  variant="${colorPreset === 'emerald' ? 'emerald' : colorPreset === 'slate' ? 'secondary' : 'primary'}"
  size="${sizeScale}"
  shimmer={${shimmerEnabled}}>
  ${text}
</AnimatedButton>`;
      case 'shimmer-button':
        return `<ShimmerButton
  shimmerColor="${colorHexMap[colorPreset]}"
  borderRadius="${radiusPreset === 'full' ? '100px' : radiusPreset === 'xl' ? '16px' : '8px'}">
  ${text}
</ShimmerButton>`;
      case 'magnetic-button':
        return `<MagneticButton
  variant="${colorPreset === 'emerald' ? 'emerald' : colorPreset === 'slate' ? 'slate' : 'outline'}"
  magneticStrength={0.4}>
  ${text}
</MagneticButton>`;
      case 'tilt-card':
        return `<TiltCard
  maxTilt={${maxTilt}}
  glare={${glareEnabled}}
  className="w-80">
  <h4 className="text-white font-bold">${text}</h4>
  <p className="text-neutral-400 text-xs mt-1">Configured in DevUI Studio</p>
</TiltCard>`;
      case 'status-badge':
        return `<StatusBadge
  status="${statusVal}"
  label="${text || statusVal}"
  ping={${shimmerEnabled}}
/>`;
      case 'text-shimmer':
        return `<TextShimmer duration={2.5} className="text-2xl font-bold">
  ${text}
</TextShimmer>`;
      default:
        return component.code?.component || '';
    }
  }, [component.slug, text, colorPreset, sizeScale, radiusPreset, shimmerEnabled, glareEnabled, maxTilt, statusVal]);

  const handleSaveAsNew = () => {
    saveRemix({
      originalSlug: component.slug,
      name: `${component.name} (Custom)`,
      slug: `${component.slug}-remix-${Date.now()}`,
      category: component.category,
      customProps: {
        text,
        color: colorHexMap[colorPreset],
        size: sizeScale,
        shimmer: shimmerEnabled,
        maxTilt,
        glare: glareEnabled,
        status: statusVal,
      },
      customCode: generatedCustomCode,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCustomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top back bar */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
        <Link
          href={`/components/${component.slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Component Details</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSaveAsNew}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
          >
            {saveSuccess ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            <span>{saveSuccess ? 'Saved to Collection!' : 'Save as New Version'}</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-medium text-amber-400 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Remix Studio</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Customizing {component.name}</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Adjust visual properties and save a separate custom iteration into your personal stack without mutating the base library.
        </p>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 text-sm font-bold text-white">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <span>Supported Parameters</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Text input */}
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-medium">Text Content</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Color Accent Presets */}
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-medium">Color Scheme</label>
              <div className="grid grid-cols-6 gap-2">
                {(['emerald', 'sky', 'purple', 'amber', 'rose', 'slate'] as const).map((col) => (
                  <button
                    key={col}
                    onClick={() => setColorPreset(col)}
                    className={`h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                      colorPreset === col ? 'border-white ring-2 ring-white/30 scale-105' : 'border-neutral-800 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: colorHexMap[col] }}
                  >
                    {colorPreset === col && <Check className="h-3.5 w-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Scale */}
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-medium">Size Scale</label>
              <div className="grid grid-cols-3 gap-2">
                {(['sm', 'md', 'lg'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSizeScale(s)}
                    className={`rounded-lg py-1.5 text-center uppercase font-mono font-medium border transition-colors cursor-pointer ${
                      sizeScale === s
                        ? 'bg-neutral-800 text-white border-neutral-600 font-bold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-medium">Corner Curvature</label>
              <div className="grid grid-cols-4 gap-2">
                {(['none', 'md', 'xl', 'full'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadiusPreset(r)}
                    className={`rounded-lg py-1.5 text-center capitalize font-mono text-[11px] border transition-colors cursor-pointer ${
                      radiusPreset === r
                        ? 'bg-neutral-800 text-white border-neutral-600 font-bold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Tilt specific */}
            {component.slug === 'tilt-card' && (
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex justify-between">
                  <span className="text-neutral-300 font-medium">Max Tilt Angle</span>
                  <span className="font-mono text-emerald-400">{maxTilt}°</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  value={maxTilt}
                  onChange={(e) => setMaxTilt(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            )}

            {/* Status specific */}
            {component.slug === 'status-badge' && (
              <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                <label className="text-neutral-300 font-medium">Operational Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['online', 'busy', 'warning', 'offline'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusVal(st)}
                      className={`rounded-lg py-1.5 capitalize border transition-colors cursor-pointer ${
                        statusVal === st
                          ? 'bg-neutral-800 text-white border-neutral-600 font-bold'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview & Code Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Preview Container */}
          <div className="flex items-center justify-center min-h-[360px] rounded-2xl border border-neutral-800 bg-neutral-950 p-8 [background-image:radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:16px_16px]">
            <div key={remountKey} className="flex items-center justify-center w-full">
              {component.slug === 'animated-button' && (
                <AnimatedButton
                  variant={colorPreset === 'emerald' ? 'emerald' : colorPreset === 'slate' ? 'secondary' : 'primary'}
                  size={sizeScale}
                  shimmer={shimmerEnabled}
                >
                  {text}
                </AnimatedButton>
              )}

              {component.slug === 'shimmer-button' && (
                <ShimmerButton
                  shimmerColor={colorHexMap[colorPreset]}
                  borderRadius={radiusPreset === 'full' ? '100px' : radiusPreset === 'xl' ? '16px' : '8px'}
                >
                  {text}
                </ShimmerButton>
              )}

              {component.slug === 'magnetic-button' && (
                <MagneticButton
                  variant={colorPreset === 'emerald' ? 'emerald' : colorPreset === 'slate' ? 'slate' : 'outline'}
                >
                  {text}
                </MagneticButton>
              )}

              {component.slug === 'tilt-card' && (
                <TiltCard maxTilt={maxTilt} glare={glareEnabled} className="w-80">
                  <h4 className="text-white font-bold">{text}</h4>
                  <p className="text-neutral-400 text-xs mt-1">Configured in DevUI Studio</p>
                </TiltCard>
              )}

              {component.slug === 'status-badge' && (
                <StatusBadge status={statusVal} label={text || statusVal} />
              )}

              {component.slug === 'text-shimmer' && (
                <TextShimmer duration={2.5} className="text-2xl font-bold">
                  {text}
                </TextShimmer>
              )}

              {!['animated-button', 'shimmer-button', 'magnetic-button', 'tilt-card', 'status-badge', 'text-shimmer'].includes(
                component.slug
              ) && (
                <div className="text-center text-xs text-neutral-400">
                  Customization active. Inspect generated JSX below.
                </div>
              )}
            </div>
          </div>

          {/* Generated JSX Block */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/60 px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                <Code2 className="h-4 w-4 text-emerald-400" />
                <span>Customized JSX Output</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSX'}</span>
              </button>
            </div>
            <pre className="p-4 font-mono text-xs text-emerald-400/90 overflow-x-auto leading-relaxed">
              <code>{generatedCustomCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
