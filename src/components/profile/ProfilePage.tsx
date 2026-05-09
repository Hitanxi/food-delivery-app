/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Camera, MapPin, CreditCard, Settings, LogOut, ChevronRight, Star, Award, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { Card } from '../ui/Card.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils.ts';
import React from 'react';
import { FOOD_GALLERY } from '../../constants.ts';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ displayName: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfileData(data);
        setFormData({ displayName: data.displayName || '', bio: data.bio || '' });
      } else {
        setProfileData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: formData.displayName,
        bio: formData.bio,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-immersive-accent" />
      </div>
    );
  }

  if (!user || !profileData) {
    return (
      <div className="pt-32 text-center space-y-6 px-6">
        <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto border border-white/5">
          <Award className="w-12 h-12 text-white/10" />
        </div>
        <h1 className="text-3xl font-black text-white">Join Gusto</h1>
        <p className="text-immersive-text-secondary max-w-xs mx-auto">Sign in to track orders, save favorites, and earn loyalty points!</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 max-w-4xl mx-auto px-6 space-y-12">
      {/* Hero Profile Section */}
      <section className="relative">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[56px] overflow-hidden border-8 border-immersive-bg shadow-2xl shadow-black/50">
              <img src={user.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`} alt={profileData.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <button className="absolute bottom-2 right-2 bg-immersive-accent text-white p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,107,0,0.3)]">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2 pb-2">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h1 className="text-4xl font-black tracking-tight text-white">{profileData.displayName}</h1>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400 text-black rounded-full font-black text-[10px] uppercase tracking-widest self-center md:self-auto shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                 <Star className="w-3.5 h-3.5 fill-black" />
                 Gold Member
              </div>
            </div>
            <p className="text-immersive-text-secondary font-medium max-w-md">{profileData.bio || 'Your bio here. Tell us what you love to eat!'}</p>
          </div>

          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            <Button variant="ghost" size="icon" className="rounded-2xl" onClick={logout}>
              <LogOut className="w-5 h-5 text-red-500" />
            </Button>
          </div>
        </div>
      </section>

      {/* Rewards Card */}
      <section>
        <Card className="immersive-card p-8 overflow-hidden relative border border-white/5">
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-start">
               <div>
                 <p className="text-xs font-black uppercase tracking-widest text-immersive-accent">Loyalty Balance</p>
                 <h2 className="text-6xl font-black tracking-tighter mt-2 text-white">{profileData.loyaltyPoints} <span className="text-2xl text-white/40 tracking-tight">pts</span></h2>
               </div>
               <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[32px] flex items-center justify-center border border-white/10">
                 <Award className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]" />
               </div>
            </div>
            
            <div className="space-y-4">
               <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min((profileData.loyaltyPoints / 1000) * 100, 100)}%` }}
                   className="h-full bg-immersive-accent shadow-[0_0_10px_#FF6B00]"
                 />
               </div>
               <p className="text-xs font-bold text-white/40">{1000 - (profileData.loyaltyPoints % 1000)} pts until your next $10 reward!</p>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-immersive-accent/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        </Card>
      </section>

      {/* Food Gallery Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-white">Food Memories</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-immersive-text-secondary">Your shared culinary journey</p>
          </div>
          <Button variant="ghost" size="sm" className="text-immersive-accent font-black tracking-widest uppercase text-[10px]">
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {FOOD_GALLERY.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="aspect-square rounded-[32px] overflow-hidden border border-white/5 group relative"
            >
              <img 
                src={img} 
                alt={`Food memory ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-white">Favorite</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Settings Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#FF6B00] px-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
            Account
          </h3>
          <div className="space-y-2">
            {[
              { icon: CreditCard, label: 'Payment Methods', sub: 'Mastercard •••• 4242' },
              { icon: MapPin, label: 'My Addresses', sub: 'Home, Office' },
              { icon: Settings, label: 'Settings', sub: 'Preferences, Privacy' },
            ].map((item) => (
              <button key={item.label} className="w-full flex items-center justify-between p-6 immersive-card rounded-[32px] border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-immersive-accent/10 transition-colors border border-white/5">
                    <item.icon className="w-5 h-5 text-white/40 group-hover:text-immersive-accent" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white">{item.label}</p>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.sub}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/10 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-immersive-text-secondary px-2">Trust & Support</h3>
          <div className="space-y-2">
            {[
              { icon: ShieldCheck, label: 'Security & Privacy', sub: 'Two-factor auth' },
              { icon: Award, label: 'Join Gourmet Club', sub: 'Exclusive benefits' },
            ].map((item) => (
              <button key={item.label} className="w-full flex items-center justify-between p-6 immersive-card rounded-[32px] border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-immersive-accent/10 transition-colors border border-white/5">
                    <item.icon className="w-5 h-5 text-white/40 group-hover:text-immersive-accent" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white">{item.label}</p>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.sub}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/10 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 max-w-lg mx-auto immersive-glass border border-white/10 rounded-[48px] p-10 z-[111] space-y-8 shadow-2xl"
            >
              <h3 className="text-2xl font-black tracking-tight text-white">Edit Profile</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                 <Input 
                   label="Display Name" 
                   value={formData.displayName} 
                   onChange={e => setFormData({ ...formData, displayName: e.target.value })} 
                   required
                 />
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-immersive-text-secondary px-1">Bio</label>
                   <textarea 
                     className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 text-sm font-bold text-white focus:outline-none focus:border-immersive-accent transition-all min-h-[120px] placeholder:text-white/20"
                     value={formData.bio}
                     onChange={e => setFormData({ ...formData, bio: e.target.value })}
                     placeholder="Tell us about yourself..."
                   />
                 </div>
                 <div className="flex gap-4 pt-4">
                   <Button variant="secondary" className="flex-1" onClick={() => setIsEditing(false)}>Cancel</Button>
                   <Button className="flex-1" type="submit" disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                   </Button>
                 </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
