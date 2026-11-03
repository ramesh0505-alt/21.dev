'use client';

import React from 'react';
import { StatusBadge } from './status-badge';

export function StatusBadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-8">
      <StatusBadge status="online" label="All Systems Operational" />
      <StatusBadge status="busy" label="High Traffic Load" />
      <StatusBadge status="warning" label="Database Incident" />
      <StatusBadge status="offline" label="Maintenance Mode" ping={false} />
    </div>
  );
}

export default StatusBadgeDemo;

