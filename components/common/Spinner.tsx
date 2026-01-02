
import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <Loader2 
      className={`animate-spin text-sky-400 ${sizeClasses[size]} ${className}`} 
    />
  );
};
