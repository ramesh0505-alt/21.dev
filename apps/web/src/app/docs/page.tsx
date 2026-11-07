'use client';

import React, { useState } from 'react';
import { BookOpen, Terminal, Layers, RefreshCw, Upload, ShieldCheck, ChevronRight, Copy, Check } from 'lucide-react';
import Link from 'next/link';

interface DocSection {
  id: string;
  title: string;
  badge: string;
  content: {
    description: string;
    subsections: {
      heading: string;
      body: string;
      codeSnippet?: string;
      language?: string;
    }[];
  };
}

const DOCS_SECTIONS: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    badge: 'Quickstart',
    content: {
      description: 'The Private UI Library is an independent, production-grade developer platform inspired by 21st.dev workflows. It runs 100% locally with zero cloud dependencies or paid third-party services.',
      subsections: [
        {
          heading: '1. Monorepo Architecture',
          body: 'The project is organized as a high-performance pnpm monorepo separating production UI primitives from the web application platform.',
          codeSnippet: `ui-library/
├── apps/
│   └── web/                # Next.js 15 App Router platform
│       ├── src/
│       │   ├── app/        # 20 Application Modules
│       │   ├── registry/   # Component Registry JSON & Types
│       │   ├── lib/        # Local-first stores & broadcast channels
│       │   └── components/ # Layout & Preview modals
│       └── public/uploads/ # Local disk storage for media assets
├── packages/
│   └── ui/                 # 28 production components with demos
└── scripts/
    └── generate-registry.ts # Automatic manifest generator`,
          language: 'bash',
        },
        {
          heading: '2. Running the Development Server',
          body: 'Install workspace dependencies and start the Next.js dev server on port 3000.',
          codeSnippet: `pnpm install\npnpm generate-registry\npnpm --filter web dev`,
          language: 'bash',
        },
      ],
    },
  },
  {
    id: 'registry-schema',
    title: 'Component Registry Schema',
    badge: 'Architecture',
    content: {
      description: 'Every component in the library adheres to a strictly validated metadata schema. Running pnpm generate-registry scans packages/ui/src and generates typed mappings for instant rendering.',
      subsections: [
        {
          heading: 'Metadata Manifest (meta.json)',
          body: 'Each component folder contains a meta.json defining its identifier, category, dependencies, preview configuration, responsive support, and theme compatibility.',
          codeSnippet: `{
  "id": "btn-shimmer-button",
  "name": "Shimmer Button",
  "slug": "shimmer-button",
  "category": "Buttons",
  "subcategory": "Interactive",
  "section": "elements",
  "type": "element",
  "description": "Premium dark-mode button with animated conic border shimmer.",
  "dependencies": ["clsx", "tailwind-merge"],
  "version": "1.0.0",
  "status": "Ready",
  "previewReference": "ShimmerButtonDemo",
  "variants": ["default", "outline", "ghost", "accent"],
  "responsiveSupport": { "mobile": true, "tablet": true, "desktop": true },
  "accessibilityStatus": "Compliant"
}`,
          language: 'json',
        },
      ],
    },
  },
  {
    id: 'media-storage',
    title: 'Direct Local Media Uploads',
    badge: 'Storage',
    content: {
      description: 'In accordance with private-infrastructure rules, the platform never depends on external image or video hosting URLs. Media is uploaded directly from your filesystem to apps/web/public/uploads/.',
      subsections: [
        {
          heading: 'Upload API Endpoint (/api/upload)',
          body: 'The endpoint accepts multipart FormData, validates file types (MP4, WebM, PNG, WebP, JPG), streams file bytes directly to the local disk, and returns a local relative URL for instant previewing.',
          codeSnippet: `POST /api/upload
Content-Type: multipart/form-data

Response:
{
  "success": true,
  "url": "/uploads/media-shimmer-button.mp4",
  "filename": "media-shimmer-button.mp4",
  "size": 184520,
  "type": "video/mp4"
}`,
          language: 'json',
        },
        {
          heading: 'Split-Screen Preview Slots',
          body: 'Components feature Left and Right preview slots. You can switch seamlessly between the interactive live React demo, an uploaded local screenshot, or a demonstration video.',
        },
      ],
    },
  },
  {
    id: 'realtime-sync',
    title: 'Real-Time Cross-Tab Sync',
    badge: 'Sync Engine',
    content: {
      description: 'Changes made in the Admin Studio synchronize immediately to public library pages across all browser tabs without requiring a page reload.',
      subsections: [
        {
          heading: 'BroadcastChannel Architecture',
          body: 'The admin store utilizes the native browser BroadcastChannel API with topic "devui_realtime_sync". When any CRUD operation occurs, an event is emitted and all listening tabs update their state within 10 milliseconds.',
          codeSnippet: `// apps/web/src/lib/admin-store.ts
const channel = new BroadcastChannel('devui_realtime_sync');

export function notifySync(type: string, payload?: any) {
  channel.postMessage({ type, payload, timestamp: Date.now() });
}`,
          language: 'typescript',
        },
      ],
    },
  },
  {
    id: 'contributing',
    title: 'Adding New Components',
    badge: 'Workflow',
    content: {
      description: 'Follow this 4-step workflow to author and register new components into the monorepo.',
      subsections: [
        {
          heading: 'Step 1: Create Component Files',
          body: 'Create a new folder in packages/ui/src/<category>/<component-slug> containing the component, its demo, and a meta.json file.',
        },
        {
          heading: 'Step 2: Export from packages/ui/src/index.ts',
          body: 'Export both the component and its demo function from the UI package root.',
        },
        {
          heading: 'Step 3: Run Registry Generator',
          body: 'Run the generator command to index the new component and create TypeScript mappings.',
          codeSnippet: 'pnpm generate-registry',
          language: 'bash',
        },
        {
          heading: 'Step 4: Verify in Admin Studio',
          body: 'Open http://localhost:3000/admin/components to view, test live, and upload custom screenshots or demo recordings.',
        },
      ],
    },
  },
];

export default function DocsPage() {
  const [activeSectionId, setActiveSectionId] = useState<string>(DOCS_SECTIONS[0].id);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const activeSection = DOCS_SECTIONS.find((s) => s.id === activeSectionId) || DOCS_SECTIONS[0];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(code);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
      {/* Header */}
          <div className="border-b border-slate-800/80 pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Platform Reference
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-serif">
              Developer Documentation
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Complete architectural guide, workflow documentation, and development standards for maintaining and extending
              the private UI library platform.
            </p>
          </div>

          {/* Docs Layout: Sidebar Nav + Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar navigation */}
            <div className="space-y-1">
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2 px-3">
                Guide Chapters
              </div>
              {DOCS_SECTIONS.map((sec) => {
                const isActive = activeSection.id === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <span>{sec.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{sec.badge}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="md:col-span-3 space-y-6">
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono mb-3">
                    {activeSection.badge}
                  </div>
                  <h2 className="text-2xl font-bold text-white font-serif">
                    {activeSection.title}
                  </h2>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    {activeSection.content.description}
                  </p>
                </div>

                <div className="border-t border-slate-800/80 pt-6 space-y-6">
                  {activeSection.content.subsections.map((sub, idx) => (
                    <div key={idx} className="space-y-3">
                      <h3 className="text-base font-semibold text-slate-200">
                        {sub.heading}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {sub.body}
                      </p>
                      {sub.codeSnippet && (
                        <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300">
                          <button
                            onClick={() => handleCopy(sub.codeSnippet!)}
                            className="absolute right-3 top-3 p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                            title="Copy code"
                          >
                            {copiedSnippet === sub.codeSnippet ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <pre className="overflow-x-auto scrollbar-none pr-8">
                            {sub.codeSnippet}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
    </div>
  );
}
