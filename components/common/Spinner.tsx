
import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-24 h-24',
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Loader2 
        className={`animate-spin text-sky-500 opacity-80 ${sizeClasses[size]}`} 
        strokeWidth={1}
      />
      <div className={`absolute inset-0 m-auto rounded-full border border-sky-500/20 animate-ping ${sizeClasses[size]}`}></div>
      {size === 'large' && (
        <RefreshCw className="absolute inset-0 m-auto text-sky-400/30 w-12 h-12 animate-spin-slow" />
      )}
    </div>
  );
};
