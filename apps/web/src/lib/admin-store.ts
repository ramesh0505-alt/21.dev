'use client';

import { useState, useEffect } from 'react';
import { ComponentMeta } from '@/types/registry';
import { registry as baseRegistry } from '@/registry';

export interface AdminIcon {
  id: string;
  name: string;
  category: 'Navigation' | 'Media' | 'Actions' | 'Interface' | 'Development' | 'Badges';
  tags: string[];
  svgContent: string;
  author?: string;
  createdAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  description?: string;
  createdAt: string;
}

export interface AdminBackupData {
  version: string;
  exportedAt: string;
  customComponents: ComponentMeta[];
  deletedComponents: string[];
  customIcons: AdminIcon[];
  deletedIcons: string[];
  customCategories: AdminCategory[];
}

const CUSTOM_COMPONENTS_KEY = 'devui_custom_components';
const DELETED_COMPONENTS_KEY = 'devui_deleted_components';
const CUSTOM_ICONS_KEY = 'devui_custom_icons';
const DELETED_ICONS_KEY = 'devui_deleted_icons';
const CUSTOM_CATEGORIES_KEY = 'devui_custom_categories';

// Built-in starter icons
export const DEFAULT_ICONS: AdminIcon[] = [
  {
    id: 'icon-home',
    name: 'Home',
    category: 'Navigation',
    tags: ['home', 'main', 'dashboard', 'house'],
    svgContent: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    createdAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'icon-sparkles',
    name: 'Sparkles',
    category: 'Interface',
    tags: ['sparkles', 'ai', 'magic', 'clean', 'star'],
    svgContent: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
    createdAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'icon-copy',
    name: 'Copy',
    category: 'Actions',
    tags: ['copy', 'clipboard', 'duplicate', 'clone'],
    svgContent: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    createdAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'icon-terminal',
    name: 'Terminal',
    category: 'Development',
    tags: ['terminal', 'console', 'cli', 'code', 'command'],
    svgContent: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
    createdAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'icon-layers',
    name: 'Layers',
    category: 'Interface',
    tags: ['layers', 'stack', 'components', 'cards'],
    svgContent: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.5-9.17 4.16a2 2 0 0 1-1.66 0L2 12.5"/><path d="m22 17.5-9.17 4.16a2 2 0 0 1-1.66 0L2 17.5"/>',
    createdAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'icon-coffee',
    name: 'Coffee',
    category: 'Media',
    tags: ['coffee', 'cup', 'drink', 'beverage', 'cafe'],
    svgContent: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Z"/><path d="M6 2v2"/><path d="M17 10h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"/>',
    createdAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'icon-bookmark',
    name: 'Bookmark',
    category: 'Actions',
    tags: ['bookmark', 'save', 'favorite', 'pin'],
    svgContent: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
    createdAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'icon-shield',
    name: 'Shield Check',
    category: 'Badges',
    tags: ['shield', 'check', 'security', 'verified', 'safe'],
    svgContent: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    createdAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'icon-code',
    name: 'Code',
    category: 'Development',
    tags: ['code', 'developer', 'syntax', 'brackets'],
    svgContent: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    createdAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'icon-rocket',
    name: 'Rocket',
    category: 'Interface',
    tags: ['rocket', 'launch', 'deploy', 'fast', 'speed'],
    svgContent: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    createdAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'icon-heart',
    name: 'Heart',
    category: 'Actions',
    tags: ['heart', 'love', 'like', 'favorite'],
    svgContent: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    createdAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'icon-zap',
    name: 'Zap Lightning',
    category: 'Interface',
    tags: ['zap', 'bolt', 'lightning', 'energy', 'power', 'fast'],
    svgContent: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    createdAt: '2026-11-04T12:00:00Z',
  },
];

export const DEFAULT_CATEGORIES: AdminCategory[] = [
  { id: 'cat-buttons', name: 'Buttons', slug: 'buttons', description: 'Interactive buttons, tactile triggers, and action pills.', createdAt: '2026-11-04T12:00:00Z' },
  { id: 'cat-cards', name: 'Cards', slug: 'cards', description: '3D tilt cards, bento grids, and holographic wallets.', createdAt: '2026-11-04T12:00:00Z' },
  { id: 'cat-media', name: 'Product galleries', slug: 'product-galleries', description: 'Interactive rails, carousels, and product showcases.', createdAt: '2026-11-04T12:00:00Z' },
  { id: 'cat-images', name: 'Image galleries', slug: 'image-galleries', description: 'Polaroids, domino falls, and photo stacks.', createdAt: '2026-11-04T12:00:00Z' },
  { id: 'cat-nav', name: 'Navigation bars', slug: 'navigation-bars', description: 'Floating docks, tabs sliders, and emoji menus.', createdAt: '2026-11-04T12:00:00Z' },
  { id: 'cat-badges', name: 'Badges', slug: 'badges', description: 'Radar pings, status indicators, and operational shields.', createdAt: '2026-11-04T12:00:00Z' },
  { id: 'cat-text', name: 'Text animations', slug: 'text-animations', description: 'Kinetic typography, text rotation, and shimmer reveals.', createdAt: '2026-11-04T12:00:00Z' },
  { id: 'cat-term', name: 'Terminal interfaces', slug: 'terminal-interfaces', description: 'Developer console windows and CLI displays.', createdAt: '2026-11-04T12:00:00Z' },
  { id: 'cat-stats', name: 'Statistics', slug: 'statistics', description: 'KPI summaries with inline sparklines and indicators.', createdAt: '2026-11-04T12:00:00Z' },
  { id: 'cat-heroes', name: 'Hero sections', slug: 'hero-sections', description: 'High-impact landing hero banners and card fans.', createdAt: '2026-11-04T12:00:00Z' },
  { id: 'cat-test', name: 'Testimonials', slug: 'testimonials', description: 'Kinetic 3D review card stacks with blur reveals.', createdAt: '2026-11-04T12:00:00Z' },
];

// ======================== REAL-TIME BROADCAST ENGINE ========================

// Cross-tab Broadcast Channel
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('devui_realtime_sync');
    broadcastChannel.onmessage = (event) => {
      // When another tab broadcasts a change, fire local events so UI immediately updates
      window.dispatchEvent(new CustomEvent('devui_admin_updated', { detail: event.data }));
      window.dispatchEvent(new CustomEvent('devui_storage_updated', { detail: event.data }));
    };
  } catch {}
}

function safeGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {}
  return null;
}

function safeSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);

      const eventPayload = { key, timestamp: Date.now() };

      // 1. Dispatch in current window
      window.dispatchEvent(new CustomEvent('devui_admin_updated', { detail: eventPayload }));
      window.dispatchEvent(new CustomEvent('devui_storage_updated', { detail: eventPayload }));

      // 2. Broadcast to all other tabs and windows
      if (broadcastChannel) {
        broadcastChannel.postMessage(eventPayload);
      }

      // 3. Background server filesystem sync (non-blocking)
      triggerServerSync();
    }
  } catch {}
}

let syncTimeout: NodeJS.Timeout | null = null;
function triggerServerSync() {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(async () => {
    try {
      if (typeof window !== 'undefined') {
        const payload = {
          customComponents: getCustomComponents(),
          deletedComponents: getDeletedComponentSlugs(),
          customIcons: getAdminIcons().filter((i) => !DEFAULT_ICONS.some((d) => d.id === i.id)),
          deletedIcons: (function () {
            try {
              const r = safeGet(DELETED_ICONS_KEY);
              return r ? JSON.parse(r) : [];
            } catch {
              return [];
            }
          })(),
          customCategories: getAdminCategories(),
        };

        await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch {}
  }, 300);
}

// ======================== COMPONENT MANAGEMENT ========================

export function getCustomComponents(): ComponentMeta[] {
  try {
    const raw = safeGet(CUSTOM_COMPONENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getDeletedComponentSlugs(): string[] {
  try {
    const raw = safeGet(DELETED_COMPONENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getAdminComponents(): ComponentMeta[] {
  const custom = getCustomComponents();
  const deleted = new Set(getDeletedComponentSlugs());

  // Merge base registry with custom, excluding deleted
  const baseFiltered = baseRegistry.filter((c) => !deleted.has(c.slug));
  const customFiltered = custom.filter((c) => !deleted.has(c.slug));

  // If a custom component has the same slug as base, custom overrides it
  const map = new Map<string, ComponentMeta>();
  baseFiltered.forEach((c) => map.set(c.slug, c));
  customFiltered.forEach((c) => map.set(c.slug, c));

  return Array.from(map.values());
}

export function getAdminComponentBySlug(slug: string): ComponentMeta | undefined {
  const all = getAdminComponents();
  return all.find((c) => c.slug === slug);
}

export function saveAdminComponent(component: ComponentMeta): void {
  const custom = getCustomComponents();
  const deleted = getDeletedComponentSlugs();

  // Remove from deleted list if it was previously deleted
  const updatedDeleted = deleted.filter((slug) => slug !== component.slug);
  safeSet(DELETED_COMPONENTS_KEY, JSON.stringify(updatedDeleted));

  // Update or insert into custom components
  const existsIdx = custom.findIndex((c) => c.slug === component.slug);
  let updatedCustom: ComponentMeta[];
  if (existsIdx >= 0) {
    updatedCustom = [...custom];
    updatedCustom[existsIdx] = component;
  } else {
    updatedCustom = [component, ...custom];
  }

  safeSet(CUSTOM_COMPONENTS_KEY, JSON.stringify(updatedCustom));
}

export function deleteAdminComponent(slug: string): void {
  const custom = getCustomComponents();
  const deleted = getDeletedComponentSlugs();

  // Remove from custom if it exists there
  const updatedCustom = custom.filter((c) => c.slug !== slug);
  safeSet(CUSTOM_COMPONENTS_KEY, JSON.stringify(updatedCustom));

  // Add to deleted set so base registry item is hidden
  if (!deleted.includes(slug)) {
    safeSet(DELETED_COMPONENTS_KEY, JSON.stringify([...deleted, slug]));
  }
}

export function resetAllComponents(): void {
  safeSet(CUSTOM_COMPONENTS_KEY, JSON.stringify([]));
  safeSet(DELETED_COMPONENTS_KEY, JSON.stringify([]));
}

// ======================== ICON MANAGEMENT ========================

export function getAdminIcons(): AdminIcon[] {
  try {
    const customRaw = safeGet(CUSTOM_ICONS_KEY);
    const custom: AdminIcon[] = customRaw ? JSON.parse(customRaw) : [];
    const deletedRaw = safeGet(DELETED_ICONS_KEY);
    const deleted = new Set<string>(deletedRaw ? JSON.parse(deletedRaw) : []);

    const baseFiltered = DEFAULT_ICONS.filter((i) => !deleted.has(i.id));
    const customFiltered = custom.filter((i) => !deleted.has(i.id));

    const map = new Map<string, AdminIcon>();
    baseFiltered.forEach((i) => map.set(i.id, i));
    customFiltered.forEach((i) => map.set(i.id, i));

    return Array.from(map.values());
  } catch {
    return DEFAULT_ICONS;
  }
}

export function saveAdminIcon(icon: AdminIcon): void {
  try {
    const customRaw = safeGet(CUSTOM_ICONS_KEY);
    const custom: AdminIcon[] = customRaw ? JSON.parse(customRaw) : [];
    const deletedRaw = safeGet(DELETED_ICONS_KEY);
    const deleted: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];

    // Undelete if was deleted
    const updatedDeleted = deleted.filter((id) => id !== icon.id);
    safeSet(DELETED_ICONS_KEY, JSON.stringify(updatedDeleted));

    const idx = custom.findIndex((i) => i.id === icon.id);
    let updatedCustom: AdminIcon[];
    if (idx >= 0) {
      updatedCustom = [...custom];
      updatedCustom[idx] = icon;
    } else {
      updatedCustom = [icon, ...custom];
    }

    safeSet(CUSTOM_ICONS_KEY, JSON.stringify(updatedCustom));
  } catch {}
}

export function deleteAdminIcon(id: string): void {
  try {
    const customRaw = safeGet(CUSTOM_ICONS_KEY);
    const custom: AdminIcon[] = customRaw ? JSON.parse(customRaw) : [];
    const deletedRaw = safeGet(DELETED_ICONS_KEY);
    const deleted: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];

    const updatedCustom = custom.filter((i) => i.id !== id);
    safeSet(CUSTOM_ICONS_KEY, JSON.stringify(updatedCustom));

    if (!deleted.includes(id)) {
      safeSet(DELETED_ICONS_KEY, JSON.stringify([...deleted, id]));
    }
  } catch {}
}

export function resetAllIcons(): void {
  safeSet(CUSTOM_ICONS_KEY, JSON.stringify([]));
  safeSet(DELETED_ICONS_KEY, JSON.stringify([]));
}

// ======================== CATEGORY MANAGEMENT ========================

export function getAdminCategories(): AdminCategory[] {
  try {
    const customRaw = safeGet(CUSTOM_CATEGORIES_KEY);
    if (!customRaw) return DEFAULT_CATEGORIES;
    return JSON.parse(customRaw);
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveAdminCategory(category: AdminCategory): void {
  try {
    const current = getAdminCategories();
    const idx = current.findIndex((c) => c.slug === category.slug);
    let updated: AdminCategory[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = category;
    } else {
      updated = [...current, category];
    }
    safeSet(CUSTOM_CATEGORIES_KEY, JSON.stringify(updated));
  } catch {}
}

export function deleteAdminCategory(slug: string): void {
  try {
    const current = getAdminCategories();
    const updated = current.filter((c) => c.slug !== slug);
    safeSet(CUSTOM_CATEGORIES_KEY, JSON.stringify(updated));
  } catch {}
}

// ======================== EXPORT / IMPORT BACKUP ========================

export function exportAllAdminData(): AdminBackupData {
  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    customComponents: getCustomComponents(),
    deletedComponents: getDeletedComponentSlugs(),
    customIcons: (function () {
      try {
        const raw = safeGet(CUSTOM_ICONS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    })(),
    deletedIcons: (function () {
      try {
        const raw = safeGet(DELETED_ICONS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    })(),
    customCategories: getAdminCategories(),
  };
}

export function importAdminData(data: AdminBackupData): boolean {
  try {
    if (!data) return false;
    if (Array.isArray(data.customComponents)) {
      safeSet(CUSTOM_COMPONENTS_KEY, JSON.stringify(data.customComponents));
    }
    if (Array.isArray(data.deletedComponents)) {
      safeSet(DELETED_COMPONENTS_KEY, JSON.stringify(data.deletedComponents));
    }
    if (Array.isArray(data.customIcons)) {
      safeSet(CUSTOM_ICONS_KEY, JSON.stringify(data.customIcons));
    }
    if (Array.isArray(data.deletedIcons)) {
      safeSet(DELETED_ICONS_KEY, JSON.stringify(data.deletedIcons));
    }
    if (Array.isArray(data.customCategories)) {
      safeSet(CUSTOM_CATEGORIES_KEY, JSON.stringify(data.customCategories));
    }
    return true;
  } catch {
    return false;
  }
}

// ======================== REACT HOOKS ========================

export function useAdminComponents(): ComponentMeta[] {
  const [components, setComponents] = useState<ComponentMeta[]>(baseRegistry);

  useEffect(() => {
    const update = () => {
      setComponents(getAdminComponents());
    };
    update();

    // Listen to local, cross-tab, and window storage events
    window.addEventListener('devui_admin_updated', update);
    window.addEventListener('devui_storage_updated', update);
    window.addEventListener('storage', update);

    return () => {
      window.removeEventListener('devui_admin_updated', update);
      window.removeEventListener('devui_storage_updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return components;
}

export function useAdminIcons(): AdminIcon[] {
  const [icons, setIcons] = useState<AdminIcon[]>(DEFAULT_ICONS);

  useEffect(() => {
    const update = () => {
      setIcons(getAdminIcons());
    };
    update();

    window.addEventListener('devui_admin_updated', update);
    window.addEventListener('devui_storage_updated', update);
    window.addEventListener('storage', update);

    return () => {
      window.removeEventListener('devui_admin_updated', update);
      window.removeEventListener('devui_storage_updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return icons;
}

export function useAdminCategories(): AdminCategory[] {
  const [categories, setCategories] = useState<AdminCategory[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const update = () => {
      setCategories(getAdminCategories());
    };
    update();

    window.addEventListener('devui_admin_updated', update);
    window.addEventListener('devui_storage_updated', update);
    window.addEventListener('storage', update);

    return () => {
      window.removeEventListener('devui_admin_updated', update);
      window.removeEventListener('devui_storage_updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return categories;
}

export function useAdminRealtimeStatus(): {
  isSynced: boolean;
  lastUpdated: number;
} {
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  useEffect(() => {
    const update = () => {
      setLastUpdated(Date.now());
    };

    window.addEventListener('devui_admin_updated', update);
    window.addEventListener('devui_storage_updated', update);
    window.addEventListener('storage', update);

    return () => {
      window.removeEventListener('devui_admin_updated', update);
      window.removeEventListener('devui_storage_updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return { isSynced: true, lastUpdated };
}
