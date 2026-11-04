'use client';

import React from 'react';
import { EmojiNav, EmojiNavItem } from './emoji-nav';

const navItems: EmojiNavItem[] = [
  { label: 'Home', href: '#', emoji: '😍', alt: 'love' },
  { label: 'Explore', href: '#', emoji: '🚀', alt: 'rocket' },
  { label: 'Studio', href: '#', emoji: '🎨', alt: 'art' },
  { label: 'Pro', href: '#', emoji: '💎', alt: 'diamond' },
  { label: 'Team', href: '#', emoji: '🥳', alt: 'party' },
  { label: 'Ghost', href: '#', emoji: '👻', alt: 'ghost' },
];

export function EmojiNavDemo() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <EmojiNav navItems={navItems} />
      <p className="mt-6 text-xs text-neutral-400 font-mono">
        Floating interactive emoji navigation bar with tooltips
      </p>
    </div>
  );
}

