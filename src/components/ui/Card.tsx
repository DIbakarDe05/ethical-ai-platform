/**
 * Card Component
 * 
 * Flexible card component for content containers.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({ 
  children, 
  className, 
  hover = false, 
  padding = 'md',
  onClick 
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-surface-dark rounded-xl shadow-card',
        'border border-gray-100 dark:border-gray-700',
        'transition-all duration-300 ease-out',
        hover && [
          'cursor-pointer',
          // Translucent glassmorphism effect on hover
          'hover:bg-white/90 dark:hover:bg-surface-dark/80',
          'hover:backdrop-blur-sm',
          // Glowing border effect
          'hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20',
          // Subtle scale transform
          'hover:scale-[1.02] hover:-translate-y-1',
          // Ring glow effect
          'hover:ring-1 hover:ring-primary/20',
        ],
        paddingClasses[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Card Header sub-component
Card.Header = function CardHeader({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
};

// Card Title sub-component
Card.Title = function CardTitle({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <h3 className={cn('text-lg font-bold text-gray-900 dark:text-white', className)}>
      {children}
    </h3>
  );
};

// Card Content sub-component
Card.Content = function CardContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn('text-gray-600 dark:text-gray-300', className)}>
      {children}
    </div>
  );
};

// Card Footer sub-component
Card.Footer = function CardFooter({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-100 dark:border-gray-700', className)}>
      {children}
    </div>
  );
};

export default Card;
