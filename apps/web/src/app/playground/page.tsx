'use client';

import React, { useState } from 'react';
import {
  PlaySquare,
  RotateCcw,
  Copy,
  Check,
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  Sparkles,
  Sliders,
  Code2,
} from 'lucide-react';
import { AnimatedButton, ShimmerButton, MagneticButton } from '@ui-library/ui';
import { TiltCard } from '@ui-library/ui';
import { FloatingInput } from '@ui-library/ui';
import { StatusBadge } from '@ui-library/ui';
import { TextShimmer } from '@ui-library/ui';

type PlaygroundComponent = 'animated-button' | 'shimmer-button' | 'magnetic-button' | 'tilt-card' | 'floating-input' | 'status-badge' | 'text-shimmer';

export default function PlaygroundPage() {
  const [selectedComp, setSelectedComp] = useState<PlaygroundComponent>('animated-button');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [remountKey, setRemountKey] = useState(0);
  const [copied, setCopied] = useState(false);

  // Dynamic props state
  const [buttonText, setButtonText] = useState('Deploy Service');
  const [buttonVariant, setButtonVariant] = useState<'emerald' | 'primary' | 'secondary' | 'outline' | 'ghost'>('emerald');
  const [buttonSize, setButtonSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [shimmerEnabled, setShimmerEnabled] = useState(true);
  const [loadingEnabled, setLoadingEnabled] = useState(false);
  const [disabledEnabled, setDisabledEnabled] = useState(false);

  // Tilt Card props
  const [maxTilt, setMaxTilt] = useState(15);
  const [glareEnabled, setGlareEnabled] = useState(true);

  // Status Badge props
  const [statusVal, setStatusVal] = useState<'online' | 'busy' | 'warning' | 'offline'>('online');
  const [pingEnabled, setPingEnabled] = useState(true);

  // Text Shimmer props
  const [shimmerSpeed, setShimmerSpeed] = useState(2.5);

  const handleReset = () => {
    setButtonText('Deploy Service');
    setButtonVariant('emerald');
    setButtonSize('md');
    setShimmerEnabled(true);
    setLoadingEnabled(false);
    setDisabledEnabled(false);
    setMaxTilt(15);
    setGlareEnabled(true);
    setStatusVal('online');
    setPingEnabled(true);
    setShimmerSpeed(2.5);
    setRemountKey((prev) => prev + 1);
  };

  // Generate dynamic JSX string
  const generatedCode = React.useMemo(() => {
    switch (selectedComp) {
      case 'animated-button':
        return `<AnimatedButton
  variant="${buttonVariant}"
  size="${buttonSize}"
  ${shimmerEnabled ? 'shimmer\n  ' : ''}${loadingEnabled ? 'loading\n  ' : ''}${disabledEnabled ? 'disabled\n  ' : ''}>
  ${buttonText}
</AnimatedButton>`;
      case 'shimmer-button':
        return `<ShimmerButton
  shimmerColor="#10b981"
  shimmerDuration="2.5s">
  ${buttonText}
</ShimmerButton>`;
      case 'magnetic-button':
        return `<MagneticButton
  variant="${buttonVariant === 'primary' ? 'slate' : buttonVariant === 'outline' ? 'outline' : 'emerald'}"
  magneticStrength={0.35}>
  ${buttonText}
</MagneticButton>`;
      case 'tilt-card':
        return `<TiltCard
  maxTilt={${maxTilt}}
  glare={${glareEnabled}}>
  <div className="p-4">
    <h3 className="text-white font-bold">Neural Engine</h3>
    <p className="text-slate-400 text-xs mt-1">Real-time edge computation</p>
  </div>
</TiltCard>`;
      case 'status-badge':
        return `<StatusBadge
  status="${statusVal}"
  label="${buttonText || statusVal}"
  ping={${pingEnabled}}
/>`;
      case 'text-shimmer':
        return `<TextShimmer duration={${shimmerSpeed}}>
  ${buttonText}
</TextShimmer>`;
      case 'floating-input':
        return `<FloatingInput
  label="API Secret Key"
  helperText="Stored locally in isolated memory"
/>`;
    }
  }, [
    selectedComp,
    buttonText,
    buttonVariant,
    buttonSize,
    shimmerEnabled,
    loadingEnabled,
    disabledEnabled,
    maxTilt,
    glareEnabled,
    statusVal,
    pingEnabled,
    shimmerSpeed,
  ]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'max-w-2xl',
    mobile: 'max-w-sm',
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 mb-2">
            <PlaySquare className="h-3.5 w-3.5" />
            <span>Interactive Workbench</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Component Playground</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Tweak component properties, preview responsive breakpoints, toggle themes, and inspect live-updating JSX output.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset All Props</span>
        </button>
      </div>

      {/* Component Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'animated-button', label: 'Animated Button' },
          { id: 'shimmer-button', label: 'Shimmer Button' },
          { id: 'magnetic-button', label: 'Magnetic Button' },
          { id: 'tilt-card', label: '3D Tilt Card' },
          { id: 'floating-input', label: 'Floating Input' },
          { id: 'status-badge', label: 'Status Badge' },
          { id: 'text-shimmer', label: 'Text Shimmer' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedComp(c.id as any);
              setRemountKey((p) => p + 1);
            }}
            className={`rounded-xl px-4 py-2 text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedComp === c.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Main Split: Left Props Controls, Right Preview & Code */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Prop Controls Panel (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-sm font-bold text-white">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <span>Customize Properties</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Text Label Control */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Text Content</label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Variant Control for Buttons */}
            {['animated-button', 'magnetic-button'].includes(selectedComp) && (
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Variant</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['emerald', 'primary', 'secondary', 'outline', 'ghost'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setButtonVariant(v)}
                      className={`rounded-md py-1.5 px-2 text-[11px] capitalize transition-colors cursor-pointer ${
                        buttonVariant === v
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                          : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Control for Buttons */}
            {selectedComp === 'animated-button' && (
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Size</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['sm', 'md', 'lg'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setButtonSize(s)}
                      className={`rounded-md py-1.5 text-[11px] uppercase transition-colors cursor-pointer ${
                        buttonSize === s
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                          : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tilt Card Controls */}
            {selectedComp === 'tilt-card' && (
              <>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-300 font-medium">
                    <span>Max Tilt Angle</span>
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
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={glareEnabled}
                    onChange={(e) => setGlareEnabled(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Cursor Glare Sheen</span>
                </label>
              </>
            )}

            {/* Status Badge Controls */}
            {selectedComp === 'status-badge' && (
              <div className="space-y-2">
                <label className="text-slate-300 font-medium">Status Variant</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['online', 'busy', 'warning', 'offline'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusVal(st)}
                      className={`rounded-lg py-1.5 px-2 text-[11px] capitalize transition-colors cursor-pointer ${
                        statusVal === st
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                          : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={pingEnabled}
                    onChange={(e) => setPingEnabled(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Pulse Ping Radar Wave</span>
                </label>
              </div>
            )}

            {/* Toggles for Animated Button */}
            {selectedComp === 'animated-button' && (
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shimmerEnabled}
                    onChange={(e) => setShimmerEnabled(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Enable Shimmer Sweep</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loadingEnabled}
                    onChange={(e) => setLoadingEnabled(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Loading State</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={disabledEnabled}
                    onChange={(e) => setDisabledEnabled(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Disabled State</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right: Stage Preview & Live Code (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Preview Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-2">
            <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-1 border border-slate-800">
              <button
                onClick={() => setViewport('desktop')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs cursor-pointer ${
                  viewport === 'desktop' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs cursor-pointer ${
                  viewport === 'tablet' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400'
                }`}
              >
                <Tablet className="h-3.5 w-3.5" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs cursor-pointer ${
                  viewport === 'mobile' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setPreviewTheme('dark')}
                className={`flex items-center gap-1 rounded px-2 py-1 cursor-pointer ${
                  previewTheme === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-500'
                }`}
              >
                <Moon className="h-3 w-3" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => setPreviewTheme('light')}
                className={`flex items-center gap-1 rounded px-2 py-1 cursor-pointer ${
                  previewTheme === 'light' ? 'bg-slate-200 text-slate-900 font-medium' : 'text-slate-500'
                }`}
              >
                <Sun className="h-3 w-3" />
                <span>Light</span>
              </button>
            </div>
          </div>

          {/* Interactive Live Render Stage */}
          <div className="flex items-center justify-center min-h-[340px] rounded-2xl border border-slate-800 bg-slate-950 p-8 overflow-hidden [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px]">
            <div
              key={remountKey}
              className={`flex items-center justify-center transition-all ${viewportWidths[viewport]} ${
                previewTheme === 'light' ? 'bg-white rounded-2xl p-8 shadow-xl text-slate-950' : ''
              }`}
            >
              {selectedComp === 'animated-button' && (
                <AnimatedButton
                  variant={buttonVariant}
                  size={buttonSize}
                  shimmer={shimmerEnabled}
                  loading={loadingEnabled}
                  disabled={disabledEnabled}
                >
                  {buttonText}
                </AnimatedButton>
              )}

              {selectedComp === 'shimmer-button' && (
                <ShimmerButton>{buttonText}</ShimmerButton>
              )}

              {selectedComp === 'magnetic-button' && (
                <MagneticButton
                  variant={buttonVariant === 'primary' ? 'slate' : buttonVariant === 'outline' ? 'outline' : 'emerald'}
                >
                  {buttonText}
                </MagneticButton>
              )}

              {selectedComp === 'tilt-card' && (
                <TiltCard maxTilt={maxTilt} glare={glareEnabled} className="w-80">
                  <h4 className="text-base font-semibold text-white">Neural Engine</h4>
                  <p className="mt-2 text-xs text-slate-400">
                    Real-time edge computation with hardware acceleration.
                  </p>
                </TiltCard>
              )}

              {selectedComp === 'status-badge' && (
                <StatusBadge
                  status={statusVal}
                  label={buttonText || statusVal}
                  ping={pingEnabled}
                />
              )}

              {selectedComp === 'text-shimmer' && (
                <TextShimmer duration={shimmerSpeed} className="text-2xl font-bold">
                  {buttonText}
                </TextShimmer>
              )}

              {selectedComp === 'floating-input' && (
                <div className="w-80">
                  <FloatingInput
                    label="API Secret Key"
                    defaultValue="sec_live_9a8bc42f9e"
                    helperText="Stored locally in isolated memory"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Generated Code Output Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Code2 className="h-4 w-4 text-emerald-400" />
                <span>Generated JSX Output</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied JSX' : 'Copy JSX'}</span>
              </button>
            </div>
            <pre className="p-4 font-mono text-xs text-emerald-400/95 overflow-x-auto leading-relaxed">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

