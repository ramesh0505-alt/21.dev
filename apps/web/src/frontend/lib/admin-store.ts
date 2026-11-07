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

export interface AdminSection {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  componentSlugs: string[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface AdminTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  framework: string;
  pages: string[];
  componentSlugs: string[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface AdminTheme {
  id: string;
  name: string;
  slug: string;
  description: string;
  bg: string;
  surface: string;
  border: string;
  accent: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface AdminActivity {
  id: string;
  timestamp: string;
  action: 'create' | 'update' | 'delete' | 'sync' | 'export';
  resourceType: 'component' | 'section' | 'template' | 'theme' | 'icon' | 'category';
  resourceName: string;
  details?: string;
}

export interface AdminBackupData {
  version: string;
  exportedAt: string;
  customComponents: ComponentMeta[];
  deletedComponents: string[];
  customIcons: AdminIcon[];
  deletedIcons: string[];
  customCategories: AdminCategory[];
  customSections?: AdminSection[];
  customTemplates?: AdminTemplate[];
  customThemes?: AdminTheme[];
  activityLog?: AdminActivity[];
}

const CUSTOM_COMPONENTS_KEY = 'devui_custom_components';
const DELETED_COMPONENTS_KEY = 'devui_deleted_components';
const CUSTOM_ICONS_KEY = 'devui_custom_icons';
const DELETED_ICONS_KEY = 'devui_deleted_icons';
const CUSTOM_CATEGORIES_KEY = 'devui_custom_categories';
const CUSTOM_SECTIONS_KEY = 'devui_custom_sections';
const CUSTOM_TEMPLATES_KEY = 'devui_custom_templates';
const CUSTOM_THEMES_KEY = 'devui_custom_themes';
const ACTIVITY_LOG_KEY = 'devui_activity_log';

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
    logAdminActivity({
      action: 'update',
      resourceType: 'component',
      resourceName: component.name,
    });
  } else {
    updatedCustom = [component, ...custom];
    logAdminActivity({
      action: 'create',
      resourceType: 'component',
      resourceName: component.name,
    });
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

  logAdminActivity({
    action: 'delete',
    resourceType: 'component',
    resourceName: slug,
  });
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
    customSections: getAdminSections(),
    customTemplates: getAdminTemplates(),
    customThemes: getAdminThemes(),
    activityLog: getAdminActivityLog(),
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
    if (Array.isArray(data.customSections)) {
      safeSet(CUSTOM_SECTIONS_KEY, JSON.stringify(data.customSections));
    }
    if (Array.isArray(data.customTemplates)) {
      safeSet(CUSTOM_TEMPLATES_KEY, JSON.stringify(data.customTemplates));
    }
    if (Array.isArray(data.customThemes)) {
      safeSet(CUSTOM_THEMES_KEY, JSON.stringify(data.customThemes));
    }
    if (Array.isArray(data.activityLog)) {
      safeSet(ACTIVITY_LOG_KEY, JSON.stringify(data.activityLog));
    }
    logAdminActivity({
      action: 'sync',
      resourceType: 'component',
      resourceName: 'Full Library Backup Restored',
    });
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

// ======================== SECTION MANAGEMENT ========================

export const DEFAULT_SECTIONS: AdminSection[] = [
  {
    id: 'sec-hero-geometric',
    name: 'Hero Geometric Suite',
    slug: 'hero-geometric-suite',
    description: 'High-conversion hero header with floating geometric wireframe shapes and animated CTA.',
    category: 'Hero',
    componentSlugs: ['hero-geometric', 'animated-button', 'status-badge'],
    status: 'published',
    createdAt: '2026-11-04T12:00:00Z',
    updatedAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'sec-feature-bento',
    name: 'Feature Bento Showcase',
    slug: 'feature-bento-showcase',
    description: 'High-density grid layout demonstrating multi-scale product features with spotlight cards.',
    category: 'Features',
    componentSlugs: ['bento-grid', 'spotlight-card', 'tilt-card'],
    status: 'published',
    createdAt: '2026-11-04T12:00:00Z',
    updatedAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'sec-social-proof',
    name: 'Social Proof Stack',
    slug: 'social-proof-stack',
    description: 'Interactive client review cards and real-time metric counter banner.',
    category: 'Testimonials',
    componentSlugs: ['animated-testimonials', 'stats-card'],
    status: 'published',
    createdAt: '2026-11-04T12:00:00Z',
    updatedAt: '2026-11-04T12:00:00Z',
  },
];

export function getAdminSections(): AdminSection[] {
  try {
    const raw = safeGet(CUSTOM_SECTIONS_KEY);
    if (!raw) return DEFAULT_SECTIONS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SECTIONS;
  }
}

export function saveAdminSection(section: AdminSection): void {
  try {
    const current = getAdminSections();
    const idx = current.findIndex((s) => s.id === section.id || s.slug === section.slug);
    let updated: AdminSection[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = { ...section, updatedAt: new Date().toISOString() };
      logAdminActivity({
        action: 'update',
        resourceType: 'section',
        resourceName: section.name,
      });
    } else {
      updated = [section, ...current];
      logAdminActivity({
        action: 'create',
        resourceType: 'section',
        resourceName: section.name,
      });
    }
    safeSet(CUSTOM_SECTIONS_KEY, JSON.stringify(updated));
  } catch {}
}

export function deleteAdminSection(id: string): void {
  try {
    const current = getAdminSections();
    const target = current.find((s) => s.id === id);
    const updated = current.filter((s) => s.id !== id);
    safeSet(CUSTOM_SECTIONS_KEY, JSON.stringify(updated));
    if (target) {
      logAdminActivity({
        action: 'delete',
        resourceType: 'section',
        resourceName: target.name,
      });
    }
  } catch {}
}

// ======================== TEMPLATE MANAGEMENT ========================

export const DEFAULT_TEMPLATES: AdminTemplate[] = [
  {
    id: 'tpl-saas-landing',
    name: 'Modern SaaS Developer Landing',
    slug: 'saas-developer-landing',
    description: 'Complete high-performance marketing landing page with hero, interactive bento grid, testimonials, and terminal.',
    framework: 'Next.js 15 + React 19',
    pages: ['Landing', 'Features', 'Pricing'],
    componentSlugs: ['hero-geometric', 'bento-grid', 'stats-card', 'animated-testimonials', 'terminal-window'],
    status: 'published',
    createdAt: '2026-11-04T12:00:00Z',
    updatedAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'tpl-commerce-storefront',
    name: 'Curated Commerce Showcase',
    slug: 'commerce-showcase',
    description: 'Minimalist product discovery experience featuring 3D rail and coverflow galleries.',
    framework: 'Next.js 15 + React 19',
    pages: ['Storefront', 'Product Details'],
    componentSlugs: ['clothing-rail', 'coverflow-carousel', 'card-stack'],
    status: 'published',
    createdAt: '2026-11-04T12:00:00Z',
    updatedAt: '2026-11-04T12:00:00Z',
  },
];

export function getAdminTemplates(): AdminTemplate[] {
  try {
    const raw = safeGet(CUSTOM_TEMPLATES_KEY);
    if (!raw) return DEFAULT_TEMPLATES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TEMPLATES;
  }
}

export function saveAdminTemplate(template: AdminTemplate): void {
  try {
    const current = getAdminTemplates();
    const idx = current.findIndex((t) => t.id === template.id || t.slug === template.slug);
    let updated: AdminTemplate[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = { ...template, updatedAt: new Date().toISOString() };
      logAdminActivity({
        action: 'update',
        resourceType: 'template',
        resourceName: template.name,
      });
    } else {
      updated = [template, ...current];
      logAdminActivity({
        action: 'create',
        resourceType: 'template',
        resourceName: template.name,
      });
    }
    safeSet(CUSTOM_TEMPLATES_KEY, JSON.stringify(updated));
  } catch {}
}

export function deleteAdminTemplate(id: string): void {
  try {
    const current = getAdminTemplates();
    const target = current.find((t) => t.id === id);
    const updated = current.filter((t) => t.id !== id);
    safeSet(CUSTOM_TEMPLATES_KEY, JSON.stringify(updated));
    if (target) {
      logAdminActivity({
        action: 'delete',
        resourceType: 'template',
        resourceName: target.name,
      });
    }
  } catch {}
}

// ======================== THEME MANAGEMENT ========================

export const DEFAULT_THEMES: AdminTheme[] = [
  {
    id: 'thm-deep-navy',
    name: 'Deep Navy (Default)',
    slug: 'deep-navy',
    description: 'Obsidian navy developer interface with emerald phosphor accents.',
    bg: '#0B0F19',
    surface: '#111827',
    border: '#1E293B',
    accent: '#10B981',
    status: 'published',
    createdAt: '2026-11-04T12:00:00Z',
    updatedAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'thm-cyber-emerald',
    name: 'Cyber Emerald',
    slug: 'cyber-emerald',
    description: 'High-contrast nocturnal forest theme with deep spruce slate.',
    bg: '#061412',
    surface: '#0B221F',
    border: '#16433C',
    accent: '#10B981',
    status: 'published',
    createdAt: '2026-11-04T12:00:00Z',
    updatedAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'thm-charcoal-slate',
    name: 'Charcoal Slate',
    slug: 'charcoal-slate',
    description: 'Technical Swiss modernist darkroom with neutral graphite and sky blue.',
    bg: '#0F172A',
    surface: '#1E293B',
    border: '#334155',
    accent: '#38BDF8',
    status: 'published',
    createdAt: '2026-11-04T12:00:00Z',
    updatedAt: '2026-11-04T12:00:00Z',
  },
];

export function getAdminThemes(): AdminTheme[] {
  try {
    const raw = safeGet(CUSTOM_THEMES_KEY);
    if (!raw) return DEFAULT_THEMES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_THEMES;
  }
}

export function saveAdminTheme(theme: AdminTheme): void {
  try {
    const current = getAdminThemes();
    const idx = current.findIndex((t) => t.id === theme.id || t.slug === theme.slug);
    let updated: AdminTheme[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = { ...theme, updatedAt: new Date().toISOString() };
      logAdminActivity({
        action: 'update',
        resourceType: 'theme',
        resourceName: theme.name,
      });
    } else {
      updated = [theme, ...current];
      logAdminActivity({
        action: 'create',
        resourceType: 'theme',
        resourceName: theme.name,
      });
    }
    safeSet(CUSTOM_THEMES_KEY, JSON.stringify(updated));
  } catch {}
}

export function deleteAdminTheme(id: string): void {
  try {
    const current = getAdminThemes();
    const target = current.find((t) => t.id === id);
    const updated = current.filter((t) => t.id !== id);
    safeSet(CUSTOM_THEMES_KEY, JSON.stringify(updated));
    if (target) {
      logAdminActivity({
        action: 'delete',
        resourceType: 'theme',
        resourceName: target.name,
      });
    }
  } catch {}
}

// ======================== ACTIVITY LOGGING ========================

export function logAdminActivity(entry: {
  action: 'create' | 'update' | 'delete' | 'sync' | 'export';
  resourceType: 'component' | 'section' | 'template' | 'theme' | 'icon' | 'category';
  resourceName: string;
  details?: string;
}): void {
  try {
    const raw = safeGet(ACTIVITY_LOG_KEY);
    const existing: AdminActivity[] = raw ? JSON.parse(raw) : [];
    const newActivity: AdminActivity = {
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      ...entry,
    };
    const updated = [newActivity, ...existing].slice(0, 100);
    safeSet(ACTIVITY_LOG_KEY, JSON.stringify(updated));
  } catch {}
}

export function getAdminActivityLog(): AdminActivity[] {
  try {
    const raw = safeGet(ACTIVITY_LOG_KEY);
    if (!raw) {
      return [
        {
          id: 'act-init-1',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          action: 'sync',
          resourceType: 'component',
          resourceName: '28 Components Discovered',
          details: 'Initialized monorepo component registry from packages/ui/src',
        },
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// ======================== HOOKS EXTENSIONS ========================

export function useAdminSections(): AdminSection[] {
  const [sections, setSections] = useState<AdminSection[]>(DEFAULT_SECTIONS);

  useEffect(() => {
    const update = () => {
      setSections(getAdminSections());
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

  return sections;
}

export function useAdminTemplates(): AdminTemplate[] {
  const [templates, setTemplates] = useState<AdminTemplate[]>(DEFAULT_TEMPLATES);

  useEffect(() => {
    const update = () => {
      setTemplates(getAdminTemplates());
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

  return templates;
}

export function useAdminThemes(): AdminTheme[] {
  const [themes, setThemes] = useState<AdminTheme[]>(DEFAULT_THEMES);

  useEffect(() => {
    const update = () => {
      setThemes(getAdminThemes());
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

  return themes;
}

export function useAdminActivityLog(): AdminActivity[] {
  const [activities, setActivities] = useState<AdminActivity[]>([]);

  useEffect(() => {
    const update = () => {
      setActivities(getAdminActivityLog());
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

  return activities;
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
