# Floating Dock

A macOS style dynamic icon bar with spring magnification following cursor proximity.

## Installation

```bash
pnpm add motion clsx tailwind-merge lucide-react
```

## Usage

```tsx
import { FloatingDock } from '@/components/ui/floating-dock';
import { Home, Settings } from 'lucide-react';

export function Example() {
  const items = [
    { title: 'Home', icon: <Home className="h-4 w-4" /> },
    { title: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return <FloatingDock items={items} />;
}
```
