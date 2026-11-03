# 3D Tilt Card

A tactile 3D card that tilts smoothly toward the user's cursor with spring damping and subtle glare reflection.

## Installation

```bash
pnpm add motion clsx tailwind-merge
```

## Usage

```tsx
import { TiltCard } from '@/components/ui/tilt-card';

export function Example() {
  return (
    <TiltCard maxTilt={15} glare={true} className="w-80">
      <h3 className="text-lg font-semibold text-white">Title</h3>
      <p className="text-sm text-slate-400">Content goes here...</p>
    </TiltCard>
  );
}
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `maxTilt` | `number` | `12` | Maximum degrees of rotation along X/Y axes |
| `perspective` | `number` | `1000` | 3D perspective depth in pixels |
| `glare` | `boolean` | `true` | Shows cursor-following radial light reflection |
