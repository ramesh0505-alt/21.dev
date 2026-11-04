'use client';

import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DominoItem {
  src: string;
  alt?: string;
  title?: string;
}

export interface DominoGalleryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  items: DominoItem[];
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  scrollLength?: number;
  standAngle?: number;
  autoplay?: boolean;
  autoplayDuration?: number;
  progress?: number;
  onSelect?: (index: number, item: DominoItem) => void;
}

const OVERLAP = 0.45;
const IDLE_BEFORE_AUTOPLAY_MS = 3000;
const AUTOPLAY_HOLD_MS = 1200;

function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function topple(t: number) {
  if (t < 0.72) {
    const u = t / 0.72;
    return u * u;
  }
  const u = (t - 0.72) / 0.28;
  return 1 + 0.06 * Math.sin(u * Math.PI) * (1 - u);
}

function cardProgress(progress: number, index: number, count: number) {
  if (count <= 1) return clamp01(progress);
  const window = 1 / (1 + OVERLAP * (count - 1));
  const start = index * window * OVERLAP;
  return clamp01((progress - start) / window);
}

export function DominoGallery({
  items,
  cardWidth = 180,
  cardHeight = 440,
  gap = 14,
  scrollLength = 800,
  standAngle = 92,
  autoplay = true,
  autoplayDuration = 2400,
  progress: controlledProgress,
  onSelect,
  className,
  style,
  ...rest
}: DominoGalleryProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [fitWidth, setFitWidth] = React.useState(cardWidth);
  const live = React.useRef({
    progress: 0,
    shown: -1,
    lastScrollAt: -Infinity,
    auto: { t: 0, dir: 1, hold: 0 },
    raf: 0,
    last: 0,
  });
  const isControlled = controlledProgress !== undefined;

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const fit = () => {
      const available = root.clientWidth - 48;
      const perCard = (available - gap * (items.length - 1)) / Math.max(1, items.length);
      setFitWidth(Math.max(64, Math.min(cardWidth, Math.floor(perCard))));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(root);
    return () => observer.disconnect();
  }, [cardWidth, gap, items.length]);

  const paint = React.useCallback(
    (progress: number) => {
      const s = live.current;
      const rounded = Math.round(progress * 1000) / 1000;
      if (rounded === s.shown) return;
      s.shown = rounded;
      const root = rootRef.current;
      root?.style.setProperty('--progress', String(rounded));
      for (let i = 0; i < items.length; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const t = topple(cardProgress(rounded, i, items.length));
        const angle = standAngle * (1 - t);
        card.style.setProperty('--fall', String(Math.round(t * 1000) / 1000));
        card.style.transform = `rotateX(${angle}deg)`;
      }
    },
    [items.length, standAngle]
  );

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const s = live.current;
    s.shown = -1;

    const frame = (now: number) => {
      s.raf = 0;
      const dt = s.last ? Math.min(now - s.last, 80) : 16;
      s.last = now;
      let target = s.progress;
      let keepGoing = false;

      if (isControlled) {
        target = clamp01(controlledProgress);
      } else if (autoplay) {
        const a = s.auto;
        if (a.hold > 0) a.hold -= dt;
        else {
          a.t = clamp01(a.t + (dt / autoplayDuration) * a.dir);
          if (a.t === 1 || a.t === 0) {
            a.dir *= -1;
            a.hold = AUTOPLAY_HOLD_MS;
          }
        }
        target = a.t;
        keepGoing = true;
      }

      s.progress = target;
      paint(target);
      if (keepGoing) s.raf = requestAnimationFrame(frame);
      else s.last = 0;
    };

    s.raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      s.last = 0;
    };
  }, [paint, isControlled, controlledProgress, autoplay, autoplayDuration]);

  const width = fitWidth;
  const height = Math.round((fitWidth / cardWidth) * cardHeight);
  const stageHeight = height + 48;

  return (
    <div
      ref={rootRef}
      className={cn('relative w-full overflow-hidden select-none py-6', className)}
      style={{ minHeight: stageHeight, ...style }}
      {...rest}
    >
      <div
        className="flex max-w-full justify-center px-4"
        style={{ gap, perspective: 1200, perspectiveOrigin: '50% -30%' }}
      >
        {items.map((item, index) => {
          const isSelected = selected === index;
          return (
            <div
              key={`${item.src}-${index}`}
              className="relative shrink-0"
              style={{ width, height, transformStyle: 'preserve-3d' }}
            >
              <button
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                type="button"
                onClick={() => {
                  const next = isSelected ? null : index;
                  setSelected(next);
                  if (next !== null) onSelect?.(index, item);
                }}
                className={cn(
                  'relative block h-full w-full overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 text-left shadow-2xl transition-all cursor-pointer hover:border-neutral-500'
                )}
                style={
                  {
                    transformOrigin: '50% 100%',
                    transform: `rotateX(${standAngle}deg)`,
                    backfaceVisibility: 'hidden',
                    '--fall': 0,
                  } as React.CSSProperties
                }
              >
                <img
                  src={item.src}
                  alt={item.alt ?? ''}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {item.title && (
                  <span
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-6 text-[10px] sm:text-xs font-semibold text-white truncate"
                    style={{ opacity: 'var(--fall)' }}
                  >
                    {item.title}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
