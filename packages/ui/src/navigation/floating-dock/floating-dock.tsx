'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DockItem {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

export interface FloatingDockProps {
  items: DockItem[];
  className?: string;
}

function DockIcon({
  mouseX,
  item,
}: {
  mouseX: MotionValue<number>;
  item: DockItem;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 68, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onClick={item.onClick}
      className="group relative flex aspect-square cursor-pointer items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/80 text-slate-300 shadow-md backdrop-blur-md transition-colors hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white"
    >
      <div className="flex h-5 w-5 items-center justify-center">{item.icon}</div>

      {/* Tooltip */}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {item.title}
      </span>
    </motion.div>
  );
}

export function FloatingDock({ items, className }: FloatingDockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="flex items-center justify-center">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          'flex h-16 items-end gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 pb-3 shadow-2xl backdrop-blur-xl',
          className
        )}
      >
        {items.map((item) => (
          <DockIcon mouseX={mouseX} key={item.title} item={item} />
        ))}
      </motion.div>
    </div>
  );
}
