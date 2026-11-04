'use client';

import React, { useState } from 'react';
import {
  DownloadCloud,
  UploadCloud,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  FileJson,
  ShieldCheck,
} from 'lucide-react';
import {
  exportAllAdminData,
  importAdminData,
  resetAllComponents,
  resetAllIcons,
  AdminBackupData,
} from '@/lib/admin-store';

export default function AdminExportPage() {
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [showFactoryResetModal, setShowFactoryResetModal] = useState(false);

  // Download JSON file
  const handleDownloadBackup = () => {
    const data = exportAllAdminData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devui-library-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy JSON string to clipboard
  const handleCopyJson = () => {
    const data = exportAllAdminData();
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setImportJsonText(text);
      } catch (err) {
        setImportStatus({
          type: 'error',
          message: 'Failed to read backup file.',
        });
      }
    };
    reader.readAsText(file);
  };

  // Apply import
  const handleApplyImport = () => {
    try {
      if (!importJsonText.trim()) {
        setImportStatus({
          type: 'error',
          message: 'Please paste or upload JSON backup data.',
        });
        return;
      }

      const parsed: AdminBackupData = JSON.parse(importJsonText);
      const success = importAdminData(parsed);

      if (success) {
        setImportStatus({
          type: 'success',
          message: 'Library data successfully restored from backup!',
        });
      } else {
        setImportStatus({
          type: 'error',
          message: 'Invalid backup structure. Import failed.',
        });
      }
    } catch (e: any) {
      setImportStatus({
        type: 'error',
        message: `JSON parse error: ${e.message}`,
      });
    }
  };

  // Factory Reset
  const handleFactoryReset = () => {
    resetAllComponents();
    resetAllIcons();
    setShowFactoryResetModal(false);
    setImportStatus({
      type: 'success',
      message: 'All custom modifications and hidden items have been reset to factory defaults.',
    });
  };

  return (
    <div className="space-y-10 max-w-4xl">
      {/* 1. Header */}
      <div className="border-b border-neutral-800/80 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 mb-2">
          Portability & Sync
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Backup, Export & Restore
        </h1>
        <p className="text-xs md:text-sm text-neutral-400 mt-1">
          Export your entire UI registry, custom components, categories, and icon vectors to JSON, or restore them across machines.
        </p>
      </div>

      {/* Status banner */}
      {importStatus.type && (
        <div
          className={`rounded-2xl border p-4 text-xs flex items-center justify-between ${
            importStatus.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/40 bg-red-500/10 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {importStatus.type === 'success' ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <span>{importStatus.message}</span>
          </div>
          <button
            onClick={() => setImportStatus({ type: null, message: '' })}
            className="text-neutral-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* 2. Export Section */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-white">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <DownloadCloud className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm">Export Library Snapshot</h2>
            <p className="text-xs text-neutral-400">
              Download complete local dataset including custom components, icons, and taxonomy.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleDownloadBackup}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors cursor-pointer shadow-sm"
          >
            <DownloadCloud className="h-4 w-4" />
            <span>Download Backup (.json)</span>
          </button>

          <button
            onClick={handleCopyJson}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-xs font-medium text-neutral-200 hover:text-white hover:border-neutral-600 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy JSON to Clipboard</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Import & Restore Section */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-white">
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <UploadCloud className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm">Restore from Backup</h2>
            <p className="text-xs text-neutral-400">
              Upload a previously exported JSON backup or paste the JSON text directly.
            </p>
          </div>
        </div>

        {/* Upload file input */}
        <div className="pt-2">
          <label className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2 text-xs font-medium text-neutral-200 hover:text-white hover:border-neutral-600 transition-colors cursor-pointer">
            <FileJson className="h-4 w-4 text-emerald-400" />
            <span>Select .json file from disk</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Or Paste JSON */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-300">
            Or paste backup JSON content:
          </label>
          <textarea
            rows={5}
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder='{ "version": "1.0.0", "customComponents": [...], ... }'
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-neutral-200 outline-none focus:border-emerald-500 font-mono text-[11px]"
          />
        </div>

        <button
          onClick={handleApplyImport}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors cursor-pointer shadow-sm"
        >
          <UploadCloud className="h-4 w-4" />
          <span>Apply and Restore Backup</span>
        </button>
      </div>

      {/* 4. Danger Zone: Factory Reset */}
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-red-300">
          <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
            <RotateCcw className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm">Reset to Factory Defaults</h2>
            <p className="text-xs text-red-400/80">
              Clear all custom components, restore all hidden built-in elements, and restore the default icon library.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowFactoryResetModal(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-600/20 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset All to Defaults</span>
        </button>
      </div>

      {/* Modal: Factory Reset Confirmation */}
      {showFactoryResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-[#0c0c0e] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-base font-bold text-white">
                Confirm Factory Reset
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              This will erase all custom added components and custom icons from local storage and restore all built-in items. This action cannot be undone unless you have a downloaded backup.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowFactoryResetModal(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleFactoryReset}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

