/**
 * Button Component
 * 
 * Reusable button with multiple variants and sizes.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-primary hover:bg-primary-600 text-white shadow-primary',
  secondary: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
};

const sizeClasses = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-full',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Icon name="progress_activity" className="animate-spin" size="sm" />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <Icon name={icon} size={size === 'sm' ? 'sm' : 'md'} />
      )}
      
      {children && <span className="truncate">{children}</span>}
      
      {!loading && icon && iconPosition === 'right' && (
        <Icon name={icon} size={size === 'sm' ? 'sm' : 'md'} />
      )}
    </button>
  );
}

export default Button;
