import { describe, it, expect } from 'vitest';
import { registry, getComponentBySlug, getComponentsByCategory } from '../registry';
import { getInstallCommand, toggleFavorite, isFavorite, getFavorites } from '../lib/storage';
import { ALL_CATEGORIES } from '../lib/categories';

describe('Component Registry Integrity', () => {
  it('discovers and loads components correctly', () => {
    expect(registry.length).toBeGreaterThan(0);
  });

  it('guarantees unique IDs and slugs across all components', () => {
    const ids = new Set<string>();
    const slugs = new Set<string>();

    for (const comp of registry) {
      expect(ids.has(comp.id)).toBe(false);
      expect(slugs.has(comp.slug)).toBe(false);
      ids.add(comp.id);
      slugs.add(comp.slug);
    }
  });

  it('contains required fields for every registered component', () => {
    for (const comp of registry) {
      expect(comp.id).toBeTruthy();
      expect(comp.name).toBeTruthy();
      expect(comp.slug).toBeTruthy();
      expect(comp.category).toBeTruthy();
      expect(comp.description).toBeTruthy();
      expect(comp.dependencies).toBeInstanceOf(Array);
      expect(comp.code?.component).toBeTruthy();
      expect(comp.version).toBeTruthy();
      expect(comp.status).toBeTruthy();
    }
  });

  it('correctly resolves components by slug', () => {
    const button = getComponentBySlug('animated-button');
    expect(button).toBeDefined();
    expect(button?.name).toBe('Animated Button');
  });

  it('filters components by category', () => {
    const buttons = getComponentsByCategory('Buttons');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Export and Installation Commands', () => {
  it('generates correct pnpm, npm, yarn, bun install commands', () => {
    const deps = ['motion', 'lucide-react', 'clsx'];
    expect(getInstallCommand(deps, 'pnpm')).toBe('pnpm add motion lucide-react clsx');
    expect(getInstallCommand(deps, 'npm')).toBe('npm install motion lucide-react clsx');
    expect(getInstallCommand(deps, 'yarn')).toBe('yarn add motion lucide-react clsx');
    expect(getInstallCommand(deps, 'bun')).toBe('bun add motion lucide-react clsx');
  });

  it('handles empty dependencies cleanly', () => {
    expect(getInstallCommand([], 'pnpm')).toBe('');
  });
});

describe('Local Storage & Favorites Management', () => {
  it('toggles and checks favorites', () => {
    const testSlug = 'animated-button';
    const initial = isFavorite(testSlug);
    const toggled = toggleFavorite(testSlug);
    expect(toggled).toBe(!initial);
    expect(isFavorite(testSlug)).toBe(!initial);
    // Restore
    toggleFavorite(testSlug);
  });
});
