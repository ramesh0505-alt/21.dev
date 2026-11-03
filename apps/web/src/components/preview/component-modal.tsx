'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { ComponentMeta } from '@/types/registry';
import { componentDemos, registry } from '@/registry';
import { ActionBar } from './action-bar';
import { isFavorite, toggleFavorite } from '@/lib/storage';
import { getSimilarComponents } from '@/lib/similar';

interface ComponentModalProps {
  component: ComponentMeta | null;
  onClose: () => void;
}

export function ComponentModal({ component, onClose }: ComponentModalProps) {
  const router = useRouter();
  const [remountKey, setRemountKey] = useState(0);
  const [saved, setSaved] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSimilarInView, setIsSimilarInView] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const similarSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (component) {
      setSaved(isFavorite(component.slug));
      const idx = registry.findIndex((c) => c.slug === component.slug);
      if (idx !== -1) setCurrentIndex(idx);
      setIsSimilarInView(false);
      // Reset scroll to top on open or component change
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [component]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && component && !isSimilarInView) handleNext();
      if (e.key === 'ArrowLeft' && component && !isSimilarInView) handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [component, currentIndex, isSimilarInView, onClose]);

  if (!component) return null;

  const currentComp = registry[currentIndex] || component;
  const DemoComponent = componentDemos[currentComp.slug];

  // Retrieve 8 similar components for the 4x2 grid matching the video
  const similarComponents = getSimilarComponents(currentComp.slug, 8);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % registry.length;
    setCurrentIndex(nextIdx);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + registry.length) % registry.length;
    setCurrentIndex(prevIdx);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Detect scroll position to update header and action button state
  const handleScroll = () => {
    if (!scrollContainerRef.current || !similarSectionRef.current) return;
    const scrollPos = scrollContainerRef.current.scrollTop;
    const similarOffset = similarSectionRef.current.offsetTop - 120;
    setIsSimilarInView(scrollPos >= similarOffset);
  };

  // Toggle between preview stage and similar grid
  const handleToggleSimilar = () => {
    if (!scrollContainerRef.current || !similarSectionRef.current) return;
    if (isSimilarInView) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      similarSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // When a similar card is clicked in the grid
  const handleSelectSimilar = (selected: ComponentMeta) => {
    const idx = registry.findIndex((c) => c.slug === selected.slug);
    if (idx !== -1) {
      setCurrentIndex(idx);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
        {/* Top Header Bar: dynamically adapts title matching the video */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 bg-[#09090b]/95 backdrop-blur-md px-5 py-3 shrink-0 z-30">
          <div className="flex items-center gap-3">
            {/* Glowing gradient rainbow circular logo badge */}
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-0.5 flex items-center justify-center shadow-md shadow-rose-500/20">
              <div className="h-full w-full rounded-full bg-[#09090b] flex items-center justify-center text-[9px] font-black text-white">
                21
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-neutral-100 truncate max-w-xs sm:max-w-xl transition-all duration-200">
                {isSimilarInView ? `Similar to ${currentComp.name}` : currentComp.name}
              </h3>
            </div>
          </div>

          {/* Right Header Controls matching video & screenshots */}
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

        {/* Scrollable Container with Preview Stage & Similar Grid */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="relative flex-1 overflow-y-auto overflow-x-hidden bg-[#09090b] scroll-smooth scrollbar-thin scrollbar-thumb-neutral-800"
        >
          {/* SECTION 1: Active Component Preview Stage */}
          <div className="min-h-[82vh] p-4 sm:p-10 flex flex-col items-center justify-center relative">
            {/* Left Arrow Navigation */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer shadow-lg"
              title="Previous component"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Component Live Demo */}
            <div key={remountKey} className="w-full max-w-4xl flex items-center justify-center my-auto">
              {DemoComponent ? (
                <div className="w-full flex items-center justify-center">
                  <DemoComponent />
                </div>
              ) : (
                <div className="text-neutral-500 text-xs font-mono">Live Demo Active</div>
              )}
            </div>

            {/* Right Arrow Navigation Chevron */}
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer shadow-lg"
              title="Next component"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* SECTION 2: Similar to [Component Name] Image & Component Grid matching the video */}
          <div
            ref={similarSectionRef}
            className="border-t border-neutral-900 bg-[#09090b] px-6 sm:px-10 pt-10 pb-24 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Similar to {currentComp.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Components with matching design patterns, physics, or tags
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-500">
                {similarComponents.length} items
              </span>
            </div>

            {/* 4-Column Responsive Image Grid matching the user video */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {similarComponents.map((sim, idx) => (
                <SimilarGridCard
                  key={sim.id}
                  component={sim}
                  likes={900 + ((idx * 53) % 240)}
                  comments={12 + ((idx * 17) % 55)}
                  onSelect={() => handleSelectSimilar(sim)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Floating Bottom Action Bar matching video & Screenshot 2 */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none z-30">
          <ActionBar
            component={currentComp}
            isSimilarView={isSimilarInView}
            onToggleSimilar={handleToggleSimilar}
            onOpenRemix={() => {
              onClose();
              router.push(`/remix/${currentComp.slug}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Similar Grid Card matching the video frames (white/dark canvas with hover title & likes banner)
function SimilarGridCard({
  component,
  likes,
  comments,
  onSelect,
}: {
  component: ComponentMeta;
  likes: number;
  comments: number;
  onSelect: () => void;
}) {
  const DemoComponent = componentDemos[component.slug];
  const isLight = ['animated-button', 'clothing-rail', 'sushi-bar', 'lanyard-roster', 'card-stack'].includes(
    component.slug
  );

  return (
    <div
      onClick={onSelect}
      className="group relative flex flex-col h-56 rounded-2xl border border-neutral-800/80 bg-neutral-900/60 overflow-hidden shadow-lg transition-all duration-300 hover:border-neutral-600 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
    >
      {/* Visual Component Preview Stage */}
      <div
        className={`relative w-full h-full flex items-center justify-center p-3 transition-colors ${
          isLight
            ? 'bg-white text-neutral-950'
            : 'bg-neutral-950 text-white [background-image:radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:16px_16px]'
        }`}
      >
        {DemoComponent ? (
          <div className="w-full h-full flex items-center justify-center transform scale-[0.72] origin-center pointer-events-none">
            <DemoComponent />
          </div>
        ) : (
          <div className="font-mono text-xs text-neutral-500">Preview</div>
        )}
      </div>

      {/* Hover Bottom Banner matching user video frame 00:16-00:21 */}
      <div className="absolute inset-x-0 bottom-0 bg-neutral-950/95 backdrop-blur-md px-3.5 py-2.5 flex items-center justify-between border-t border-neutral-800/90 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-white truncate max-w-[140px]">
            {component.name}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono shrink-0">
          <span className="flex items-center gap-1 hover:text-purple-400">
            <Bookmark className="h-3 w-3" />
            {likes}
          </span>
          <span className="flex items-center gap-1 hover:text-blue-400">
            <MessageSquare className="h-3 w-3" />
            {comments}
          </span>
        </div>
      </div>
    </div>
  );
}
