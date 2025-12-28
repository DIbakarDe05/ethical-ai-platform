/**
 * Input Component
 * 
 * Styled input field with icon support and validation states.
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, iconPosition = 'left', helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon 
                name={icon} 
                size="md" 
                className={cn(
                  'text-gray-400 dark:text-gray-500',
                  error && 'text-red-500'
                )} 
              />
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              'input-field',
              icon && iconPosition === 'left' && 'pl-11',
              icon && iconPosition === 'right' && 'pr-11',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Icon 
                name={icon} 
                size="md" 
                className="text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600" 
              />
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <Icon name="error" size="sm" />
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
