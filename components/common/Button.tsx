
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-orbitron font-bold transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group overflow-hidden";

  const variantStyles = {
    primary: `
      bg-sky-600/10 text-sky-100 border border-sky-500/50 uppercase tracking-[0.1em]
      hover:bg-sky-500 hover:text-white hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]
      active:scale-95
    `,
    secondary: `
      bg-indigo-600/10 text-indigo-100 border border-indigo-500/50 uppercase tracking-[0.1em]
      hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]
      active:scale-95
    `,
    outline: `
      bg-transparent border border-slate-700 text-slate-400 uppercase tracking-[0.05em]
      hover:bg-slate-700/30 hover:border-sky-500/50 hover:text-sky-300
      active:scale-95
    `,
    danger: `
      bg-red-600/10 text-red-100 border border-red-500/50 uppercase tracking-[0.1em]
      hover:bg-red-500 hover:text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]
      active:scale-95
    `,
    ghost: `
      bg-transparent text-slate-500 hover:text-sky-400 hover:bg-sky-500/5
    `
  };

  const sizeStyles = {
    small: "px-4 py-2 text-[11px] rounded-lg",
    medium: "px-6 py-3 text-xs rounded-xl",
    large: "px-10 py-4.5 text-sm rounded-2xl",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      <div className="btn-glow absolute inset-0 bg-current opacity-0 blur-xl transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Energy Fill Animation */}
      <span className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>

      <span className="relative z-10 flex items-center justify-center w-full">
        {children}
      </span>

      {/* Futuristic Corner Brackets */}
      <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-40"></span>
      <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-current opacity-40"></span>
      <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-current opacity-40"></span>
      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current opacity-40"></span>
    </button>
  );
};
