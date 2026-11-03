'use client';

import React from 'react';
import { FloatingDock } from './floating-dock';
import { Home, Compass, Layers, Terminal, Sparkles, Settings } from 'lucide-react';

export function FloatingDockDemo() {
  const items = [
    { title: 'Overview', icon: <Home className="h-4 w-4" /> },
    { title: 'Explore', icon: <Compass className="h-4 w-4" /> },
    { title: 'Components', icon: <Layers className="h-4 w-4 text-emerald-400" /> },
    { title: 'CLI Console', icon: <Terminal className="h-4 w-4" /> },
    { title: 'Generative Lab', icon: <Sparkles className="h-4 w-4 text-amber-400" /> },
    { title: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="flex items-center justify-center p-12">
      <FloatingDock items={items} />
    </div>
  );
}

export default FloatingDockDemo;

