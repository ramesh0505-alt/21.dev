'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ShoppingCart, Server, Briefcase, Utensils, LayoutDashboard, ArrowRight } from 'lucide-react';

export default function ProductKitsPage() {
  const kits = [
    {
      title: 'Developer SaaS Kit',
      icon: Server,
      category: 'SaaS',
      description: 'API key inputs, terminal windows, usage sparkline stats cards, and billing tier toggles.',
      slug: 'saas',
      count: 6,
    },
    {
      title: 'Engineer Portfolio Kit',
      icon: Briefcase,
      category: 'Portfolio',
      description: '3D tilt project cards, magnetic action buttons, text shimmer headlines, and macOS floating docks.',
      slug: 'portfolio',
      count: 4,
    },
    {
      title: 'Telemetry & Ops Dashboard',
      icon: LayoutDashboard,
      category: 'Dashboard',
      description: 'System ping status badges, stats cards, sliding tab bars, and quick clipboard terminal commands.',
      slug: 'dashboard',
      count: 4,
    },
    {
      title: 'Digital E-commerce Kit',
      icon: ShoppingCart,
      category: 'E-commerce',
      description: 'Checkout buttons with shimmer reflections, coupon input fields, and feature bento grids.',
      slug: 'e-commerce',
      count: 3,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 mb-2">
            <Compass className="h-3.5 w-3.5" />
            <span>Vertical Stacks</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Product-Specific UI Kits</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Pre-tailored component assemblies designed for specific digital product domains.
          </p>
        </div>

        <div className="font-mono text-xs text-slate-400">
          <span className="text-emerald-400 font-bold">{kits.length}</span> Product Kits
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kits.map((kit) => {
          const Icon = kit.icon;
          return (
            <div
              key={kit.slug}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-slate-700 hover:bg-slate-900/90"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-mono text-slate-400">
                    {kit.category}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{kit.title}</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{kit.description}</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                <span className="text-xs font-mono text-emerald-400">{kit.count} Components in kit</span>
                <Link
                  href="/elements"
                  className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-emerald-400 transition-colors font-medium"
                >
                  <span>Explore Kit</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

