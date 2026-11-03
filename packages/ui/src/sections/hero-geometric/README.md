# Geometric Hero

A developer platform landing hero with customizable headline and copyable terminal command.

## Installation

```bash
pnpm add lucide-react clsx tailwind-merge
```

## Usage

```tsx
import { HeroGeometric } from '@/components/ui/hero-geometric';

export function Example() {
  return (
    <HeroGeometric
      title="Build Faster with"
      highlightedText="Antigravity UI"
      description="The standard for modern engineering teams."
    />
  );
}
```
