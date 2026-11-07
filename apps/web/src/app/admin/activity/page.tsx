'use client';

import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  PlusCircle,
  Edit,
  Trash2,
  RefreshCw,
  DownloadCloud,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useAdminActivityLog, AdminActivity } from '@/lib/admin-store';

export default function AdminActivityPage() {
  const activities = useAdminActivityLog();

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [resourceFilter, setResourceFilter] = useState<string>('all');

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchesSearch =
        act.resourceName.toLowerCase().includes(search.toLowerCase()) ||
        (act.details && act.details.toLowerCase().includes(search.toLowerCase()));
      const matchesAction = actionFilter === 'all' || act.action === actionFilter;
      const matchesResource = resourceFilter === 'all' || act.resourceType === resourceFilter;
      return matchesSearch && matchesAction && matchesResource;
    });
  }, [activities, search, actionFilter, resourceFilter]);

  const getActionBadge = (action: AdminActivity['action']) => {
    switch (action) {
      case 'create':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <PlusCircle className="h-3 w-3" />
            CREATED
          </span>
        );
      case 'update':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Edit className="h-3 w-3" />
            UPDATED
          </span>
        );
      case 'delete':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
            <Trash2 className="h-3 w-3" />
            DELETED
          </span>
        );
      case 'sync':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <RefreshCw className="h-3 w-3" />
            SYNCED
          </span>
        );
      case 'export':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <DownloadCloud className="h-3 w-3" />
            EXPORTED
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Telemetry & Auditing
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
            Activity History & Audit Trail
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Real-time audit log of all CRUD operations, sync events, and resource modifications performed across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
          <Clock className="h-3.5 w-3.5" />
          <span>{activities.length} Recorded Actions</span>
        </div>
      </div>

      {/* Controls: Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search activity records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-500">Action:</span>
          {(['all', 'create', 'update', 'delete', 'sync'] as const).map((act) => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-2.5 py-1 rounded-lg border uppercase font-mono text-[10px] transition-colors ${
                actionFilter === act
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline Table */}
      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-mono text-[10px] uppercase">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Resource Type</th>
              <th className="py-3 px-4">Resource Identifier</th>
              <th className="py-3 px-4">Details / Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {filteredActivities.map((act) => {
              const dateStr = new Date(act.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });
              const dayStr = new Date(act.timestamp).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              });

              return (
                <tr key={act.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-400 whitespace-nowrap">
                    {dayStr} {dateStr}
                  </td>
                  <td className="py-3 px-4">{getActionBadge(act.action)}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-300 uppercase">
                    {act.resourceType}
                  </td>
                  <td className="py-3 px-4 font-medium text-white">{act.resourceName}</td>
                  <td className="py-3 px-4 text-neutral-400 text-[11px]">
                    {act.details || '—'}
                  </td>
                </tr>
              );
            })}

            {filteredActivities.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-neutral-500 italic">
                  No activity records match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
