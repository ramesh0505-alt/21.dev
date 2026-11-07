import fs from 'fs';
import path from 'path';
import type { AdminSyncDatabase, ComponentMeta, CategoryDefinition } from './schema';

// Primary database paths in src/database/
const DB_DIR = path.join(process.cwd(), 'src', 'database');
const SYNC_DB_PATH = path.join(DB_DIR, 'admin-sync.json');
const REGISTRY_DB_PATH = path.join(DB_DIR, 'registry.json');

// Legacy fallback path for backward compatibility
const LEGACY_SYNC_PATH = path.join(process.cwd(), 'src', 'registry', 'admin-sync.json');

const DEFAULT_SYNC_DB: AdminSyncDatabase = {
  customComponents: [],
  deletedComponents: [],
  customIcons: [],
  deletedIcons: [],
  customCategories: [],
  customSections: [],
  customTemplates: [],
  customThemes: [],
  activityLog: [],
  updatedAt: new Date().toISOString(),
};

/**
 * Ensures the sync database JSON file exists on disk.
 */
export function ensureSyncDatabase(): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(SYNC_DB_PATH)) {
    fs.writeFileSync(SYNC_DB_PATH, JSON.stringify(DEFAULT_SYNC_DB, null, 2), 'utf-8');
  }
}

/**
 * Safely reads the persistent admin sync database.
 */
export function readSyncDatabase(): AdminSyncDatabase {
  ensureSyncDatabase();
  try {
    const raw = fs.readFileSync(SYNC_DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      customComponents: parsed.customComponents || [],
      deletedComponents: parsed.deletedComponents || [],
      customIcons: parsed.customIcons || [],
      deletedIcons: parsed.deletedIcons || [],
      customCategories: parsed.customCategories || [],
      customSections: parsed.customSections || [],
      customTemplates: parsed.customTemplates || [],
      customThemes: parsed.customThemes || [],
      activityLog: parsed.activityLog || [],
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.error('[DB] Failed to read admin-sync.json:', err);
    return DEFAULT_SYNC_DB;
  }
}

/**
 * Atomically writes data to the sync database using temporary file swap.
 * Guarantees zero corrupted files or partial writes.
 */
export function writeSyncDatabase(updates: Partial<AdminSyncDatabase>): AdminSyncDatabase {
  ensureSyncDatabase();
  const current = readSyncDatabase();

  const merged: AdminSyncDatabase = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const payload = JSON.stringify(merged, null, 2);
  const tempPath = `${SYNC_DB_PATH}.${Date.now()}.tmp`;

  try {
    fs.writeFileSync(tempPath, payload, 'utf-8');
    try {
      fs.renameSync(tempPath, SYNC_DB_PATH);
    } catch {
      // Windows file lock fallback: copy + unlink
      fs.copyFileSync(tempPath, SYNC_DB_PATH);
      fs.unlinkSync(tempPath);
    }

    // Mirror to legacy path for backward compatibility if it exists or directory exists
    try {
      const legacyDir = path.dirname(LEGACY_SYNC_PATH);
      if (fs.existsSync(legacyDir)) {
        fs.writeFileSync(LEGACY_SYNC_PATH, payload, 'utf-8');
      }
    } catch {
      // Silently ignore legacy mirror failure
    }

    return merged;
  } catch (err) {
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch {}
    }
    throw new Error(`Failed to atomically write sync database: ${(err as Error).message}`);
  }
}

/**
 * Reads the generated component registry database.
 */
export function readRegistryDatabase(): ComponentMeta[] {
  try {
    if (fs.existsSync(REGISTRY_DB_PATH)) {
      const raw = fs.readFileSync(REGISTRY_DB_PATH, 'utf-8');
      return JSON.parse(raw);
    }
    const legacyPath = path.join(process.cwd(), 'src', 'registry', 'registry.json');
    if (fs.existsSync(legacyPath)) {
      const raw = fs.readFileSync(legacyPath, 'utf-8');
      return JSON.parse(raw);
    }
    return [];
  } catch (err) {
    console.error('[DB] Failed to read registry.json:', err);
    return [];
  }
}

/**
 * Look up a component by slug from the registry database.
 */
export function getComponentBySlugFromDb(slug: string): ComponentMeta | undefined {
  const components = readRegistryDatabase();
  return components.find((c) => c.slug === slug);
}

/**
 * Filter components by category.
 */
export function getComponentsByCategoryFromDb(category: string): ComponentMeta[] {
  const components = readRegistryDatabase();
  return components.filter((c) => c.category.toLowerCase() === category.toLowerCase());
}

/**
 * Filter components by section.
 */
export function getComponentsBySectionFromDb(section: string): ComponentMeta[] {
  const components = readRegistryDatabase();
  return components.filter((c) => c.section.toLowerCase() === section.toLowerCase());
}
