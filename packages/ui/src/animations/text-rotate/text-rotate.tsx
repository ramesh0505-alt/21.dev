'use client';

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TextRotateProps {
  texts: string[];
  rotationInterval?: number;
  transition?: Transition;
  loop?: boolean;
  auto?: boolean;
  splitBy?: 'words' | 'characters';
  staggerDuration?: number;
  mainClassName?: string;
  elementLevelClassName?: string;
}

export interface TextRotateRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

export const TextRotate = forwardRef<TextRotateRef, TextRotateProps>(
  (
    {
      texts,
      transition = { type: 'spring', damping: 25, stiffness: 300 },
      rotationInterval = 2500,
      loop = true,
      auto = true,
      splitBy = 'words',
      staggerDuration = 0.02,
      mainClassName,
      elementLevelClassName,
    },
    ref
  ) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    const next = useCallback(() => {
      setCurrentTextIndex((prev) => (prev === texts.length - 1 ? (loop ? 0 : prev) : prev + 1));
    }, [texts.length, loop]);

    const previous = useCallback(() => {
      setCurrentTextIndex((prev) => (prev === 0 ? (loop ? texts.length - 1 : prev) : prev - 1));
    }, [texts.length, loop]);

    const jumpTo = useCallback(
      (index: number) => {
        setCurrentTextIndex(Math.max(0, Math.min(index, texts.length - 1)));
      },
      [texts.length]
    );

    const reset = useCallback(() => {
      setCurrentTextIndex(0);
    }, []);

    useImperativeHandle(ref, () => ({
      next,
      previous,
      jumpTo,
      reset,
    }));

    useEffect(() => {
      if (!auto) return;
      const interval = setInterval(next, rotationInterval);
      return () => clearInterval(interval);
    }, [auto, rotationInterval, next]);

    const currentText = texts[currentTextIndex] || '';

    return (
      <span className={cn('inline-flex overflow-hidden py-1 align-baseline', mainClassName)}>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentTextIndex}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={transition}
            className={cn('inline-block whitespace-nowrap font-bold', elementLevelClassName)}
          >
            {currentText}
          </motion.span>
        </AnimatePresence>
      </span>
    );
  }
);

TextRotate.displayName = 'TextRotate';
