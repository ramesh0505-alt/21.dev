'use client';

import React from 'react';
import {
  Pyramid,
  Castle,
  Mountain,
  TowerControl,
  Building,
} from 'lucide-react';
import { ExpandingCards, CardItem } from './expanding-cards';

const architecturalWonders: CardItem[] = [
  {
    id: 'pyramids-giza',
    title: 'Pyramids of Giza',
    description: 'The monumental ancient stone tombs that have stood for over 4,500 years.',
    imgSrc: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=800&auto=format&fit=crop',
    icon: <Pyramid className="h-5 w-5" />,
  },
  {
    id: 'great-wall',
    title: 'Great Wall of China',
    description: 'A vast series of fortifications stretching thousands of miles across mountains.',
    imgSrc: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800&auto=format&fit=crop',
    icon: <Castle className="h-5 w-5" />,
  },
  {
    id: 'machu-picchu',
    title: 'Machu Picchu',
    description: 'An Incan citadel set high in the Andes Mountains with stone masonry.',
    imgSrc: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800&auto=format&fit=crop',
    icon: <Mountain className="h-5 w-5" />,
  },
  {
    id: 'eiffel-tower',
    title: 'Eiffel Tower',
    description: 'Iconic wrought-iron lattice tower on the Champ de Mars in Paris.',
    imgSrc: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=800&auto=format&fit=crop',
    icon: <TowerControl className="h-5 w-5" />,
  },
  {
    id: 'burj-khalifa',
    title: 'Burj Khalifa',
    description: 'The world tallest skyscraper piercing the clouds at 828 meters.',
    imgSrc: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
    icon: <Building className="h-5 w-5" />,
  },
];

export function ExpandingCardsDemo() {
  return (
    <div className="w-full flex items-center justify-center p-2">
      <ExpandingCards items={architecturalWonders} defaultActiveIndex={0} />
    </div>
  );
}
