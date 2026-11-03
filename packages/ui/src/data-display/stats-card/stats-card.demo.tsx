'use client';

import React from 'react';
import { StatsCard } from './stats-card';

export function StatsCardDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 w-full max-w-4xl">
      <StatsCard
        label="Monthly Active Developers"
        value="48,290"
        change="+24.8%"
        trend="up"
        sparkline={[12, 19, 15, 25, 22, 38, 48]}
      />
      <StatsCard
        label="API P99 Latency"
        value="14.2ms"
        change="-8.4%"
        trend="up"
        sparkline={[32, 28, 25, 22, 18, 16, 14]}
      />
      <StatsCard
        label="Error Rate"
        value="0.002%"
        change="-0.01%"
        trend="up"
        sparkline={[10, 8, 6, 7, 5, 3, 2]}
      />
    </div>
  );
}

export default StatsCardDemo;

