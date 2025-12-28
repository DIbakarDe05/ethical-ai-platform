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
        'transition-all duration-200',
        hover && 'hover:border-primary/50 hover:shadow-soft cursor-pointer',
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
