import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AnimatedButton } from './animated-button';

describe('AnimatedButton', () => {
  it('renders button with children', () => {
    render(<AnimatedButton>Click Me</AnimatedButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeDefined();
  });

  it('handles disabled state', () => {
    render(<AnimatedButton disabled>Disabled Action</AnimatedButton>);
    const button = screen.getByRole('button', { name: /disabled action/i });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });
});

