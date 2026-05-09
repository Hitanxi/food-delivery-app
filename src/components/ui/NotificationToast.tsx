/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

interface ToastProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function NotificationToast({ isVisible, onClose, title, message }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           initial={{ opacity: 0, x: 100, scale: 0.8 }}
           animate={{ opacity: 1, x: 0, scale: 1 }}
           exit={{ opacity: 0, x: 50, scale: 0.9 }}
           className="fixed top-24 right-6 z-[200] w-full max-w-sm"
        >
          <div className="bg-[#141414] dark:bg-white text-white dark:text-black p-5 rounded-[32px] shadow-2xl flex gap-4 border border-white/10 dark:border-black/5">
             <div className="w-12 h-12 rounded-2xl bg-[#FF6321] flex items-center justify-center shrink-0">
                <Bell className="w-6 h-6 text-white" />
             </div>
             <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                   <h4 className="font-black text-sm uppercase tracking-tighter italic">{title}</h4>
                   <button onClick={onClose} className="p-1 hover:bg-white/10 dark:hover:bg-black/5 rounded-lg">
                      <X className="w-4 h-4" />
                   </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed">{message}</p>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
