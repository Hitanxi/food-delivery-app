/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar.tsx';
import { useState, useRef, useMemo, useEffect, FormEvent } from 'react';
import { CategoryCarousel } from './components/restaurant/CategoryCarousel.tsx';
import { RestaurantCard } from './components/restaurant/RestaurantCard.tsx';
import { Button } from './components/ui/Button.tsx';
import { Search, MapPin, Bell, ShoppingBag, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Store, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartProvider, useCart } from './contexts/CartContext.tsx';
import { ThemeProvider, useTheme } from './contexts/ThemeContext.tsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { RestaurantPage } from './components/restaurant/RestaurantPage.tsx';
import { CartDrawer } from './components/cart/CartDrawer.tsx';
import { ProfilePage } from './components/profile/ProfilePage.tsx';
import { SearchPage } from './components/search/SearchPage.tsx';
import { CheckoutPage } from './components/checkout/CheckoutPage.tsx';
import { OrdersPage } from './components/orders/OrdersPage.tsx';
import { NotificationToast } from './components/ui/NotificationToast.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { getSuggestions, Suggestion } from './services/searchService.ts';
import { COLLECTIONS, MOCK_RESTAURANTS } from './constants.ts';
import { db } from './lib/firebase.ts';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'; 

function Header() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => getSuggestions(query), [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (s: Suggestion) => {
    if (s.type === 'restaurant') {
      navigate(`/restaurant/${s.id}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(s.name)}`);
    }
    setShowSuggestions(false);
    setQuery('');
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="pt-24 pb-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-immersive-text-secondary font-bold text-sm">
            <MapPin className="w-4 h-4 text-immersive-accent" />
            San Francisco, CA
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
            Choose your <span className="text-immersive-accent">favourite</span> food
          </h1>
        </div>
        <div className="flex items-center gap-4">
           <Button variant="secondary" size="icon">
             <Bell className="w-5 h-5" />
           </Button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative group" ref={searchRef}>
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-immersive-text-secondary group-focus-within:text-immersive-accent transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search for restaurants, dishes..."
          value={query}
          onFocus={() => setShowSuggestions(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 pl-16 pr-6 text-base font-bold text-white placeholder:text-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-immersive-accent/10 focus:border-immersive-accent/50 focus:bg-white/10"
        />

        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 immersive-glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl"
            >
              <div className="p-2">
                {suggestions.map((s, idx) => (
                  <button
                    key={`${s.type}-${s.id}-${idx}`}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/5 rounded-xl group-hover:bg-immersive-accent/10 transition-colors">
                        {s.type === 'restaurant' ? (
                          <Store className="w-4 h-4 text-white/40 group-hover:text-immersive-accent" />
                        ) : (
                          <Utensils className="w-4 h-4 text-white/40 group-hover:text-immersive-accent" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{s.name}</p>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{s.sub}</p>
                      </div>
                    </div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest px-2 py-1 rounded bg-black/20 group-hover:bg-immersive-accent/10 group-hover:text-immersive-accent transition-colors">
                      {s.type}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}

function PromotedCarousel() {
  const promoted = MOCK_RESTAURANTS.filter(r => r.isPromoted);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-immersive-accent/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-immersive-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white leading-none">Promoted</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-immersive-text-secondary mt-1">Featured partners</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon" className="w-10 h-10 rounded-xl" onClick={() => scroll('left')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="secondary" size="icon" className="w-10 h-10 rounded-xl" onClick={() => scroll('right')}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
      >
        {promoted.map((restaurant) => (
          <div key={restaurant.id} className="min-w-[320px] md:min-w-[400px] snap-center">
            <Link to={`/restaurant/${restaurant.id}`}>
              <RestaurantCard restaurant={restaurant} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function CollectionsSection() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-white">Collections</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-immersive-text-secondary">Curated lists of top spots</p>
        </div>
        <Button variant="ghost" size="sm" className="text-immersive-accent font-black tracking-widest uppercase text-[10px] flex items-center gap-2">
          Explore all <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
      <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2">
        {COLLECTIONS.map((col) => (
          <div key={col.id} className="min-w-[280px] h-[360px] relative rounded-[40px] overflow-hidden group cursor-pointer flex-shrink-0">
            <img src={col.imageUrl} alt={col.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-10 left-8 right-8 space-y-2">
              <h3 className="text-2xl font-black text-white leading-tight">{col.title}</h3>
              <p className="text-sm text-white/60 line-clamp-1">{col.description}</p>
              <div className="pt-2">
                 <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white border border-white/10">
                   {col.count} Places
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredRestaurants = activeCategory === 'all' 
    ? MOCK_RESTAURANTS 
    : MOCK_RESTAURANTS.filter(r => r.categories.includes(activeCategory));

  return (
    <div className="space-y-16 pb-32">
      <Header />
      
      <PromotedCarousel />

      <CollectionsSection />

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-white">Categories</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-immersive-text-secondary font-black tracking-widest uppercase text-[10px]">
             View All
          </Button>
        </div>
        <CategoryCarousel activeCategory={activeCategory} onSelect={setActiveCategory} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-white">Nearby Restaurants</h2>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="rounded-full">Popular</Button>
            <Button variant="ghost" size="sm" className="rounded-full text-immersive-text-secondary">Fastest</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
              <RestaurantCard restaurant={restaurant} />
            </Link>
          ))}
        </div>
      </section>

      {filteredRestaurants.length === 0 && (
        <div className="py-20 text-center space-y-4 immersive-card rounded-[48px] border border-white/5">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
             <Search className="w-10 h-10 text-white/10" />
           </div>
           <h3 className="text-xl font-bold text-white">No results found</h3>
           <p className="text-immersive-text-secondary max-w-xs mx-auto">We couldn't find any restaurants matching your selection.</p>
           <Button variant="outline" onClick={() => setActiveCategory('all')}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
}

function ActiveOrderCard() {
  const { user } = useAuth();
  const [activeOrder, setActiveOrder] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      where('status', 'in', ['pending', 'confirmed', 'preparing', 'delivering']),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setActiveOrder({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setActiveOrder(null);
      }
    });

    return unsubscribe;
  }, [user]);

  if (!activeOrder) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 immersive-card rounded-[32px] border border-immersive-accent/30 shadow-[0_12px_40px_rgba(255,107,0,0.15)] bg-gradient-to-br from-immersive-accent/[0.03] to-transparent relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-immersive-accent/10 blur-[60px] -z-10 rounded-full group-hover:bg-immersive-accent/20 transition-all duration-700" />
      
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-immersive-accent shadow-[0_0_12px_#FF6B00] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Active Order</span>
         </div>
         <Link to="/orders" className="text-[10px] font-black uppercase tracking-widest text-immersive-accent hover:underline">Track Full</Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
         <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl border border-white/5 shadow-2xl">
            {activeOrder.status === 'delivering' ? '🛵' : '👨‍🍳'}
         </div>
         <div>
            <p className="text-sm font-bold leading-tight mb-1">{activeOrder.status === 'delivering' ? 'On its way!' : 'Preparing food'}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-immersive-text-secondary">Arriving in ~12 mins</p>
         </div>
      </div>

      <div className="space-y-4">
         <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ 
                width: activeOrder.status === 'confirmed' ? '25%' : 
                       activeOrder.status === 'preparing' ? '50%' : 
                       activeOrder.status === 'delivering' ? '75%' : '100%' 
              }}
              className="absolute inset-y-0 left-0 bg-immersive-accent shadow-[0_0_10px_#FF6B00]"
            />
         </div>
         
         <div className="flex justify-between items-center bg-black/20 rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5">
                  <img 
                    src={MOCK_RESTAURANTS.find(r => r.name === activeOrder.restaurantName)?.imageUrl || MOCK_RESTAURANTS[0].imageUrl} 
                    className="w-full h-full object-cover"
                    alt="Rest"
                  />
               </div>
               <span className="text-[11px] font-bold text-white truncate max-w-[100px]">{activeOrder.restaurantName}</span>
            </div>
            <span className="text-[11px] font-black text-immersive-accent">${activeOrder.total?.toFixed(2)}</span>
         </div>
      </div>
    </motion.div>
  );
}

function AppLayout() {
  const { loading, user } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<{ visible: boolean, title: string, message: string }>({
    visible: false,
    title: '',
    message: ''
  });
  const { items, totalPrice, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification({
        visible: true,
        title: 'Order Update',
        message: 'Your burger is being prepared by the chef! 🍔'
      });
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-immersive-bg">
        <motion.div
           animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
           transition={{ repeat: Infinity, duration: 2 }}
           className="text-4xl font-black italic text-immersive-accent"
        >
          GUSTO
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-[240px_1fr_320px] transition-colors duration-300 selection:bg-immersive-accent/20 selection:text-immersive-accent overflow-hidden">
      <Navbar />
      
      <NotificationToast 
        isVisible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
        title={notification.title}
        message={notification.message}
      />
      
      <main className="h-screen overflow-y-auto no-scrollbar relative">
        <div className="max-w-4xl mx-auto px-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/favorites" element={<div className="pt-32">Favorites Page (Coming soon)</div>} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </main>

      <aside className="hidden lg:flex flex-col gap-6 p-6 immersive-glass border-l border-white/5 h-screen overflow-y-auto no-scrollbar">
        <ActiveOrderCard />

        <div className="p-6 bg-gradient-to-br from-immersive-accent to-[#FFB800] rounded-[32px] text-black shadow-[0_10px_30px_rgba(255,107,0,0.2)]">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Loyalty Program</p>
           <h2 className="text-4xl font-black tracking-tighter mt-2 mb-1">2,450</h2>
           <p className="text-[10px] font-bold opacity-60">Points available</p>
           <div className="h-1.5 bg-black/10 rounded-full mt-6 mb-3 overflow-hidden">
             <div className="h-full bg-black w-[75%] rounded-full" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest">550 points to Platinum</p>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
           <h3 className="text-sm font-black uppercase tracking-widest opacity-60">Quick Order</h3>
           <div className="space-y-2">
             <div className="flex justify-between text-xs">
                <span className="text-immersive-text-secondary">Subtotal</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-xs">
                <span className="text-immersive-text-secondary">Delivery Fee</span>
                <span className="font-bold">$2.99</span>
             </div>
           </div>
           <Button className="w-full py-4 text-sm rounded-2xl" onClick={() => setIsCartOpen(true)}>
             View Cart (${(totalPrice + 2.99).toFixed(2)})
           </Button>
        </div>
      </aside>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <AppLayout />
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}
