/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Twitter, Facebook, Link as LinkIcon, MessageCircle, X } from 'lucide-react';
import { Button } from './Button.tsx';
import { motion, AnimatePresence } from 'motion/react';

interface SocialShareProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export function SocialShare({ isOpen, onClose, url, title }: SocialShareProps) {
  const shareLinks = [
    { 
      name: 'Twitter', 
      icon: Twitter, 
      color: 'text-[#1DA1F2]', 
      bg: 'bg-[#1DA1F2]/10',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'text-[#1877F2]', 
      bg: 'bg-[#1877F2]/10',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    { 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      color: 'text-[#25D366]', 
      bg: 'bg-[#25D366]/10',
      href: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`
    },
    { 
      name: 'Copy Link', 
      icon: LinkIcon, 
      color: 'text-white/60', 
      bg: 'bg-white/5',
      action: () => {
        navigator.clipboard.writeText(url);
      }
    },
  ];

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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto immersive-glass border-t border-white/10 rounded-t-[64px] p-12 z-[501] space-y-12"
          >
            <div className="flex justify-center -mt-6">
               <div className="w-12 h-1.5 bg-white/10 rounded-full" />
            </div>

            <div className="text-center space-y-3">
               <h3 className="text-3xl font-black tracking-tight text-white">Share your taste</h3>
               <p className="text-immersive-text-secondary font-black text-xs uppercase tracking-widest leading-relaxed max-w-xs mx-auto">Spread the joy of <span className="text-white italic">{title}</span> with your favorites</p>
            </div>

            <div className="grid grid-cols-4 gap-6 max-w-md mx-auto">
              {shareLinks.map((link) => (
                <button
                  key={link.name}
                  className="flex flex-col items-center gap-4 group transition-all"
                  onClick={() => {
                    if (link.action) {
                      link.action();
                    } else if (link.href) {
                      window.open(link.href, '_blank', 'noreferrer');
                    }
                    onClose();
                  }}
                >
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[32px] ${link.bg} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 border border-white/5 group-hover:border-white/20 shadow-2xl relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <link.icon className={`w-8 h-8 ${link.color}`} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{link.name}</span>
                </button>
              ))}
            </div>

            <div className="pt-4">
              <Button onClick={onClose} variant="secondary" className="w-full py-7 rounded-3xl font-black uppercase tracking-widest bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <X className="w-4 h-4" />
                Cancel Sharing
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
