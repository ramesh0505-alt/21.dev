'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface FanCardItem {
  id: string;
  src: string;
  title: string;
  description?: string;
}

export interface ImageCardFanProps {
  cards: readonly FanCardItem[];
  activeId?: string;
  cardWidth?: number;
  className?: string;
  defaultActiveId?: string;
  onSelect?: (card: FanCardItem) => void;
}

const HAND_SCALE = 0.72;

function fanTransform(index: number, count: number, spacing: number) {
  const offset = index - (count - 1) / 2;
  const stepDeg = count > 1 ? Math.min(9, 46 / (count - 1)) : 0;
  const rotate = Math.round(offset * stepDeg);

  return {
    rotate,
    x: Math.round(offset * spacing),
    y: Math.round(Math.abs(rotate) * 1.8),
  };
}

export function ImageCardFan({
  cards,
  activeId: controlledActiveId,
  cardWidth = 200,
  className,
  defaultActiveId,
  onSelect,
}: ImageCardFanProps) {
  const shouldReduceMotion = useReducedMotion();
  const fanRef = React.useRef<HTMLDivElement>(null);
  const [fanWidth, setFanWidth] = React.useState<number | null>(null);
  const [internalActiveId, setInternalActiveId] = React.useState(defaultActiveId ?? cards[0]?.id);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const requestedId = controlledActiveId ?? internalActiveId;
  const activeId = cards.some((card) => card.id === requestedId) ? requestedId : cards[0]?.id;
  const activeIndex = cards.findIndex((card) => card.id === activeId);
  const activeCard = cards[activeIndex];

  React.useEffect(() => {
    const node = fanRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setFanWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const width = fanWidth === null ? cardWidth : Math.min(cardWidth, fanWidth * 0.52);
  const height = Math.round(width * 1.38);
  const baseBottom = Math.round(height * 0.08);
  const hoverLift = Math.round(height * 0.28);
  const activeLift = Math.round(height * 0.55);

  const handCards = cards.filter((card) => card.id !== activeId);
  const hoveredIndex = hoveredId ? handCards.findIndex((card) => card.id === hoveredId) : -1;
  const maxOffset = (handCards.length - 1) / 2;
  const fanSpacing = maxOffset > 0 ? Math.min(width * 0.44, 48) : 0;

  const cardTransition = shouldReduceMotion
    ? { duration: 0.16, ease: 'easeOut' as const }
    : {
        damping: 28,
        mass: 0.9,
        stiffness: 320,
        type: 'spring' as const,
      };

  function selectCard(card: FanCardItem) {
    if (card.id === activeId) return;
    setHoveredId(null);
    if (controlledActiveId === undefined) {
      setInternalActiveId(card.id);
    }
    onSelect?.(card);
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8 select-none py-4',
        className
      )}
    >
      {/* Active Card Text Details */}
      <div className="w-full shrink-0 text-center sm:w-44 sm:text-right md:w-52">
        {activeCard && (
          <motion.div
            key={activeCard.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="font-mono text-neutral-400 text-xs">
              {String(activeIndex + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
            </p>
            <h3 className="mt-1 font-bold text-xl sm:text-2xl text-white tracking-tight">
              {activeCard.title}
            </h3>
            {activeCard.description && (
              <p className="mt-2 text-xs text-neutral-400 line-clamp-3">
                {activeCard.description}
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Fan Area */}
      <div
        ref={fanRef}
        className="relative w-full min-w-0 flex-1 flex items-center justify-center"
        style={{ minHeight: height * 1.6 }}
      >
        {cards.map((card) => {
          const isActive = card.id === activeId;
          const handIndex = handCards.findIndex((candidate) => candidate.id === card.id);

          let target: { rotate: number; scale: number; x: number; y: number };
          let zIndex: number;

          if (isActive) {
            target = { rotate: 0, scale: 1, x: 0, y: -activeLift };
            zIndex = 100;
          } else {
            const fan = fanTransform(handIndex, handCards.length, fanSpacing);
            const isHovered = card.id === hoveredId;
            target = {
              rotate: isHovered ? Math.round(fan.rotate * 0.5) : fan.rotate,
              scale: isHovered ? HAND_SCALE * 1.08 : HAND_SCALE,
              x: fan.x,
              y: isHovered ? -hoverLift : fan.y,
            };
            zIndex = isHovered ? 60 : 10 + handIndex;
          }

          return (
            <motion.div
              key={card.id}
              animate={target}
              transition={cardTransition}
              className="absolute left-1/2"
              style={{ bottom: baseBottom, marginLeft: -width / 2, zIndex }}
            >
              <button
                type="button"
                onClick={() => selectCard(card)}
                onMouseEnter={() => !isActive && setHoveredId(card.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  'block overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 shadow-2xl transition-all cursor-pointer hover:border-neutral-500',
                  isActive ? 'ring-2 ring-purple-500/50 shadow-purple-500/20' : ''
                )}
                style={{ width, height }}
              >
                <img src={card.src} alt={card.title} className="h-full w-full object-cover" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

