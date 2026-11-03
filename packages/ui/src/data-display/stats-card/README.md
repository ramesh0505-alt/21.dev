# Stats Card

Metric display card with trend badges and lightweight SVG sparklines.

## Installation

```bash
pnpm add lucide-react clsx tailwind-merge
```

## Usage

```tsx
import { StatsCard } from '@/components/ui/stats-card';

export function Example() {
  return (
    <StatsCard
      label="Total Requests"
      value="1.2M"
      change="+14%"
      trend="up"
      sparkline={[10, 20, 15, 30, 45]}
    />
  );
}
```

