# Animated Button

A tactile, spring-physics button built with Motion and Tailwind CSS. Supports micro-interactions, continuous shimmer sweeps, fluid loading states, and customizable icon placements.

## Installation

```bash
pnpm add motion lucide-react clsx tailwind-merge
```

## Usage

```tsx
import { AnimatedButton } from '@/components/ui/animated-button';
import { ArrowRight } from 'lucide-react';

export function Example() {
  return (
    <AnimatedButton variant="emerald" shimmer icon={ArrowRight}>
      Get Started
    </AnimatedButton>
  );
}
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'emerald' \| 'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'emerald'` | Visual styling mode |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button height and padding scale |
| `icon` | `LucideIcon` | `undefined` | Lucide icon component reference |
| `iconPosition` | `'left' \| 'right'` | `'right'` | Side to render the icon |
| `loading` | `boolean` | `false` | Displays spinning indicator and disables interactions |
| `shimmer` | `boolean` | `false` | Enables looping light reflection gradient sweep |
| `disabled` | `boolean` | `false` | HTML button disabled state |

