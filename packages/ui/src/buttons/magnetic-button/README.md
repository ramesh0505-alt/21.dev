# Magnetic Button

A magnetic action button that pulls toward the mouse cursor when hovering within its bounds using spring physics.

## Installation

```bash
pnpm add motion clsx tailwind-merge
```

## Usage

```tsx
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Compass } from 'lucide-react';

export function Example() {
  return (
    <MagneticButton variant="emerald" magneticStrength={0.4}>
      <Compass className="h-4 w-4" />
      Attract Cursor
    </MagneticButton>
  );
}
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `magneticStrength` | `number` | `0.35` | Multiplier for cursor pull distance (0.1 to 0.6) |
| `variant` | `'emerald' \| 'outline' \| 'slate'` | `'emerald'` | Button color scheme |
| `children` | `React.ReactNode` | — | Button label and icons |

