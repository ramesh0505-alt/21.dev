# Spotlight Card

A sleek card component featuring a radial spotlight that dynamically follows mouse movement.

## Installation

```bash
pnpm add clsx tailwind-merge
```

## Usage

```tsx
import { SpotlightCard } from '@/components/ui/spotlight-card';

export function Example() {
  return (
    <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.2)">
      <h3 className="text-white font-semibold">Title</h3>
      <p className="text-slate-400 text-sm">Description text...</p>
    </SpotlightCard>
  );
}
```
