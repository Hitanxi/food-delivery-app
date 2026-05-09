/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils.ts';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { rating: number; comment: string }) => void;
  restaurantName: string;
}

export function ReviewForm({ isOpen, onClose, onSubmit, restaurantName }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      onSubmit({ rating, comment });
      setIsSubmitting(false);
      setRating(0);
      setComment('');
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[500]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-lg h-fit immersive-card border border-white/10 rounded-[48px] p-10 z-[501] space-y-8 overflow-hidden shadow-2xl shadow-immersive-accent/10"
          >
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <h3 className="text-3xl font-black tracking-tight text-white">Rate your feast</h3>
                  <p className="text-immersive-text-secondary text-xs font-black uppercase tracking-widest">{restaurantName}</p>
               </div>
               <button 
                 onClick={onClose}
                 className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors border border-white/5"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-1">How many stars?</label>
                  <div className="flex items-center gap-3 justify-center py-6 bg-white/5 rounded-3xl border border-white/5">
                     {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onMouseEnter={() => setHoveredRating(s)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setRating(s)}
                          className="relative p-2 transition-all hover:scale-125 focus:outline-none group"
                          aria-label={`Rate ${s} out of 5 stars`}
                        >
                           <Star 
                             className={cn(
                               "w-10 h-10 transition-all duration-300",
                               (hoveredRating || rating) >= s 
                                 ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" 
                                 : "text-white/10 fill-transparent group-hover:text-white/20"
                             )} 
                           />
                           {rating === s && (
                             <motion.div 
                               layoutId="active-star"
                               className="absolute inset-0 bg-yellow-400/5 blur-xl rounded-full -z-10"
                             />
                           )}
                        </button>
                     ))}
                  </div>
                  {rating > 0 && (
                     <motion.p 
                       initial={{ opacity: 0, y: 5 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="text-center text-sm font-bold text-yellow-400"
                     >
                        {rating === 5 ? 'Legendary! 🔥' : 
                         rating === 4 ? 'Great stuff! 👌' : 
                         rating === 3 ? 'Alright, not bad. 👍' : 
                         rating === 2 ? 'Could be better. 😕' : 'Disappointing. ☹️'}
                     </motion.p>
                  )}
               </div>

               <div className="space-y-4">
                  <label htmlFor="comment" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-1">Tell us more</label>
                  <textarea
                    id="comment"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you love (or not so much) about your meal?"
                    className="w-full bg-white/5 border border-white/5 rounded-[32px] p-6 text-sm text-white placeholder:text-white/20 min-h-[160px] focus:outline-none focus:border-immersive-accent/50 focus:bg-white/10 transition-all resize-none"
                  />
               </div>

               <Button 
                 type="submit" 
                 disabled={rating === 0 || isSubmitting}
                 className="w-full py-6 rounded-[24px] shadow-[0_15px_40px_rgba(255,107,0,0.3)] font-black tracking-tighter text-lg flex items-center justify-center gap-3"
               >
                 {isSubmitting ? (
                   <>
                     <motion.div 
                       animate={{ rotate: 360 }}
                       transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                       className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                     />
                     Posting...
                   </>
                 ) : (
                   <>
                     <Send className="w-5 h-5" />
                     Post My Review
                   </>
                 )}
               </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
