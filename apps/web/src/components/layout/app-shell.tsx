'use client';

import React, { useState } from 'react';
import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';
import { CommandMenu } from './command-menu';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader onOpenSearch={() => setSearchOpen(true)} />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          {children}
        </main>
      </div>
      <CommandMenu isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
