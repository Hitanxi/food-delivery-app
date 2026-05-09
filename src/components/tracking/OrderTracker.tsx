/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check, Clock, Bike, Package, ChefHat } from 'lucide-react';
import { OrderStatus } from '../../types.ts';
import { cn } from '../../lib/utils.ts';
import { motion } from 'motion/react';

interface OrderTrackerProps {
  status: OrderStatus;
}

export function OrderTracker({ status }: OrderTrackerProps) {
  const steps = [
    { id: 'confirmed', label: 'Confirmed', icon: Check },
    { id: 'preparing', label: 'Preparing', icon: ChefHat },
    { id: 'delivering', label: 'On its way', icon: Bike },
    { id: 'delivered', label: 'Delivered', icon: Package },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === status);

  return (
    <div className="immersive-card p-8 rounded-[40px] border border-white/5 space-y-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-immersive-accent/5 blur-[100px] -z-10 rounded-full" />
      
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tight text-white">Track Order</h3>
            <p className="text-immersive-text-secondary font-black text-[10px] uppercase tracking-widest">Est. Delivery: 12:45 PM</p>
         </div>
         <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
            <Clock className="w-6 h-6 text-immersive-accent" />
         </div>
      </div>

      <div className="relative flex justify-between px-2">
        {/* Progress Line */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-white/5 -z-10">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
             transition={{ duration: 1, ease: 'easeOut' }}
             className="h-full bg-immersive-accent shadow-[0_0_10px_#FF6B00]"
           />
        </div>

        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isActive = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center gap-4">
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border',
                  isCompleted 
                    ? 'bg-immersive-accent text-white border-immersive-accent shadow-[0_0_20px_rgba(255,107,0,0.3)]' 
                    : 'bg-white/5 border-white/5 text-white/20'
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest text-center max-w-[80px]",
                isCompleted ? "text-white" : "text-white/20"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {status === 'delivering' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 p-6 rounded-[32px] flex items-center justify-between border border-white/5"
        >
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl bg-white/5 overflow-hidden border border-white/10">
                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&h=100&q=80" alt="Driver" className="w-full h-full object-cover" />
             </div>
             <div>
                <p className="text-white font-bold">Marcus Smith</p>
                <p className="text-immersive-text-secondary text-[10px] uppercase font-black tracking-widest">Delivery Partner</p>
             </div>
          </div>
          <button className="bg-immersive-accent text-white p-4 rounded-2xl transition-all shadow-[0_8px_20px_rgba(255,107,0,0.2)] hover:scale-105">
             <Bike className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
