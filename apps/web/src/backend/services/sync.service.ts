import { readSyncDatabase, writeSyncDatabase } from '@/database/db';
import type { AdminSyncDatabase, AdminActivity } from '@/database/schema';

/**
 * Service to handle CMS sync operations and state persistence.
 */
export class SyncService {
  /**
   * Retrieves the current full sync database state.
   */
  static getSyncState(): AdminSyncDatabase {
    return readSyncDatabase();
  }

  /**
   * Updates the sync database with partial or complete changes.
   */
  static updateSyncState(updates: Partial<AdminSyncDatabase>): AdminSyncDatabase {
    // Validate custom components if present
    if (updates.customComponents && !Array.isArray(updates.customComponents)) {
      throw new Error('customComponents must be an array');
    }

    // Validate custom categories if present
    if (updates.customCategories && !Array.isArray(updates.customCategories)) {
      throw new Error('customCategories must be an array');
    }

    // Validate custom sections if present
    if (updates.customSections && !Array.isArray(updates.customSections)) {
      throw new Error('customSections must be an array');
    }

    // Validate custom templates if present
    if (updates.customTemplates && !Array.isArray(updates.customTemplates)) {
      throw new Error('customTemplates must be an array');
    }

    // Validate custom themes if present
    if (updates.customThemes && !Array.isArray(updates.customThemes)) {
      throw new Error('customThemes must be an array');
    }

    // Validate custom icons if present
    if (updates.customIcons && !Array.isArray(updates.customIcons)) {
      throw new Error('customIcons must be an array');
    }

    return writeSyncDatabase(updates);
  }

  /**
   * Appends an activity log item to the database.
   */
  static logActivity(activity: Omit<AdminActivity, 'id' | 'timestamp'>): void {
    const current = readSyncDatabase();
    const newEntry: AdminActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...activity,
    };

    const logs = [newEntry, ...(current.activityLog || [])].slice(0, 100); // Keep last 100 entries
    writeSyncDatabase({ activityLog: logs });
  }
}
