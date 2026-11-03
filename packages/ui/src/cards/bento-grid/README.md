# Bento Grid

An asymmetric grid system optimized for modern product storytelling and feature highlights.

## Installation

```bash
pnpm add clsx tailwind-merge lucide-react
```

## Usage

```tsx
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';

export function Example() {
  return (
    <BentoGrid>
      <BentoCard
        className="md:col-span-2"
        title="High Performance"
        description="Sub-millisecond cold starts with edge worker runtime."
      />
      <BentoCard
        title="Security"
        description="End-to-end encryption by default."
      />
    </BentoGrid>
  );
}
```
