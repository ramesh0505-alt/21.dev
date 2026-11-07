import { describe, it, expect } from 'vitest';
import { registry } from '../registry';

describe('Component Registry Schema Compliance', () => {
  it('contains all 28 registered components', () => {
    expect(registry.length).toBe(28);
  });

  it('validates comprehensive metadata fields for all components', () => {
    for (const comp of registry) {
      expect(comp.id, `ID missing for ${comp.slug}`).toBeTruthy();
      expect(comp.name, `Name missing for ${comp.slug}`).toBeTruthy();
      expect(comp.slug, `Slug missing for ${comp.slug}`).toBeTruthy();
      expect(comp.description, `Description missing for ${comp.slug}`).toBeTruthy();
      expect(comp.category, `Category missing for ${comp.slug}`).toBeTruthy();
      expect(comp.subcategory, `Subcategory missing for ${comp.slug}`).toBeDefined();
      expect(comp.type, `Type missing for ${comp.slug}`).toBeDefined();
      expect(comp.tags, `Tags missing for ${comp.slug}`).toBeInstanceOf(Array);
      expect(comp.tags.length).toBeGreaterThan(0);
      expect(comp.dependencies, `Dependencies missing for ${comp.slug}`).toBeInstanceOf(Array);
      expect(comp.version, `Version missing for ${comp.slug}`).toBeTruthy();
      expect(comp.status, `Status missing for ${comp.slug}`).toBeTruthy();
      expect(comp.previewReference, `Preview reference missing for ${comp.slug}`).toBeTruthy();
      expect(comp.sourceFileLocations, `Source locations missing for ${comp.slug}`).toBeDefined();
      expect(comp.sourceFileLocations.component).toBeTruthy();
      expect(comp.sourceFileLocations.meta).toBeTruthy();
      expect(comp.thumbnail, `Thumbnail missing for ${comp.slug}`).toBeTruthy();
      expect(comp.variants, `Variants missing for ${comp.slug}`).toBeInstanceOf(Array);
      expect(comp.responsiveSupport, `Responsive support missing for ${comp.slug}`).toBeDefined();
      expect(comp.responsiveSupport?.mobile).toBe(true);
      expect(comp.accessibilityStatus, `Accessibility status missing for ${comp.slug}`).toBeDefined();
      expect(comp.themeCompatibility, `Theme compatibility missing for ${comp.slug}`).toBeInstanceOf(Array);
      expect(comp.createdAt).toBeTruthy();
      expect(comp.updatedAt).toBeTruthy();
    }
  });

  it('verifies that types are correctly categorized', () => {
    const validTypes = new Set(['element', 'section', 'template', 'animation', 'effect', '3d', 'icon']);
    for (const comp of registry) {
      expect(validTypes.has(comp.type!)).toBe(true);
    }
  });
});
