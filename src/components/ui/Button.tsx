/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils.ts';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-immersive-accent text-white shadow-[0_0_20px_rgba(255,107,0,0.2)] hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] border border-white/10 active:scale-95',
      secondary: 'bg-white/5 text-white hover:bg-white/10 border border-white/5 backdrop-blur-md active:scale-95',
      ghost: 'bg-transparent text-immersive-text-secondary hover:text-white hover:bg-white/5 active:scale-95 text-sm font-bold',
      outline: 'bg-transparent border-2 border-white/10 text-white hover:bg-white/5 hover:border-white/20 active:scale-95',
      danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 active:scale-95',
    };

    const sizes = {
      sm: 'px-4 py-2 text-[10px] font-black uppercase tracking-widest',
      md: 'px-6 py-3 text-sm font-bold',
      lg: 'px-8 py-4 text-base font-black',
      icon: 'p-3 rounded-2xl',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : null}
        <span className={cn('flex items-center gap-2', isLoading && 'opacity-0')}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
