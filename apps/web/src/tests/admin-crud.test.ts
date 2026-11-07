import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAdminSections,
  saveAdminSection,
  deleteAdminSection,
  getAdminTemplates,
  saveAdminTemplate,
  deleteAdminTemplate,
  getAdminThemes,
  saveAdminTheme,
  deleteAdminTheme,
  getAdminActivityLog,
  logAdminActivity,
} from '../lib/admin-store';

// Storage mock for Node 22 environment
const storageStore: Record<string, string> = {};
const storageMock = {
  getItem: (key: string) => storageStore[key] || null,
  setItem: (key: string, val: string) => {
    storageStore[key] = val;
  },
  removeItem: (key: string) => {
    delete storageStore[key];
  },
  clear: () => {
    for (const k in storageStore) delete storageStore[k];
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  writable: true,
  configurable: true,
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: storageMock,
    writable: true,
    configurable: true,
  });
}

describe('Admin Extended Resource CRUD and Telemetry', () => {
  beforeEach(() => {
    storageMock.clear();
  });

  it('loads default seed sections and performs CRUD', () => {
    const initial = getAdminSections();
    expect(initial.length).toBeGreaterThan(0);

    const testSection = {
      id: 'sec-custom-test',
      name: 'Test Section Alpha',
      slug: 'test-section-alpha',
      category: 'Hero',
      description: 'Test hero layout',
      componentSlugs: ['hero-geometric'],
      status: 'published' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveAdminSection(testSection);
    const afterSave = getAdminSections();
    expect(afterSave.some((s) => s.id === 'sec-custom-test')).toBe(true);

    deleteAdminSection('sec-custom-test');
    const afterDelete = getAdminSections();
    expect(afterDelete.some((s) => s.id === 'sec-custom-test')).toBe(false);
  });

  it('loads default seed templates and performs CRUD', () => {
    const initial = getAdminTemplates();
    expect(initial.length).toBeGreaterThan(0);

    const testTemplate = {
      id: 'tpl-custom-test',
      name: 'Custom SaaS Kit',
      slug: 'custom-saas-kit',
      description: 'Complete stack',
      framework: 'Next.js 15',
      pages: ['Home', 'Pricing'],
      componentSlugs: ['bento-grid'],
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveAdminTemplate(testTemplate);
    const afterSave = getAdminTemplates();
    expect(afterSave.some((t) => t.id === 'tpl-custom-test')).toBe(true);

    deleteAdminTemplate('tpl-custom-test');
    const afterDelete = getAdminTemplates();
    expect(afterDelete.some((t) => t.id === 'tpl-custom-test')).toBe(false);
  });

  it('loads default seed themes and performs CRUD', () => {
    const initial = getAdminThemes();
    expect(initial.length).toBeGreaterThan(0);

    const testTheme = {
      id: 'thm-custom-test',
      name: 'Neon Horizon',
      slug: 'neon-horizon',
      description: 'Vibrant neon palette',
      bg: '#050505',
      surface: '#101010',
      border: '#202020',
      accent: '#00ffcc',
      status: 'published' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveAdminTheme(testTheme);
    const afterSave = getAdminThemes();
    expect(afterSave.some((thm) => thm.id === 'thm-custom-test')).toBe(true);

    deleteAdminTheme('thm-custom-test');
    const afterDelete = getAdminThemes();
    expect(afterDelete.some((thm) => thm.id === 'thm-custom-test')).toBe(false);
  });

  it('records and returns activity log entries', () => {
    logAdminActivity({
      action: 'create',
      resourceType: 'component',
      resourceName: 'Dynamic Widget',
      details: 'Created via admin panel',
    });

    const logs = getAdminActivityLog();
    expect(logs.length).toBeGreaterThan(0);
    const last = logs[0];
    expect(last.resourceName).toBe('Dynamic Widget');
    expect(last.action).toBe('create');
  });
});
