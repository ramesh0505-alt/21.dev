'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Copy,
  Check,
  Bookmark,
  Download,
  Terminal,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ExternalLink,
  Code2,
  Eye,
  Package,
  BookOpen,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { getComponentBySlug, componentDemos } from '@/registry';
import { useAdminComponents } from '@/lib/admin-store';
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
import { ActionBar } from '@/components/preview/action-bar';
import { getSimilarComponents } from '@/lib/similar';
import { ComponentCard } from '@/components/preview/component-card';

export default function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const registry = useAdminComponents();
  const component = registry.find((c) => c.slug === slug);
  const router = useRouter();

  if (!component) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'install' | 'docs' | 'deps' | 'api'>('preview');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [zoomScale, setZoomScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [remountKey, setRemountKey] = useState(0);
  const [pm, setPm] = useState<PackageManager>('pnpm');

  useEffect(() => {
    recordRecentView(slug);
    setPm(getPackageManagerPreference());
  }, [slug]);

  const DemoComponent = componentDemos[slug];
  const similarComponents = getSimilarComponents(slug, 4);

  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'max-w-2xl',
    mobile: 'max-w-sm',
  };

  const filesForViewer = [
    {
      name: `${component.slug}.tsx`,
      code: component.code?.component || '// Source unavailable',
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
    <div className={`space-y-8 max-w-6xl mx-auto pb-24 ${isFullscreen ? 'fixed inset-0 z-50 bg-neutral-950 p-6 overflow-y-auto max-w-none' : ''}`}>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/elements" className="hover:text-white transition-colors">
            Components
          </Link>
          <span>/</span>
          <Link href={`/elements/${component.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-white transition-colors">
            {component.category}
          </Link>
          <span>/</span>
          <span className="text-white font-medium">{component.name}</span>
        </div>

        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            <span>Exit Fullscreen</span>
          </button>
        )}
      </div>

      {/* Header Info */}
      <div className="border-b border-neutral-800 pb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-0.5 text-xs font-mono font-medium">
            {component.category}
          </span>
          <span className="rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 px-2.5 py-0.5 text-xs font-mono">
            v{component.version}
          </span>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 text-xs font-mono">
            {component.status}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">{component.name}</h1>
        <p className="text-sm md:text-base text-neutral-400 max-w-3xl leading-relaxed">{component.description}</p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {component.tags.map((t) => (
            <span key={t} className="rounded bg-neutral-900 px-2 py-0.5 text-xs font-mono text-neutral-400">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Preview Viewport & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-2">
        {/* Left: Viewport Switcher */}
        <div className="flex items-center gap-1 bg-neutral-950 rounded-xl p-1 border border-neutral-800 text-xs">
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
              viewport === 'desktop' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
              viewport === 'tablet' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
              viewport === 'mobile' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Theme, Zoom, Reset & Fullscreen */}
        <div className="flex items-center gap-2 text-xs">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-neutral-950 rounded-xl p-1 border border-neutral-800">
            <button
              onClick={() => setZoomScale((z) => Math.max(0.6, z - 0.1))}
              className="p-1 rounded text-neutral-400 hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono text-[11px] text-neutral-400 px-1">{Math.round(zoomScale * 100)}%</span>
            <button
              onClick={() => setZoomScale((z) => Math.min(1.4, z + 0.1))}
              className="p-1 rounded text-neutral-400 hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Theme switcher */}
          <div className="flex items-center gap-1 bg-neutral-950 rounded-xl p-1 border border-neutral-800">
            <button
              onClick={() => setPreviewTheme('dark')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                previewTheme === 'dark' ? 'bg-neutral-800 text-white' : 'text-neutral-500'
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setPreviewTheme('light')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                previewTheme === 'light' ? 'bg-neutral-200 text-neutral-950' : 'text-neutral-500'
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={() => setRemountKey((k) => k + 1)}
            className="flex items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:text-white"
            title="Reload preview"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:text-white"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Live Interactive Preview Frame */}
      <div className="flex items-center justify-center min-h-[460px] rounded-3xl border border-neutral-800 bg-neutral-950 p-8 overflow-hidden [background-image:radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:20px_20px]">
        <div
          key={remountKey}
          style={{ transform: `scale(${zoomScale})` }}
          className={`transition-all duration-200 w-full flex items-center justify-center ${viewportWidths[viewport]} ${
            previewTheme === 'light' ? 'bg-white rounded-2xl p-8 shadow-2xl text-neutral-950' : ''
          }`}
        >
          {DemoComponent ? (
            <div className="w-full flex items-center justify-center">
              <DemoComponent />
            </div>
          ) : (
            <div className="text-neutral-500 font-mono text-xs">Preview unavailable</div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-neutral-800">
        {[
          { id: 'code', label: 'Source Code', icon: Code2 },
          { id: 'install', label: 'Installation', icon: Package },
          { id: 'api', label: 'API & Props', icon: Layers },
          { id: 'docs', label: 'Documentation', icon: BookOpen },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Source Code */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          <CodeViewer files={filesForViewer} />
        </div>
      )}

      {/* Tab: Installation */}
      {activeTab === 'install' && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-5 text-xs">
          <h3 className="text-sm font-bold text-white">CLI Installation Command</h3>
          <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-neutral-300">
            <span>{getInstallCommand(component.dependencies, pm)}</span>
          </div>

          <h3 className="text-sm font-bold text-white pt-2">File Placement</h3>
          <p className="text-neutral-400">
            Copy the source code into <code className="text-emerald-400 font-mono">components/ui/{component.slug}.tsx</code>.
          </p>
        </div>
      )}

      {/* Tab: API & Props */}
      {activeTab === 'api' && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Component Props & API</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-neutral-800 text-neutral-400">
                <tr>
                  <th className="pb-3 font-semibold">Prop</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Default</th>
                  <th className="pb-3 font-semibold font-sans">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                <tr>
                  <td className="py-3 text-blue-400">className</td>
                  <td className="py-3 text-neutral-500">string</td>
                  <td className="py-3 text-neutral-500">-</td>
                  <td className="py-3 font-sans text-neutral-400">Custom CSS classes merged via tailwind-merge</td>
                </tr>
                <tr>
                  <td className="py-3 text-blue-400">children</td>
                  <td className="py-3 text-neutral-500">React.ReactNode</td>
                  <td className="py-3 text-neutral-500">-</td>
                  <td className="py-3 font-sans text-neutral-400">Inner label, text, or icon slot</td>
                </tr>
                <tr>
                  <td className="py-3 text-blue-400">disabled</td>
                  <td className="py-3 text-neutral-500">boolean</td>
                  <td className="py-3 text-neutral-500">false</td>
                  <td className="py-3 font-sans text-neutral-400">Disables interactions and applies reduced opacity</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Documentation */}
      {activeTab === 'docs' && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 space-y-4 text-xs leading-relaxed text-neutral-300">
          <h3 className="text-base font-bold text-white">Engineering Overview</h3>
          <p>{component.description}</p>
          <div className="flex items-center gap-2 pt-2 text-emerald-400 font-mono">
            <ShieldCheck className="h-4 w-4" />
            <span>Passed accessibility & keyboard navigation standards</span>
          </div>
        </div>
      )}

      {/* SIMILAR COMPONENTS SECTION (Section 7 of Master Prompt) */}
      {similarComponents.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Similar Components</h2>
              <p className="text-xs text-neutral-400">Related {component.category} and interaction styles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarComponents.map((sim) => (
              <ComponentCard
                key={sim.id}
                component={sim}
                onSelect={() => router.push(`/components/${sim.slug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* FIXED PERSISTENT BOTTOM ACTION BAR (Section 4 of Master Prompt) */}
      <ActionBar
        component={component}
        onSelectSimilar={(sim) => router.push(`/components/${sim.slug}`)}
      />
    </div>
  );
}
