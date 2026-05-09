/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star, Clock, Bike } from 'lucide-react';
import { Restaurant } from '../../types.ts';
import { cn } from '../../lib/utils.ts';
import { motion } from 'motion/react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative immersive-card rounded-[32px] overflow-hidden border border-white/5 transition-all hover:border-white/10 hover:shadow-2xl hover:shadow-black/50"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {restaurant.isPromoted && (
          <div className="absolute top-4 left-4 bg-immersive-accent text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-[0_0_15px_#FF6B00]">
            Featured
          </div>
        )}
        <div className="absolute bottom-4 right-4 bg-immersive-glass backdrop-blur-xl text-white px-3 py-1.5 rounded-2xl font-black text-xs border border-white/10 flex items-center gap-1.5 shadow-xl">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          {restaurant.rating}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-white leading-tight">{restaurant.name}</h3>
        </div>
        <p className="text-sm text-immersive-text-secondary mb-4">{restaurant.cuisine.join(', ')}</p>

        <div className="flex items-center gap-4 border-t border-white/5 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-immersive-text-secondary">
            <Clock className="w-4 h-4 text-immersive-accent" />
            {restaurant.deliveryTime[0]}-{restaurant.deliveryTime[1]} min
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-immersive-text-secondary">
            <Bike className="w-4 h-4 text-immersive-accent" />
            {restaurant.deliveryFee === 0 ? 'Free Delivery' : `$${restaurant.deliveryFee} fee`}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
