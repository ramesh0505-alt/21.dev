'use client';

export interface UserCollection {
  id: string;
  name: string;
  description?: string;
  componentSlugs: string[];
  createdAt: string;
}

const FAVORITES_KEY = 'devui_favorites';
const RECENT_KEY = 'devui_recent';
const COLLECTIONS_KEY = 'devui_collections';
const PM_KEY = 'devui_pm_pref';

// In-memory fallback for environments where localStorage is restricted or in test runners
const memStore: Record<string, string> = {};

function safeGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // fallback
  }
  return memStore[key] || null;
}

function safeSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // fallback
  }
  memStore[key] = value;
}

function safeRemove(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // fallback
  }
  delete memStore[key];
}

export function getFavorites(): string[] {
  try {
    const raw = safeGet(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(slug: string): boolean {
  try {
    const current = getFavorites();
    const exists = current.includes(slug);
    const updated = exists ? current.filter((s) => s !== slug) : [...current, slug];
    safeSet(FAVORITES_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('devui_storage_updated'));
    }
    return !exists;
  } catch {
    return false;
  }
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

export function getRecentlyViewed(): string[] {
  try {
    const raw = safeGet(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordRecentView(slug: string): void {
  try {
    const current = getRecentlyViewed().filter((s) => s !== slug);
    const updated = [slug, ...current].slice(0, 20);
    safeSet(RECENT_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('devui_storage_updated'));
    }
  } catch {
    // Ignore storage errors
  }
}

export function getCollections(): UserCollection[] {
  try {
    const raw = safeGet(COLLECTIONS_KEY);
    return raw
      ? JSON.parse(raw)
      : [
          {
            id: 'col-core-saas',
            name: 'SaaS Platform Stack',
            description: 'Core components for modern software applications',
            componentSlugs: ['animated-button', 'floating-input', 'bento-grid', 'stats-card'],
            createdAt: new Date().toISOString(),
          },
          {
            id: 'col-landing',
            name: 'Landing Page Heroics',
            description: 'Eye-catching elements for marketing and conversion pages',
            componentSlugs: ['hero-geometric', 'tilt-card', 'shimmer-button', 'text-shimmer'],
            createdAt: new Date().toISOString(),
          },
        ];
  } catch {
    return [];
  }
}

export function createCollection(name: string, description?: string): UserCollection {
  const current = getCollections();
  const newCol: UserCollection = {
    id: `col-${Date.now()}`,
    name,
    description,
    componentSlugs: [],
    createdAt: new Date().toISOString(),
  };
  safeSet(COLLECTIONS_KEY, JSON.stringify([...current, newCol]));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('devui_storage_updated'));
  }
  return newCol;
}

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export function getPackageManagerPreference(): PackageManager {
  return (safeGet(PM_KEY) as PackageManager) || 'pnpm';
}

export function setPackageManagerPreference(pm: PackageManager): void {
  safeSet(PM_KEY, pm);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('devui_storage_updated'));
  }
}

export function getInstallCommand(dependencies: string[], pm: PackageManager = 'pnpm'): string {
  if (!dependencies.length) return '';
  const deps = dependencies.join(' ');
  switch (pm) {
    case 'pnpm':
      return `pnpm add ${deps}`;
    case 'npm':
      return `npm install ${deps}`;
    case 'yarn':
      return `yarn add ${deps}`;
    case 'bun':
      return `bun add ${deps}`;
  }
}
