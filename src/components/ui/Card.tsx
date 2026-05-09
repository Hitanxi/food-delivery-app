/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils.ts';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[32px] immersive-card border border-white/5 transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-black/50',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export { Card };
