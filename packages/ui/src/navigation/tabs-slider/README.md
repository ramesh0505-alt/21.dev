# Tabs Slider

A smooth sliding indicator tab strip with spring physics.

## Installation

```bash
pnpm add motion clsx tailwind-merge
```

## Usage

```tsx
import { TabsSlider } from '@/components/ui/tabs-slider';

export function Example() {
  const tabs = [
    { id: '1', label: 'Preview' },
    { id: '2', label: 'Code' },
  ];
  return <TabsSlider tabs={tabs} defaultTab="1" />;
}
```
