'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  ExternalLink,
  RotateCcw,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  Bookmark,
} from 'lucide-react';
import { ComponentMeta } from '@/types/registry';
import { componentDemos, registry } from '@/registry';
import { ActionBar } from './action-bar';
import { isFavorite, toggleFavorite } from '@/lib/storage';

interface ComponentModalProps {
  component: ComponentMeta | null;
  onClose: () => void;
}

export function ComponentModal({ component, onClose }: ComponentModalProps) {
  const router = useRouter();
  const [remountKey, setRemountKey] = useState(0);
  const [saved, setSaved] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (component) {
      setSaved(isFavorite(component.slug));
      const idx = registry.findIndex((c) => c.slug === component.slug);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [component]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && component) handleNext();
      if (e.key === 'ArrowLeft' && component) handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [component, currentIndex, onClose]);

  if (!component) return null;

  const currentComp = registry[currentIndex] || component;
  const DemoComponent = componentDemos[currentComp.slug];

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % registry.length;
    setCurrentIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + registry.length) % registry.length;
    setCurrentIndex(prevIdx);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-6xl h-[92vh] overflow-hidden rounded-2xl border border-neutral-800 bg-[#09090b] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar matching Screenshot 2 */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 bg-[#09090b] px-5 py-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Glowing gradient rainbow circular logo badge */}
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-0.5 flex items-center justify-center shadow-md shadow-rose-500/20">
              <div className="h-full w-full rounded-full bg-[#09090b] flex items-center justify-center text-[9px] font-black text-white">
                21
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-neutral-100 truncate max-w-xs sm:max-w-lg">
                {currentComp.name}
              </h3>
            </div>
          </div>

          {/* Right Header Controls matching Screenshot 2 */}
          <div className="flex items-center gap-2 text-xs">
            <Link
              href={`/components/${currentComp.slug}`}
              className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-900 transition-colors"
              title="Open full page"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>

            <button
              onClick={() => {
                const next = toggleFavorite(currentComp.slug);
                setSaved(next);
              }}
              className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-900 transition-colors"
              title="Bookmark"
            >
              <Bookmark className={`h-4 w-4 ${saved ? 'fill-purple-400 text-purple-400' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-900 transition-colors"
              title="Close modal (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Center Canvas Stage matching Screenshot 2 */}
        <div className="relative flex-1 overflow-auto bg-[#09090b] p-4 sm:p-8 flex items-center justify-center">
          {/* Left Arrow Navigation */}
          <button
            onClick={handlePrev}
            className="absolute left-3 z-30 p-2 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
            title="Previous component"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Component Demo Stage */}
          <div key={remountKey} className="w-full max-w-4xl flex items-center justify-center">
            {DemoComponent ? (
              <div className="w-full flex items-center justify-center">
                <DemoComponent />
              </div>
            ) : (
              <div className="text-neutral-500 text-xs font-mono">Live Demo Active</div>
            )}
          </div>

          {/* Right Arrow Navigation Chevron matching Screenshot 2 */}
          <button
            onClick={handleNext}
            className="absolute right-3 z-30 p-2 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
            title="Next component"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Fixed Bottom Action Bar matching Screenshot 2 */}
        <div className="shrink-0 p-3 bg-[#09090b] border-t border-neutral-900/90 flex justify-center">
          <ActionBar
            component={currentComp}
            onOpenRemix={() => {
              onClose();
              router.push(`/remix/${currentComp.slug}`);
            }}
            onSelectSimilar={(sim) => {
              const idx = registry.findIndex((c) => c.slug === sim.slug);
              if (idx !== -1) setCurrentIndex(idx);
            }}
          />
        </div>
      </div>
    </div>
  );
}
