# Terminal Window

A macOS/Linux developer terminal preview block with window dots and formatted shell commands.

## Installation

```bash
pnpm add lucide-react clsx tailwind-merge
```

## Usage

```tsx
import { TerminalWindow } from '@/components/ui/terminal-window';

export function Example() {
  return (
    <TerminalWindow
      lines={[
        { type: 'command', text: 'git clone https://github.com/org/repo' },
        { type: 'success', text: 'Cloning into repo...' },
      ]}
    />
  );
}
```
