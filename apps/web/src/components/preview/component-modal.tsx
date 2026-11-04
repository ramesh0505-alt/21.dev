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
  Image as ImageIcon,
  Film,
  Play,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { ComponentMeta } from '@/types/registry';
import { componentDemos } from '@/registry';
import { useAdminComponents } from '@/lib/admin-store';
import { ActionBar } from './action-bar';
import { isFavorite, toggleFavorite } from '@/lib/storage';
import { getSimilarComponents } from '@/lib/similar';
import { getComponentMedia } from '@/lib/media-preview';

interface ComponentModalProps {
  component: ComponentMeta | null;
  onClose: () => void;
}

export function ComponentModal({ component, onClose }: ComponentModalProps) {
  const router = useRouter();
  const registry = useAdminComponents();
  const [remountKey, setRemountKey] = useState(0);
  const [saved, setSaved] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSimilarInView, setIsSimilarInView] = useState(false);
  const [mediaMode, setMediaMode] = useState<'live' | 'image' | 'video'>('live');

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const similarSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (component) {
      setSaved(isFavorite(component.slug));
      const idx = registry.findIndex((c) => c.slug === component.slug);
      if (idx !== -1) setCurrentIndex(idx);
      setIsSimilarInView(false);
      setMediaMode('live');
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
  const currentMedia = getComponentMedia(currentComp.slug, currentComp.name);

  // Previous and Next components for the side preview slots
  const prevIdx = (currentIndex - 1 + registry.length) % registry.length;
  const nextIdx = (currentIndex + 1) % registry.length;
  const prevComp = registry[prevIdx];
  const nextComp = registry[nextIdx];

  const prevMedia = getComponentMedia(prevComp.slug, prevComp.name);
  const nextMedia = getComponentMedia(nextComp.slug, nextComp.name);

  // Retrieve 8 similar components for the 4x2 grid matching the video
  const similarComponents = getSimilarComponents(currentComp.slug, 8);

  const handleNext = () => {
    setCurrentIndex(nextIdx);
    setMediaMode('live');
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentIndex(prevIdx);
    setMediaMode('live');
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current || !similarSectionRef.current) return;
    const scrollPos = scrollContainerRef.current.scrollTop;
    const similarOffset = similarSectionRef.current.offsetTop - 120;
    setIsSimilarInView(scrollPos >= similarOffset);
  };

  const handleToggleSimilar = () => {
    if (!scrollContainerRef.current || !similarSectionRef.current) return;
    if (isSimilarInView) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      similarSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSimilar = (selected: ComponentMeta) => {
    const idx = registry.findIndex((c) => c.slug === selected.slug);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setMediaMode('live');
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
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 bg-[#09090b]/95 backdrop-blur-md px-5 py-3 shrink-0 z-30">
          <div className="flex items-center gap-3">
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

          {/* Right Header Controls */}
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
              className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
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
            {/* Top Media Mode Switcher (Live, Image, Video) */}
            <div className="absolute top-4 inset-x-0 flex justify-center z-20">
              <div className="inline-flex items-center rounded-xl border border-neutral-800 bg-neutral-900/90 p-1 text-xs backdrop-blur-md shadow-lg">
                <button
                  onClick={() => setMediaMode('live')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition-all cursor-pointer ${
                    mediaMode === 'live'
                      ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span>Interactive Live</span>
                </button>

                <button
                  onClick={() => setMediaMode('image')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition-all cursor-pointer ${
                    mediaMode === 'image'
                      ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <ImageIcon className="h-3.5 w-3.5 text-sky-400" />
                  <span>Image Slot</span>
                </button>

                <button
                  onClick={() => setMediaMode('video')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition-all cursor-pointer ${
                    mediaMode === 'video'
                      ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Film className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Video Slot</span>
                </button>
              </div>
            </div>

            {/* LEFT SIDE: Image & Video Preview Slot for Previous Component */}
            <div className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20">
              {/* Desktop Full Card Slot */}
              <div
                onClick={handlePrev}
                className="hidden lg:flex flex-col items-start gap-1.5 group cursor-pointer"
                title={`Previous: ${prevComp.name}`}
              >
                <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 group-hover:text-emerald-400 transition-colors">
                  <ChevronLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Previous</span>
                </div>

                <div className="relative w-36 h-24 rounded-xl border border-neutral-800/90 bg-neutral-900/90 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-emerald-500/60 group-hover:scale-105 group-hover:shadow-emerald-500/10">
                  <img
                    src={prevMedia.imageUrl}
                    alt={prevComp.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2">
                    <span className="text-[10px] font-bold text-white truncate">
                      {prevComp.name}
                    </span>
                    <span className="text-[8px] text-neutral-400 font-mono">
                      {prevMedia.duration ? `🎬 Video ${prevMedia.duration}` : '🖼 Image'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile / Tablet Compact Chevron */}
              <button
                onClick={handlePrev}
                className="lg:hidden p-2.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer shadow-lg"
                title="Previous component"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            {/* CENTER STAGE: Dynamic Switcher for Live Demo / Image Slot / Video Slot */}
            <div key={remountKey} className="w-full max-w-4xl flex items-center justify-center my-auto pt-10">
              {mediaMode === 'live' && (
                <div className="w-full flex items-center justify-center animate-in fade-in duration-200">
                  {DemoComponent ? (
                    <div className="w-full flex items-center justify-center">
                      <DemoComponent />
                    </div>
                  ) : (
                    <div className="text-neutral-500 text-xs font-mono">Live Demo Active</div>
                  )}
                </div>
              )}

              {mediaMode === 'image' && (
                <div className="w-full max-w-2xl flex flex-col items-center justify-center space-y-3 animate-in fade-in duration-200">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl group">
                    <img
                      src={currentMedia.imageUrl}
                      alt={currentComp.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-sky-400 border border-sky-500/20">
                      <ImageIcon className="h-3 w-3" />
                      <span>High-Res Image Slot</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 text-center max-w-md">
                    {currentMedia.caption}
                  </p>
                </div>
              )}

              {mediaMode === 'video' && (
                <div className="w-full max-w-2xl flex flex-col items-center justify-center space-y-3 animate-in fade-in duration-200">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl flex items-center justify-center">
                    {currentMedia.videoUrl ? (
                      <video
                        src={currentMedia.videoUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
                        <img
                          src={currentMedia.imageUrl}
                          alt={currentComp.name}
                          className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm"
                        />
                        <div className="relative z-10 flex flex-col items-center space-y-2">
                          <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg">
                            <Play className="h-5 w-5 ml-0.5" />
                          </div>
                          <span className="font-semibold text-xs text-white">
                            Video Demo Motion Loop
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            Duration: {currentMedia.duration || '0:15'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                      <Film className="h-3 w-3" />
                      <span>Video Slot</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 text-center max-w-md">
                    {currentMedia.caption}
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT SIDE: Image & Video Preview Slot for Next Component */}
            <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20">
              {/* Desktop Full Card Slot */}
              <div
                onClick={handleNext}
                className="hidden lg:flex flex-col items-end gap-1.5 group cursor-pointer"
                title={`Next: ${nextComp.name}`}
              >
                <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 group-hover:text-emerald-400 transition-colors">
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>

                <div className="relative w-36 h-24 rounded-xl border border-neutral-800/90 bg-neutral-900/90 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-emerald-500/60 group-hover:scale-105 group-hover:shadow-emerald-500/10">
                  <img
                    src={nextMedia.imageUrl}
                    alt={nextComp.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2 text-right">
                    <span className="text-[10px] font-bold text-white truncate">
                      {nextComp.name}
                    </span>
                    <span className="text-[8px] text-neutral-400 font-mono">
                      {nextMedia.duration ? `🎬 Video ${nextMedia.duration}` : '🖼 Image'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile / Tablet Compact Chevron */}
              <button
                onClick={handleNext}
                className="lg:hidden p-2.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer shadow-lg"
                title="Next component"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* SECTION 2: Similar to [Component Name] Image & Component Grid */}
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

// Similar Grid Card matching the video frames
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
  const media = getComponentMedia(component.slug, component.name);

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
          <img
            src={media.imageUrl}
            alt={component.name}
            className="w-full h-full object-cover"
          />
        )}

        {/* Image / Video Slot badge on corner */}
        <div className="absolute top-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="inline-flex items-center gap-1 rounded bg-black/70 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-mono text-neutral-300 border border-neutral-800">
            <ImageIcon className="h-2.5 w-2.5 text-sky-400" />
            <span>Slot</span>
          </span>
        </div>
      </div>

      {/* Hover Bottom Banner matching user video frame */}
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
