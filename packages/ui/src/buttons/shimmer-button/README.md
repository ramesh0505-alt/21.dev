# Shimmer Button

A smooth conic-gradient border shimmer button tailored for high-end dark interfaces.

## Installation

```bash
pnpm add clsx tailwind-merge
```

## Usage

```tsx
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { Sparkles } from 'lucide-react';

export function Example() {
  return (
    <ShimmerButton shimmerColor="#10b981">
      <Sparkles className="h-4 w-4" />
      Get Started
    </ShimmerButton>
  );
}
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `shimmerColor` | `string` | `'#10b981'` | Hex or RGB color of the rotating shimmer beam |
| `shimmerDuration` | `string` | `'2.5s'` | Cycle rotation period duration |
| `borderRadius` | `string` | `'100px'` | CSS border radius |
| `background` | `string` | `'rgba(11, 15, 25, 1)'` | Interior container color |

