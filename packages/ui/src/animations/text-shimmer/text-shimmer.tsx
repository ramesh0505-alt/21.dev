'use client';

import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

export function TextShimmer({
  children,
  as: Component = 'p',
  className,
  duration = 2.5,
  spread = 2,
}: TextShimmerProps) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-[length:250%_100%] bg-clip-text text-transparent [background-image:linear-gradient(110deg,rgba(148,163,184,0.4),45%,#ffffff,55%,rgba(148,163,184,0.4))] dark:[background-image:linear-gradient(110deg,rgba(148,163,184,0.3),45%,#10b981,55%,rgba(148,163,184,0.3))]',
        className
      )}
      initial={{ backgroundPosition: '100% 0' }}
      animate={{ backgroundPosition: '0 0' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
    >
      {children}
    </MotionComponent>
  );
}

