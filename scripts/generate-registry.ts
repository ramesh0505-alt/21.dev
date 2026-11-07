import fs from 'fs';
import path from 'path';

export interface ComponentSourceLocations {
  component: string;
  demo?: string;
  test?: string;
  meta: string;
  readme?: string;
  styles?: string;
}

export type ComponentType =
  | 'element'
  | 'section'
  | 'template'
  | 'animation'
  | 'effect'
  | '3d'
  | 'icon';

export interface ResponsiveSupport {
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
}

export interface ComponentMetaRaw {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  section: 'elements' | 'navigation' | 'sections' | 'media' | 'animations' | 'data-display' | 'product-kits';
  type?: ComponentType;
  description: string;
  tags: string[];
  framework: string;
  stylingSystem: string;
  dependencies: string[];
  version: string;
  status: 'Inbox' | 'Reference' | 'Prototype' | 'Ready' | 'Deprecated';
  previewReference: string;
  sourceFileLocations: ComponentSourceLocations;
  thumbnail?: string;
  variants?: string[];
  responsiveSupport?: ResponsiveSupport;
  accessibilityStatus?: 'Compliant' | 'Partial' | 'Needs Review';
  themeCompatibility?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RegistryItem extends ComponentMetaRaw {
  code: {
    component: string;
    demo?: string;
    readme?: string;
    styles?: string;
  };
}

const UI_SRC_DIR = path.resolve(__dirname, '../packages/ui/src');
const OUTPUT_JSON = path.resolve(__dirname, '../apps/web/src/registry/registry.json');
const OUTPUT_TS = path.resolve(__dirname, '../apps/web/src/registry/index.ts');

function findMetaFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findMetaFiles(fullPath, fileList);
    } else if (entry.name === 'meta.json') {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function readFileSafe(filePath: string): string {
  const resolved = path.resolve(__dirname, '..', filePath);
  if (fs.existsSync(resolved)) {
    return fs.readFileSync(resolved, 'utf-8');
  }
  return '';
}

function main() {
  console.log('🔍 Discovering component metadata in packages/ui/src...');
  const metaFiles = findMetaFiles(UI_SRC_DIR);
  console.log(`Found ${metaFiles.length} component manifests.`);

  const registry: RegistryItem[] = [];

  for (const metaPath of metaFiles) {
    try {
      const raw = fs.readFileSync(metaPath, 'utf-8');
      const meta = JSON.parse(raw) as ComponentMetaRaw;

      // Extract raw code files for preview, copying & zip packaging
      const componentCode = readFileSafe(meta.sourceFileLocations.component);
      const demoCode = meta.sourceFileLocations.demo
        ? readFileSafe(meta.sourceFileLocations.demo)
        : undefined;
      const readmeCode = meta.sourceFileLocations.readme
        ? readFileSafe(meta.sourceFileLocations.readme)
        : undefined;
      const stylesCode = meta.sourceFileLocations.styles
        ? readFileSafe(meta.sourceFileLocations.styles)
        : undefined;

      function inferType(category: string, section: string, tags: string[]): ComponentType {
        const cat = category.toLowerCase();
        const sec = section.toLowerCase();
        const tagSet = new Set(tags.map((t) => t.toLowerCase()));

        if (cat.includes('3d') || tagSet.has('3d') || tagSet.has('three') || tagSet.has('webgl')) return '3d';
        if (cat.includes('animation') || sec === 'animations') return 'animation';
        if (cat.includes('background') || cat.includes('effect') || tagSet.has('grain') || tagSet.has('mesh')) return 'effect';
        if (sec === 'sections' || cat.includes('section') || cat.includes('hero') || cat.includes('cta') || cat.includes('faq')) return 'section';
        if (sec === 'product-kits' || cat.includes('template') || tagSet.has('template')) return 'template';
        if (cat.includes('icon') || tagSet.has('icon')) return 'icon';
        return 'element';
      }

      const inferredType = meta.type || inferType(meta.category, meta.section, meta.tags || []);
      const subcategory = meta.subcategory || (meta.section === 'elements' ? 'Form & Action' : meta.section === 'sections' ? 'Marketing Layout' : 'Interactive');
      const thumbnail = meta.thumbnail || `/previews/${meta.slug}.webp`;
      const variants = meta.variants || ['default', 'outline', 'ghost', 'accent'];
      const responsiveSupport = meta.responsiveSupport || { mobile: true, tablet: true, desktop: true };
      const accessibilityStatus = meta.accessibilityStatus || 'Compliant';
      const themeCompatibility = meta.themeCompatibility || ['dark-navy', 'emerald-accent', 'cyber-slate', 'minimal-monochrome', 'swiss-clean'];

      const item: RegistryItem = {
        ...meta,
        type: inferredType,
        subcategory,
        thumbnail,
        variants,
        responsiveSupport,
        accessibilityStatus,
        themeCompatibility,
        code: {
          component: componentCode,
          demo: demoCode,
          readme: readmeCode,
          styles: stylesCode,
        },
      };

      registry.push(item);
      console.log(`  ✔ Discovered [${meta.category}] ${meta.name} (${meta.slug})`);
    } catch (err) {
      console.error(`  ✖ Failed parsing ${metaPath}:`, err);
    }
  }

  // Sort by name
  registry.sort((a, b) => a.name.localeCompare(b.name));

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });

  // Write JSON
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(registry, null, 2), 'utf-8');
  console.log(`💾 Saved ${registry.length} components to ${OUTPUT_JSON}`);

  // Generate TypeScript index with demo registry mappings
  const demoImports = registry
    .map((item) => `import { ${item.previewReference} } from '@ui-library/ui';`)
    .join('\n');

  const demoMapEntries = registry
    .map((item) => `  '${item.slug}': ${item.previewReference},`)
    .join('\n');

  const tsContent = `// AUTO-GENERATED BY scripts/generate-registry.ts - DO NOT EDIT DIRECTLY
import registryData from './registry.json';
import type { ComponentMeta } from '@/types/registry';
import React from 'react';

${demoImports}

export const registry: ComponentMeta[] = registryData as unknown as ComponentMeta[];

export const componentDemos: Record<string, React.ComponentType<any>> = {
${demoMapEntries}
};

export function getComponentBySlug(slug: string): ComponentMeta | undefined {
  return registry.find((c) => c.slug === slug);
}

export function getComponentsByCategory(category: string): ComponentMeta[] {
  return registry.filter((c) => c.category.toLowerCase() === category.toLowerCase());
}

export function getComponentsBySection(section: string): ComponentMeta[] {
  return registry.filter((c) => c.section.toLowerCase() === section.toLowerCase());
}

export function getAllCategories(): { category: string; section: string; count: number }[] {
  const map = new Map<string, { section: string; count: number }>();
  for (const c of registry) {
    const existing = map.get(c.category) || { section: c.section, count: 0 };
    existing.count += 1;
    map.set(c.category, existing);
  }
  return Array.from(map.entries()).map(([category, info]) => ({
    category,
    section: info.section,
    count: info.count,
  }));
}
`;

  fs.writeFileSync(OUTPUT_TS, tsContent, 'utf-8');
  console.log(`💾 Generated TypeScript registry exports to ${OUTPUT_TS}`);
}

main();

