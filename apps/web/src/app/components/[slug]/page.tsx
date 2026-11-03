'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Copy,
  Check,
  Heart,
  Download,
  Terminal,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  ExternalLink,
  Code2,
  Eye,
  Package,
  BookOpen,
  Layers,
  Sparkles,
} from 'lucide-react';
import { getComponentBySlug, componentDemos } from '@/registry';
import {
  isFavorite,
  toggleFavorite,
  recordRecentView,
  getInstallCommand,
  PackageManager,
  getPackageManagerPreference,
} from '@/lib/storage';
import { downloadComponentZip } from '@/lib/export-zip';
import { CodeViewer } from '@/components/preview/code-viewer';

export default function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const component = getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'install' | 'docs' | 'deps'>('preview');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [remountKey, setRemountKey] = useState(0);
  const [starred, setStarred] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [pm, setPm] = useState<PackageManager>('pnpm');

  useEffect(() => {
    recordRecentView(slug);
    setStarred(isFavorite(slug));
    setPm(getPackageManagerPreference());

    const handleUpdate = () => {
      setStarred(isFavorite(slug));
      setPm(getPackageManagerPreference());
    };
    window.addEventListener('devui_storage_updated', handleUpdate);
    return () => window.removeEventListener('devui_storage_updated', handleUpdate);
  }, [slug]);

  const DemoComponent = componentDemos[slug];

  const handleCopyCode = () => {
    if (component.code?.component) {
      navigator.clipboard.writeText(component.code.component);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyCli = (pkgManager: PackageManager = pm) => {
    const cmd = getInstallCommand(component.dependencies, pkgManager);
    navigator.clipboard.writeText(cmd);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleToggleStar = () => {
    const nextState = toggleFavorite(slug);
    setStarred(nextState);
  };

  const handleReset = () => {
    setRemountKey((prev) => prev + 1);
  };

  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'max-w-2xl',
    mobile: 'max-w-sm',
  };

  const filesForViewer = [
    {
      name: `${component.slug}.tsx`,
      code: component.code?.component || '// Component code unavailable',
      language: 'tsx',
    },
    ...(component.code?.demo
      ? [
          {
            name: `${component.slug}.demo.tsx`,
            code: component.code.demo,
            language: 'tsx',
          },
        ]
      : []),
    ...(component.code?.styles
      ? [
          {
            name: 'styles.css',
            code: component.code.styles,
            language: 'css',
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/elements"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Elements</span>
        </Link>
      </div>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-800/80 pb-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 font-mono">
              {component.category}
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-mono text-slate-300">
              v{component.version}
            </span>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-950/40 px-2.5 py-0.5 text-[11px] font-mono text-emerald-300">
              {component.status}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            {component.name}
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
            {component.description}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {component.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-800/80 px-2 py-0.5 text-xs font-mono text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleToggleStar}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
              starred
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Heart className={`h-4 w-4 ${starred ? 'fill-rose-400' : ''}`} />
            <span>{starred ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copiedCode ? 'Copied Source!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={() => downloadComponentZip(component)}
            className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-200 hover:border-emerald-500/40 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            <span>Download ZIP</span>
          </button>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-1">
          {[
            { id: 'preview', label: 'Preview', icon: Eye },
            { id: 'code', label: 'Source Code', icon: Code2 },
            { id: 'install', label: 'Installation', icon: Package },
            { id: 'docs', label: 'Documentation', icon: BookOpen },
            { id: 'deps', label: 'Dependencies', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'border-emerald-500 text-emerald-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          {/* Preview Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-2">
            {/* Viewport switchers */}
            <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-1 border border-slate-800">
              <button
                onClick={() => setViewport('desktop')}
                title="Desktop View (100%)"
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                  viewport === 'desktop'
                    ? 'bg-slate-800 text-emerald-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setViewport('tablet')}
                title="Tablet View (768px)"
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                  viewport === 'tablet'
                    ? 'bg-slate-800 text-emerald-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tablet className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setViewport('mobile')}
                title="Mobile View (375px)"
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                  viewport === 'mobile'
                    ? 'bg-slate-800 text-emerald-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* Right: Theme Toggle & Reset State */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-1 border border-slate-800 text-xs">
                <button
                  onClick={() => setPreviewTheme('dark')}
                  className={`flex items-center gap-1 rounded px-2 py-1 transition-colors cursor-pointer ${
                    previewTheme === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-500'
                  }`}
                >
                  <Moon className="h-3 w-3" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => setPreviewTheme('light')}
                  className={`flex items-center gap-1 rounded px-2 py-1 transition-colors cursor-pointer ${
                    previewTheme === 'light' ? 'bg-slate-200 text-slate-900 font-medium' : 'text-slate-500'
                  }`}
                >
                  <Sun className="h-3 w-3" />
                  <span>Light</span>
                </button>
              </div>

              <button
                onClick={handleReset}
                title="Reset component state"
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Actual Live Preview Frame */}
          <div className="flex items-center justify-center min-h-[440px] rounded-2xl border border-slate-800 bg-slate-950/70 p-8 overflow-hidden [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px]">
            <div
              key={remountKey}
              className={`transition-all duration-300 w-full ${viewportWidths[viewport]} ${
                previewTheme === 'light' ? 'bg-white text-slate-950 rounded-2xl p-6 shadow-xl' : ''
              }`}
            >
              {DemoComponent ? (
                <div className="w-full flex items-center justify-center">
                  <DemoComponent />
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Interactive demo not found for this component.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CODE */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          <CodeViewer files={filesForViewer} />
        </div>
      )}

      {/* TAB 3: INSTALLATION */}
      {activeTab === 'install' && (
        <div className="space-y-6">
          {/* Step 1: Package Manager */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs">
                  1
                </span>
                <span>Install Dependencies</span>
              </h3>

              <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-1 text-xs font-mono">
                {(['pnpm', 'npm', 'yarn', 'bun'] as PackageManager[]).map((pkg) => (
                  <button
                    key={pkg}
                    onClick={() => setPm(pkg)}
                    className={`rounded px-2.5 py-0.5 transition-colors cursor-pointer ${
                      pm === pkg
                        ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {pkg}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span>{getInstallCommand(component.dependencies, pm)}</span>
              </div>
              <button
                onClick={() => handleCopyCli(pm)}
                className="flex items-center gap-1 rounded bg-slate-800/80 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {copiedCli ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCli ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Step 2: Component placement */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs">
                2
              </span>
              <span>Copy Component Source</span>
            </h3>

            <p className="text-xs text-slate-400">
              Create the file at{' '}
              <code className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-emerald-400">
                components/ui/{component.slug}.tsx
              </code>{' '}
              and paste the component source code.
            </p>

            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:border-emerald-500/40 transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Component Code'}</span>
            </button>
          </div>

          {/* Step 3: Usage snippet */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs">
                3
              </span>
              <span>Import & Use</span>
            </h3>

            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
              <code>{`import { ${component.name.replace(/\s+/g, '')} } from '@/components/ui/${component.slug}';

export default function MyPage() {
  return (
    <div className="p-8">
      <${component.name.replace(/\s+/g, '')} />
    </div>
  );
}`}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: DOCUMENTATION */}
      {activeTab === 'docs' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 space-y-6 text-slate-300 text-sm leading-relaxed">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white">{component.name} Documentation</h2>
            <p className="text-xs text-slate-400 mt-1">{component.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white">Overview</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This component is built following the local-first storage standard. It utilizes{' '}
              <span className="text-emerald-400 font-mono">{component.framework}</span> and{' '}
              <span className="text-emerald-400 font-mono">{component.stylingSystem}</span>,
              adhering strictly to accessibility, zero runtime external bloat, and customizable responsive states.
            </p>

            <h3 className="text-base font-semibold text-white pt-2">File Hierarchy</h3>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs space-y-1 text-slate-400">
              <div className="text-emerald-400">packages/ui/src/{component.sourceFileLocations.component}</div>
              {component.sourceFileLocations.demo && (
                <div>├── {component.sourceFileLocations.demo}</div>
              )}
              <div>├── {component.sourceFileLocations.meta}</div>
              {component.sourceFileLocations.readme && (
                <div>└── {component.sourceFileLocations.readme}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DEPENDENCIES */}
      {activeTab === 'deps' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Required npm Dependencies</h3>
          <p className="text-xs text-slate-400">
            Ensure the following dependencies are installed in your consumer project:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {component.dependencies.map((dep) => (
              <div
                key={dep}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs"
              >
                <span className="text-slate-200">{dep}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">latest</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
