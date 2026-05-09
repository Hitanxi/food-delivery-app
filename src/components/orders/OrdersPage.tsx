/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { OrderTracker } from '../tracking/OrderTracker.tsx';
import { MOCK_RESTAURANTS } from '../../constants.ts';
import { Button } from '../ui/Button.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';
import { ShoppingBag, ChevronRight, Loader2, Calendar, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils.ts';
import { subDays, isAfter, startOfDay } from 'date-fns';

type DateRange = 'all' | '7days' | '30days' | '90days';
type StatusFilter = 'all' | 'delivered' | 'cancelled';

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateRange, setDateRange] = useState<DateRange>('all');

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const activeOrder = useMemo(() => 
    orders.find(o => ['pending', 'confirmed', 'preparing', 'delivering'].includes(o.status)),
    [orders]
  );

  const filteredPastOrders = useMemo(() => {
    let past = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

    // Apply Status Filter
    if (statusFilter !== 'all') {
      past = past.filter(o => o.status === statusFilter);
    }

    // Apply Date Range Filter
    if (dateRange !== 'all') {
      const now = new Date();
      let cutOffDate: Date;
      
      switch (dateRange) {
        case '7days': cutOffDate = subDays(startOfDay(now), 7); break;
        case '30days': cutOffDate = subDays(startOfDay(now), 30); break;
        case '90days': cutOffDate = subDays(startOfDay(now), 90); break;
        default: cutOffDate = new Date(0);
      }

      past = past.filter(o => {
        const orderDate = o.createdAt?.seconds 
          ? new Date(o.createdAt.seconds * 1000) 
          : new Date(o.createdAt);
        return isAfter(orderDate, cutOffDate);
      });
    }

    return past;
  }, [orders, statusFilter, dateRange]);

  const resetFilters = () => {
    setStatusFilter('all');
    setDateRange('all');
  };

  if (loading) {
    return (
      <div className="pt-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-immersive-accent" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 max-w-4xl mx-auto space-y-12 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Orders</h1>
          <p className="text-xs font-black uppercase tracking-widest text-immersive-text-secondary">Keep track of your cravings</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" className="rounded-2xl">Help Center</Button>
        </div>
      </div>

      {!user ? (
        <div className="py-20 text-center space-y-4 immersive-card rounded-[48px] border border-white/5">
           <ShoppingBag className="w-16 h-16 text-white/10 mx-auto" />
           <h3 className="text-xl font-bold text-white">Please sign in</h3>
           <p className="text-immersive-text-secondary max-w-xs mx-auto">You need to be logged in to view your order history.</p>
        </div>
      ) : (
        <>
          {activeOrder && (
            <section className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-immersive-accent flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-immersive-accent shadow-[0_0_8px_#FF6B00] animate-pulse" />
                Active Order
              </h2>
              <div className="space-y-8">
                <div className="flex items-center gap-4 p-6 immersive-glass rounded-[32px] border border-white/5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/5">
                    <img src={MOCK_RESTAURANTS.find(r => r.name === activeOrder.restaurantName)?.imageUrl || MOCK_RESTAURANTS[0].imageUrl} alt={activeOrder.restaurantName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">{activeOrder.restaurantName}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-immersive-text-secondary">{activeOrder.items?.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-white text-xl">${activeOrder.total?.toFixed(2)}</p>
                    <div className="inline-block px-3 py-1 bg-immersive-accent/10 rounded-full">
                      <p className="text-[10px] font-black uppercase tracking-widest text-immersive-accent">{activeOrder.status}</p>
                    </div>
                  </div>
                </div>
                
                <OrderTracker status={activeOrder.status} />
              </div>
            </section>
          )}

          <section className="space-y-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-immersive-text-secondary">Order History</h2>
                {(statusFilter !== 'all' || dateRange !== 'all') && (
                  <button 
                    onClick={resetFilters}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-immersive-accent hover:opacity-80 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                    Reset Filters
                  </button>
                )}
              </div>

              {/* Filters UI */}
              <div className="flex flex-col sm:flex-row gap-6 p-6 immersive-card rounded-[32px] border border-white/5">
                <div className="space-y-3 flex-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-immersive-text-secondary flex items-center gap-2">
                    <Filter className="w-3 h-3" />
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'delivered', label: 'Delivered' },
                      { id: 'cancelled', label: 'Cancelled' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStatusFilter(s.id as StatusFilter)}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                          statusFilter === s.id
                            ? "bg-immersive-accent text-white border-white/20 shadow-[0_0_15px_rgba(255,107,0,0.2)]"
                            : "bg-white/5 border-white/5 text-immersive-text-secondary hover:border-white/10 hover:text-white"
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-px bg-white/5 hidden sm:block" />

                <div className="space-y-3 flex-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-immersive-text-secondary flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    Date Range
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'Anytime' },
                      { id: '7days', label: 'Last 7 Days' },
                      { id: '30days', label: 'Last 30 Days' },
                      { id: '90days', label: 'Last 90 Days' }
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDateRange(d.id as DateRange)}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                          dateRange === d.id
                            ? "bg-white/10 text-white border-immersive-accent shadow-[0_0_15px_rgba(255,107,0,0.1)]"
                            : "bg-white/5 border-white/5 text-immersive-text-secondary hover:border-white/10 hover:text-white"
                        )}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPastOrders.length === 0 ? (
                <div className="py-20 text-center space-y-4 immersive-card rounded-[40px] border border-white/5">
                  <div className="w-16 h-16 bg-white/5 mx-auto rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-white/5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">No orders found</h3>
                    <p className="text-immersive-text-secondary text-xs max-w-[200px] mx-auto mt-1">Try adjusting your filters to see more results.</p>
                  </div>
                </div>
              ) : (
                filteredPastOrders.map((order) => (
                  <div key={order.id} className="p-6 immersive-glass rounded-[32px] border border-white/5 flex items-center justify-between group hover:border-immersive-accent/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/5 shadow-2xl transition-transform group-hover:scale-105">
                        <img src={MOCK_RESTAURANTS.find(r => r.name === order.restaurantName)?.imageUrl || MOCK_RESTAURANTS[0].imageUrl} alt={order.restaurantName} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg group-hover:text-immersive-accent transition-colors">{order.restaurantName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] font-black text-immersive-text-secondary uppercase tracking-widest">
                            {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                          </p>
                          <div className="w-1 h-1 rounded-full bg-white/10" />
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{order.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="font-black text-white text-xl leading-none mb-1">${order.total?.toFixed(2)}</p>
                        <p className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          order.status === 'delivered' ? "text-green-500" : "text-white/20"
                        )}>{order.status}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-immersive-accent transition-all">
                        <ChevronRight className="w-5 h-5 text-immersive-text-secondary group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
