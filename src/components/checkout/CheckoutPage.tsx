/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CreditCard, MapPin, Clock, ShieldCheck, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { useCart } from '../../contexts/CartContext.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [isPlacing, setIsPlacing] = useState(false);

  const deliveryFee = 2.99;
  const total = totalPrice + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!user) return;

    setIsPlacing(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        restaurantId: 'mock-id',
        restaurantName: 'The Burger Joint',
        items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
        total: total,
        status: 'pending',
        createdAt: serverTimestamp(),
        deliveryAddress: '123 Street Ave, San Francisco, CA'
      });
      
      setStep('success');
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsPlacing(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="pt-32 pb-32 flex flex-col items-center justify-center text-center space-y-8">
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-40 h-40 bg-immersive-accent/10 rounded-[64px] flex items-center justify-center border border-immersive-accent/20 shadow-[0_20px_50px_rgba(255,107,0,0.2)]"
        >
          <div className="w-24 h-24 bg-immersive-accent rounded-[40px] flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">Order Accepted!</h1>
          <p className="text-immersive-text-secondary max-w-sm mx-auto text-sm leading-relaxed">
            Your feast is being prepared. You earned <span className="font-black text-immersive-accent tracking-widest uppercase">+{Math.floor(totalPrice)} points</span>!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link to="/">
            <Button className="px-10 rounded-2xl group py-6">
               Back to Exploration <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/orders">
            <Button variant="secondary" className="px-10 rounded-2xl border-white/5 bg-white/5 py-6">Track Live</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 max-w-6xl mx-auto flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-16 px-6">
      <div className="space-y-12">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter text-white">Checkout</h1>
          <p className="text-xs font-black uppercase tracking-widest text-[#FF6B00]">Finalize your cravings</p>
        </div>

        <div className="space-y-10">
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-1">Delivery Address</h3>
            <div className="p-8 immersive-card rounded-[40px] border border-white/5 flex items-center justify-between group cursor-pointer hover:border-immersive-accent/30 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-immersive-accent/5 blur-[50px] -z-10 rounded-full" />
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <MapPin className="w-6 h-6 text-immersive-accent" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Home Sanctuary</p>
                  <p className="text-sm text-immersive-text-secondary">123 Street Ave, San Francisco, CA</p>
                </div>
              </div>
              <button className="text-immersive-accent text-[10px] font-black uppercase tracking-widest bg-immersive-accent/10 px-4 py-2 rounded-xl border border-immersive-accent/20 hover:bg-immersive-accent hover:text-white transition-all shadow-[0_0_15px_rgba(255,107,0,0.1)]">Change</button>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-1">Payment Engine</h3>
            <div className="p-8 immersive-card rounded-[40px] border border-white/5 flex items-center justify-between group cursor-pointer hover:border-immersive-accent/30 transition-all relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] -z-10 rounded-full" />
               <div className="flex items-center gap-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <CreditCard className="w-6 h-6 text-immersive-accent" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Visa Prestige •••• 4242</p>
                  <p className="text-sm text-immersive-text-secondary">Expires 12/26</p>
                </div>
              </div>
              <button className="text-immersive-accent text-[10px] font-black uppercase tracking-widest bg-immersive-accent/10 px-4 py-2 rounded-xl border border-immersive-accent/20 hover:bg-immersive-accent hover:text-white transition-all shadow-[0_0_15px_rgba(255,107,0,0.1)]">Edit</button>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-1">Logistics</h3>
            <div className="p-8 immersive-card rounded-[40px] border border-white/5 flex items-center gap-6 relative overflow-hidden">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <Clock className="w-6 h-6 text-immersive-accent" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">Estimated Arrival: 25-30 mins</p>
                <p className="text-sm text-immersive-text-secondary">Express delivery active for this zone</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="relative">
        <div className="immersive-card rounded-[48px] border border-white/10 p-10 space-y-10 sticky top-32 bg-gradient-to-br from-white/10 to-transparent shadow-2xl backdrop-blur-3xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-immersive-accent/5 blur-[100px] -z-10" />
          
          <h3 className="text-2xl font-black tracking-tight text-white">Order Summary</h3>
          <div className="space-y-6 max-h-[240px] overflow-y-auto no-scrollbar pr-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm group">
                <div className="flex gap-4">
                  <span className="text-immersive-accent font-black tracking-widest text-[10px] bg-immersive-accent/10 w-6 h-6 rounded-lg flex items-center justify-center border border-immersive-accent/20">{item.quantity}x</span>
                  <span className="font-bold text-white group-hover:text-immersive-accent transition-colors">{item.name}</span>
                </div>
                <span className="font-mono font-black text-white/60">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-8 border-t border-white/10">
            <div className="flex justify-between text-[11px] font-black text-white/20 uppercase tracking-[0.2em]">
              <span>Subtotal</span>
              <span className="text-white/60 font-mono">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] font-black text-white/20 uppercase tracking-[0.2em]">
              <span>Delivery Fee</span>
              <span className="text-white/60 font-mono">${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-4xl font-black pt-6 text-white leading-none">
              <span className="tracking-tighter">Total</span>
              <span className="text-immersive-accent tracking-tighter">${total.toFixed(2)}</span>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={handlePlaceOrder} 
              disabled={isPlacing} 
              className="w-full py-8 text-xl rounded-2xl shadow-[0_15px_40px_rgba(255,107,0,0.3)] font-black tracking-tighter" 
              size="lg"
            >
              {isPlacing ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Securing...
                </div>
              ) : 'Confirm and Pay'}
            </Button>
          </motion.div>

          <div className="flex items-center justify-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-widest bg-black/20 py-3 rounded-2xl border border-white/5">
             <ShieldCheck className="w-4 h-4 text-green-500" />
             Verified Safe Checkout
          </div>
        </div>
      </div>
    </div>
  );
}
