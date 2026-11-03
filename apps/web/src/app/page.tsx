'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { registry } from '@/registry';
import { ComponentCard } from '@/components/preview/component-card';
import { ComponentModal } from '@/components/preview/component-modal';
import { ComponentMeta } from '@/types/registry';

export default function DashboardPage() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentMeta | null>(null);

  // Top today components matching Screenshot 1 & the user's video demonstration
  const topTodaySlugs = ['clothing-rail', 'coffee-menu', 'sushi-bar', 'lanyard-roster'];
  const topToday = topTodaySlugs
    .map((slug) => registry.find((c) => c.slug === slug))
    .filter(Boolean) as ComponentMeta[];

  // New & noteworthy components
  const newNoteworthySlugs = ['polaroid-gallery', 'card-stack', 'hero-geometric', 'text-shimmer'];
  const newNoteworthy = newNoteworthySlugs
    .map((slug) => registry.find((c) => c.slug === slug))
    .filter(Boolean) as ComponentMeta[];

  // Remaining components for discovery
  const moreComponents = registry.filter(
    (c) => !topTodaySlugs.includes(c.slug) && !newNoteworthySlugs.includes(c.slug)
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      {/* SECTION 1: Top today matching 21st.dev Screenshot 1 */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Top today</h2>
            <p className="text-xs text-neutral-400 mt-0.5">The most saved components of the day</p>
          </div>

          <Link
            href="/elements"
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <span>View all</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* 4-column horizontal card grid with 1, 2, 3, 4 watermark ranking numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {topToday.map((comp, idx) => (
            <ComponentCard
              key={comp.id}
              component={comp}
              ranking={idx + 1}
              previewBg="light"
              onSelect={(c) => setSelectedComponent(c)}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2: New & noteworthy matching 21st.dev Screenshot 1 */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">New & noteworthy</h2>
            <p className="text-xs text-neutral-400 mt-0.5">The best components of the last month</p>
          </div>

          <Link
            href="/elements"
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <span>View all</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {newNoteworthy.map((comp) => (
            <ComponentCard
              key={comp.id}
              component={comp}
              previewBg={comp.slug === 'card-stack' ? 'light' : 'dark'}
              onSelect={(c) => setSelectedComponent(c)}
            />
          ))}
        </div>
      </section>

      {/* SECTION 3: Additional Component Discovery */}
      {moreComponents.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Engineered Primitives & Sections
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">Ready for production Next.js & React projects</p>
            </div>

            <Link
              href="/elements"
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <span>Explore all ({registry.length})</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {moreComponents.map((comp) => (
              <ComponentCard
                key={comp.id}
                component={comp}
                onSelect={(c) => setSelectedComponent(c)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 21st.dev Style Component Preview Modal with Similar Grid matching the video */}
      <ComponentModal
        component={selectedComponent}
        onClose={() => setSelectedComponent(null)}
      />
    </div>
  );
}
