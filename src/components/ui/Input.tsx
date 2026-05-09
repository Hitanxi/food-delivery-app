/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils.ts';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-[10px] font-black uppercase tracking-widest text-immersive-text-secondary ml-1">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-4 text-sm font-bold text-white transition-all placeholder:text-white/20 focus:border-immersive-accent focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-immersive-accent/10 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden',
            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="ml-1 text-[10px] font-black uppercase tracking-widest text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
