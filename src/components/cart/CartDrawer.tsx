/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button.tsx';
import { CartItem } from '../../types.ts';
import { cn } from '../../lib/utils.ts';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export function CartDrawer({ isOpen, onClose, items, onUpdateQuantity, onRemove }: CartDrawerProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-[#FF6321]" />
                <h2 className="text-xl font-black tracking-tight">Your Cart</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-200" />
                  </div>
                  <h3 className="text-lg font-bold">Your cart is empty</h3>
                  <p className="text-sm text-gray-500">Add some delicious items to get started!</p>
                  <Button onClick={onClose} variant="outline">Browse Restaurants</Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-[#141414]">{item.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-black text-[#FF6321]">${item.price.toFixed(2)}</span>
                        <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white rounded-lg transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                          <button 
                             onClick={() => onUpdateQuantity(item.id, 1)}
                             className="p-1 hover:bg-white rounded-lg transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors self-start"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 bg-[#141414] text-white rounded-t-[40px] space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold text-gray-400 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-400 uppercase tracking-widest">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black pt-4 border-t border-white/10">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Link to="/checkout" onClick={onClose}>
                  <Button className="w-full py-6 text-lg rounded-3xl">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
