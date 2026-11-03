# Floating Input

A clean floating-label input field designed for developer credentials, forms, and settings.

## Installation

```bash
pnpm add clsx tailwind-merge
```

## Usage

```tsx
import { FloatingInput } from '@/components/ui/floating-input';

export function Example() {
  return (
    <FloatingInput
      label="Database URL"
      placeholder="postgresql://..."
      helperText="Enter your connection string."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | — | Label rendered inside that floats on focus or content |
| `error` | `string` | `undefined` | Error feedback message |
| `helperText` | `string` | `undefined` | Sub-input guidance description |

