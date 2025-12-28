/**
 * Badge/Chip Component
 * 
 * Small label for tags, status indicators, and filters.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  icon?: string;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const variantClasses = {
  default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  primary: 'bg-primary/10 text-primary border-primary/20',
  success: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  warning: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  error: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  removable = false,
  onRemove,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium border',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon && <Icon name={icon} size="sm" />}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity"
        >
          <Icon name="close" size="sm" />
        </button>
      )}
    </span>
  );
}

export default Badge;
