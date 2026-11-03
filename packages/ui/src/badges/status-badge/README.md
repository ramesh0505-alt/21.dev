# Status Badge

Live operational status badge with pulsing ping animation.

## Installation

```bash
pnpm add clsx tailwind-merge
```

## Usage

```tsx
import { StatusBadge } from '@/components/ui/status-badge';

export function Example() {
  return <StatusBadge status="online" label="Operational" />;
}
```
