import { describe, it, expect, beforeEach } from 'vitest';

// Provide reliable mock localStorage for Node 22+ test environment
const mockStorage: Record<string, string> = {};
const storageMock = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    for (const k in mockStorage) delete mockStorage[k];
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

import {
  getAdminComponents,
  saveAdminComponent,
  deleteAdminComponent,
  resetAllComponents,
  getAdminIcons,
  saveAdminIcon,
  deleteAdminIcon,
  resetAllIcons,
  getAdminCategories,
  saveAdminCategory,
  deleteAdminCategory,
  exportAllAdminData,
  importAdminData,
  AdminIcon,
} from '../lib/admin-store';
import { ComponentMeta } from '../types/registry';

describe('Admin Store - Local-first Management Layer', () => {
  beforeEach(() => {
    storageMock.clear();
  });

  describe('Component CRUD', () => {
    it('returns base registry components by default', () => {
      const components = getAdminComponents();
      expect(components.length).toBeGreaterThan(0);
      expect(components.some((c) => c.slug === 'clothing-rail')).toBe(true);
    });

    it('can save a new custom component', () => {
      const customComp: ComponentMeta = {
        id: 'test-glow-button',
        name: 'Test Glow Button',
        slug: 'test-glow-button',
        category: 'Buttons',
        section: 'elements',
        description: 'A button with glow effect',
        tags: ['glow', 'button'],
        framework: 'React',
        stylingSystem: 'Tailwind CSS',
        dependencies: ['lucide-react'],
        version: '1.0.0',
        status: 'Ready',
        previewReference: 'animated-button',
        sourceFileLocations: {
          component: 'test.tsx',
          meta: 'test.json',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveAdminComponent(customComp);

      const all = getAdminComponents();
      const found = all.find((c) => c.slug === 'test-glow-button');
      expect(found).toBeDefined();
      expect(found?.name).toBe('Test Glow Button');
    });

    it('can delete/hide a component', () => {
      const initial = getAdminComponents();
      expect(initial.some((c) => c.slug === 'clothing-rail')).toBe(true);

      deleteAdminComponent('clothing-rail');

      const afterDelete = getAdminComponents();
      expect(afterDelete.some((c) => c.slug === 'clothing-rail')).toBe(false);

      // Reset restores it
      resetAllComponents();
      const afterReset = getAdminComponents();
      expect(afterReset.some((c) => c.slug === 'clothing-rail')).toBe(true);
    });
  });

  describe('Icon CRUD', () => {
    it('returns default icons by default', () => {
      const icons = getAdminIcons();
      expect(icons.length).toBe(12);
      expect(icons.some((i) => i.name === 'Home')).toBe(true);
      expect(icons.some((i) => i.name === 'Sparkles')).toBe(true);
    });

    it('can add a custom icon', () => {
      const newIcon: AdminIcon = {
        id: 'icon-cube',
        name: '3D Cube',
        category: 'Interface',
        tags: ['cube', '3d'],
        svgContent: '<path d="m21 16-9 5-9-5V8l9-5 9 5v8z"/>',
        createdAt: new Date().toISOString(),
      };

      saveAdminIcon(newIcon);

      const icons = getAdminIcons();
      expect(icons.length).toBe(13);
      expect(icons.some((i) => i.id === 'icon-cube')).toBe(true);
    });

    it('can delete an icon', () => {
      deleteAdminIcon('icon-home');

      const icons = getAdminIcons();
      expect(icons.some((i) => i.id === 'icon-home')).toBe(false);

      resetAllIcons();
      const restored = getAdminIcons();
      expect(restored.some((i) => i.id === 'icon-home')).toBe(true);
    });
  });

  describe('Category CRUD', () => {
    it('returns default categories', () => {
      const categories = getAdminCategories();
      expect(categories.length).toBeGreaterThan(5);
      expect(categories.some((c) => c.slug === 'buttons')).toBe(true);
    });

    it('can add and delete a custom category', () => {
      saveAdminCategory({
        id: 'cat-dialogs',
        name: 'Dialogs & Modals',
        slug: 'dialogs-modals',
        description: 'Popup windows',
        createdAt: new Date().toISOString(),
      });

      let categories = getAdminCategories();
      expect(categories.some((c) => c.slug === 'dialogs-modals')).toBe(true);

      deleteAdminCategory('dialogs-modals');
      categories = getAdminCategories();
      expect(categories.some((c) => c.slug === 'dialogs-modals')).toBe(false);
    });
  });

  describe('Export & Import Backup', () => {
    it('exports and restores complete library state', () => {
      saveAdminIcon({
        id: 'icon-custom-export-test',
        name: 'Custom Export Test',
        category: 'Development',
        tags: ['test'],
        svgContent: '<circle cx="12" cy="12" r="5"/>',
        createdAt: new Date().toISOString(),
      });

      const backup = exportAllAdminData();
      expect(backup.customIcons.some((i) => i.id === 'icon-custom-export-test')).toBe(true);

      // Clear storage
      storageMock.clear();
      expect(getAdminIcons().some((i) => i.id === 'icon-custom-export-test')).toBe(false);

      // Restore from backup
      const ok = importAdminData(backup);
      expect(ok).toBe(true);
      expect(getAdminIcons().some((i) => i.id === 'icon-custom-export-test')).toBe(true);
    });
  });
});
