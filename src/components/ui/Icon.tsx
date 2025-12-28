/**
 * Icon Component
 * 
 * Wrapper for Material Symbols Outlined icons with customizable styling.
 * Uses Google Material Symbols font loaded in layout.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface IconProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  filled?: boolean;
}

const sizeClasses = {
  sm: 'text-[16px]',
  md: 'text-[20px]',
  lg: 'text-[24px]',
  xl: 'text-[32px]',
  '2xl': 'text-[48px]',
};

export function Icon({ name, className, size = 'lg', filled = false }: IconProps) {
  return (
    <span
      className={cn(
        'material-symbols-outlined select-none',
        sizeClasses[size],
        className
      )}
      style={{
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
      }}
    >
      {name}
    </span>
  );
}

export default Icon;
