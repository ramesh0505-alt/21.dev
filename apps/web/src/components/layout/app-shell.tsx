'use client';

import React, { useState } from 'react';
import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';
import { CommandMenu } from './command-menu';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#09090b] text-neutral-100 font-sans">
      <AppSidebar onOpenSearch={() => setSearchOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenSearch={() => setSearchOpen(true)} />
        <main className="flex-1 overflow-x-hidden px-6 md:px-10 py-6 bg-[#09090b]">
          {children}
        </main>
      </div>
      <CommandMenu isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
