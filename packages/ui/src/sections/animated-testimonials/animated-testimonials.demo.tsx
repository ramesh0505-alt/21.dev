'use client';

import React from 'react';
import { AnimatedTestimonials, Testimonial } from './animated-testimonials';

const sampleTestimonials: Testimonial[] = [
  {
    quote: 'The component quality and physics fidelity exceeded all expectations. We integrated the full component system into our production app in an afternoon.',
    name: 'Sarah Chen',
    designation: 'Product Lead at HyperScale',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
  },
  {
    quote: 'The attention to micro-interactions, responsive states, and local-first workflow makes this the single best developer tool we have adopted this year.',
    name: 'Michael Rodriguez',
    designation: 'VP of Engineering at CraftFlow',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
  },
  {
    quote: 'From discovery to live remixing and code export, the developer experience feels like 21st.dev dialed up to eleven. Absolute craftsmanship.',
    name: 'Emily Watson',
    designation: 'Staff Design Technologist',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
  },
];

export function AnimatedTestimonialsDemo() {
  return (
    <div className="w-full flex items-center justify-center">
      <AnimatedTestimonials testimonials={sampleTestimonials} />
    </div>
  );
}
