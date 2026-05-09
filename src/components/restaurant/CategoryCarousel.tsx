/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CATEGORIES } from '../../constants.ts';
import { cn } from '../../lib/utils.ts';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

interface CategoryCarouselProps {
  activeCategory: string;
  onSelect: (id: string) => void;
}

export function CategoryCarousel({ activeCategory, onSelect }: CategoryCarouselProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
      {CATEGORIES.map((cat) => {
        const Icon = (Icons as any)[cat.icon];
        return (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(cat.id)}
            className={cn(
              'flex flex-col items-center gap-3 px-6 py-6 min-w-[100px] rounded-[32px] transition-all border relative group',
              activeCategory === cat.id
                ? 'bg-immersive-accent border-white/20 text-white shadow-[0_0_25px_rgba(255,107,0,0.3)]'
                : 'immersive-card border-white/5 text-immersive-text-secondary hover:border-white/10 hover:text-white'
            )}
          >
            <div className={cn(
              "p-3 rounded-2xl transition-colors duration-300",
              activeCategory === cat.id ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"
            )}>
              {Icon && <Icon className="w-6 h-6" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
            {activeCategory === cat.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute inset-0 rounded-[32px] border-2 border-white/30 pointer-events-none"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
