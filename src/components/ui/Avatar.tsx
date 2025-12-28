/**
 * Avatar Component
 * 
 * User avatar with fallback initials.
 */

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const statusSizeClasses = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-4 w-4',
};

export function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className,
  showOnlineStatus = false,
  isOnline = false,
}: AvatarProps) {
  // Generate initials from name
  const initials = name
    ? name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  // Generate a consistent color based on name
  const getColorFromName = (name: string): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <div className="relative inline-flex">
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center',
          'border-2 border-white dark:border-gray-800 shadow-sm',
          !src && (name ? getColorFromName(name) : 'bg-gray-400'),
          sizeClasses[size],
          className
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes={`${parseInt(sizeClasses[size].split(' ')[0].replace('h-', '')) * 4}px`}
          />
        ) : (
          <span className="font-medium text-white">{initials}</span>
        )}
      </div>
      
      {showOnlineStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-800',
            statusSizeClasses[size],
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  );
}

export default Avatar;
