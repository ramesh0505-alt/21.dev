'use client';

import React from 'react';
import { TerminalWindow } from './terminal-window';

export function TerminalWindowDemo() {
  const lines = [
    { type: 'command' as const, text: 'pnpm dlx @ui-library/cli add animated-button' },
    { type: 'output' as const, text: '✔ Resolving component dependencies...' },
    { type: 'output' as const, text: '✔ Downloading animated-button.tsx -> ./components/ui/' },
    { type: 'success' as const, text: '✨ Successfully installed animated-button (14.2ms)' },
    { type: 'command' as const, text: 'pnpm dev' },
    { type: 'output' as const, text: '▲ Next.js 15.1.7 ready on http://localhost:3000' },
  ];

  return (
    <div className="flex items-center justify-center p-8">
      <TerminalWindow lines={lines} title="terminal — bash" />
    </div>
  );
}

export default TerminalWindowDemo;
