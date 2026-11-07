'use client';

import React, { useState, useMemo } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Sparkles, Search, Copy, Check, Sliders, Code2, PlusCircle, ExternalLink } from 'lucide-react';
import { useAdminIcons, AdminIcon } from '@/lib/admin-store';
import Link from 'next/link';

export default function IconsCatalogPage() {
  const icons = useAdminIcons();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIcon, setSelectedIcon] = useState<AdminIcon | null>(null);

  // Customizer state
  const [iconSize, setIconSize] = useState<number>(32);
  const [iconColor, setIconColor] = useState<string>('#10B981');
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(icons.map((i) => i.category));
    return ['All', ...Array.from(set)];
  }, [icons]);

  const filteredIcons = useMemo(() => {
    return icons.filter((icon) => {
      const matchesSearch =
        icon.name.toLowerCase().includes(search.toLowerCase()) ||
        icon.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || icon.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [icons, search, selectedCategory]);

  const activeIcon = selectedIcon || filteredIcons[0] || null;

  const copySvg = (svgContent: string) => {
    const styledSvg = svgContent
      .replace(/stroke="[^"]*"/g, `stroke="${iconColor}"`)
      .replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`)
      .replace(/width="[^"]*"/g, `width="${iconSize}"`)
      .replace(/height="[^"]*"/g, `height="${iconSize}"`);
    navigator.clipboard.writeText(styledSvg);
    setCopiedType('svg');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const copyJsx = (icon: AdminIcon) => {
    const componentName = icon.name.replace(/[^a-zA-Z0-9]/g, '') + 'Icon';
    const jsxString = `export function ${componentName}({ size = ${iconSize}, color = '${iconColor}', strokeWidth = ${strokeWidth}, ...props }: React.SVGProps<SVGSVGElement> & { size?: number; color?: string; strokeWidth?: number }) {\n  return (\n    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>\n      ${icon.svgContent.replace(/<svg[^>]*>|<\/svg>/g, '').trim()}\n    </svg>\n  );\n}`;
    navigator.clipboard.writeText(jsxString);
    setCopiedType('jsx');
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-100 overflow-hidden font-sans">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                  Vector Symbols
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white font-serif">
                Developer Icon Catalog
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                Precision vector icons tuned to 24px grid alignment. Customize scale, stroke weight, and palette dynamically,
                then copy standalone SVG or React JSX directly into your source tree.
              </p>
            </div>

            <Link
              href="/admin/icons"
              className="flex items-center gap-2 text-xs px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>Admin Icon Studio</span>
            </Link>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search vector icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid + Inspector Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Icons Grid */}
            <div className="lg:col-span-2 space-y-3">
              <div className="text-xs text-slate-400 font-mono">
                Showing {filteredIcons.length} of {icons.length} vector icons
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {filteredIcons.map((icon) => {
                  const isSelected = activeIcon?.id === icon.id;
                  return (
                    <button
                      key={icon.id}
                      onClick={() => setSelectedIcon(icon)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-slate-900 shadow-md ring-1 ring-emerald-500/50'
                          : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div
                        className="h-9 w-9 flex items-center justify-center"
                        dangerouslySetInnerHTML={{
                          __html: icon.svgContent
                            .replace(/stroke="[^"]*"/g, `stroke="${isSelected ? '#10B981' : '#94A3B8'}"`)
                            .replace(/width="[^"]*"/g, 'width="24"')
                            .replace(/height="[^"]*"/g, 'height="24"'),
                        }}
                      />
                      <span className="text-[11px] font-medium text-slate-300 truncate w-full">
                        {icon.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Customizer & Inspector */}
            {activeIcon && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-emerald-400" />
                    Vector Inspector
                  </h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {activeIcon.category}
                  </span>
                </div>

                <div className="p-6 rounded-2xl border border-slate-800 bg-[#070A11] flex flex-col items-center justify-center space-y-4 min-h-[220px]">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: activeIcon.svgContent
                        .replace(/stroke="[^"]*"/g, `stroke="${iconColor}"`)
                        .replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`)
                        .replace(/width="[^"]*"/g, `width="${iconSize}"`)
                        .replace(/height="[^"]*"/g, `height="${iconSize}"`),
                    }}
                  />
                  <div className="text-center">
                    <div className="font-semibold text-sm text-white">{activeIcon.name}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      {iconSize}px × {iconSize}px · {strokeWidth}px stroke
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1.5">
                      <span>Dimensions:</span>
                      <span className="font-mono text-emerald-400">{iconSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="16"
                      max="64"
                      step="4"
                      value={iconSize}
                      onChange={(e) => setIconSize(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1.5">
                      <span>Stroke Weight:</span>
                      <span className="font-mono text-emerald-400">{strokeWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.5"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="text-slate-400 mb-1.5">Color Accent:</div>
                    <div className="flex items-center gap-2">
                      {['#10B981', '#38BDF8', '#F8FAFC', '#F59E0B', '#EF4444', '#A855F7'].map((col) => (
                        <button
                          key={col}
                          onClick={() => setIconColor(col)}
                          className={`h-6 w-6 rounded-full border transition-transform ${
                            iconColor === col ? 'scale-110 ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-950' : ''
                          }`}
                          style={{ backgroundColor: col, borderColor: 'rgba(255,255,255,0.2)' }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3 flex gap-2">
                    <button
                      onClick={() => copySvg(activeIcon.svgContent)}
                      className="flex-1 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-400 transition-colors"
                    >
                      {copiedType === 'svg' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedType === 'svg' ? 'Copied SVG' : 'Copy SVG'}</span>
                    </button>
                    <button
                      onClick={() => copyJsx(activeIcon)}
                      className="flex-1 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-700 transition-colors"
                    >
                      {copiedType === 'jsx' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Code2 className="h-3.5 w-3.5" />}
                      <span>{copiedType === 'jsx' ? 'Copied JSX' : 'Copy JSX'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
