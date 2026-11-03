'use client';

import React from 'react';
import { TabsSlider } from './tabs-slider';
import { Code, Eye, FileText, Package } from 'lucide-react';

export function TabsSliderDemo() {
  const tabs = [
    { id: 'preview', label: 'Preview', icon: <Eye className="h-3.5 w-3.5" /> },
    { id: 'code', label: 'Code', icon: <Code className="h-3.5 w-3.5" />, badge: 'TSX' },
    { id: 'install', label: 'Install', icon: <Package className="h-3.5 w-3.5" /> },
    { id: 'docs', label: 'Docs', icon: <FileText className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <TabsSlider tabs={tabs} defaultTab="preview" />
    </div>
  );
}

export default TabsSliderDemo;
