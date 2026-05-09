import { useParams, Link } from 'react-router-dom';
import { MOCK_RESTAURANTS, MOCK_MENU } from '../../constants.ts';
import { Button } from '../ui/Button.tsx';
import { ArrowLeft, Star, Clock, Bike, Plus, Share2, MapPin, MessageSquare, Info, TrendingUp } from 'lucide-react';
import { useCart } from '../../contexts/CartContext.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { motion } from 'motion/react';
import { useState, useMemo, useEffect } from 'react';
import { SocialShare } from '../ui/SocialShare.tsx';
import { ReviewForm } from '../reviews/ReviewForm.tsx';
import { cn } from '../../lib/utils.ts';
import { Review } from '../../types.ts';

export function RestaurantPage() {
  const { id } = useParams();
  const restaurant = MOCK_RESTAURANTS.find(r => r.id === id);
  const { addItem } = useCart();
  const { user } = useAuth();
  const [shareData, setShareData] = useState<{ url: string, title: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'info'>('menu');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (restaurant?.reviews) {
      setLocalReviews(restaurant.reviews);
    }
  }, [restaurant]);

  const menuItems = useMemo(() => MOCK_MENU.filter(item => item.restaurantId === id), [id]);
  const bestsellers = useMemo(() => menuItems.filter(item => item.isBestseller || item.tags?.includes('Must Try')), [menuItems]);

  const stats = useMemo(() => {
    if (localReviews.length === 0) return { rating: restaurant.rating, count: restaurant.reviewCount };
    const sum = localReviews.reduce((acc, rev) => acc + rev.rating, 0);
    const avg = sum / localReviews.length;
    // Blend with mock review count for realism
    return { rating: avg.toFixed(1), count: Math.max(restaurant.reviewCount, localReviews.length) };
  }, [localReviews, restaurant]);

  const handleReviewSubmit = (reviewData: { rating: number; comment: string }) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userId: user?.uid || 'anonymous',
      userName: user?.displayName || 'Happy Foodie',
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: Date.now(),
    };
    setLocalReviews(prev => [newReview, ...prev]);
  };

  if (!restaurant) return <div className="pt-32 text-center text-white">Restaurant not found</div>;

  return (
    <div className="pb-32">
      <SocialShare 
        isOpen={!!shareData} 
        onClose={() => setShareData(null)} 
        url={shareData?.url || ''} 
        title={shareData?.title || ''} 
      />

      <ReviewForm
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        onSubmit={handleReviewSubmit}
        restaurantName={restaurant.name}
      />
      
      {/* Hero Section */}
      <div className="relative h-[45vh] md:h-[55vh] -mx-6 mb-8 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={restaurant.imageUrl} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        
        <Link to="/" className="absolute top-8 left-8 bg-white/10 backdrop-blur-xl text-white p-3 rounded-2xl hover:bg-white/20 transition-all border border-white/10 shadow-2xl z-10">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        
        <div className="absolute bottom-12 left-8 right-8 text-white max-w-4xl mx-auto w-full">
           <div className="flex flex-wrap items-center gap-3 mb-6">
            {restaurant.cuisine.map(c => (
              <span key={c} className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                {c}
              </span>
            ))}
            {restaurant.isPromoted && (
              <span className="bg-immersive-accent/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-immersive-accent/30 text-immersive-accent">
                Promoted
              </span>
            )}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">{restaurant.name}</h1>
          
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/5">
               <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
               <div className="leading-tight">
                 <p className="font-black text-lg">{stats.rating}</p>
                 <p className="text-[10px] uppercase font-black tracking-widest text-white/40">{stats.count}+ Reviews</p>
               </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/5">
               <Clock className="w-5 h-5 text-immersive-accent" />
               <div className="leading-tight">
                 <p className="font-black text-lg">{restaurant.deliveryTime[0]}-{restaurant.deliveryTime[1]}m</p>
                 <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Delivery Time</p>
               </div>
            </div>

            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/5">
               <Bike className="w-5 h-5 text-immersive-accent" />
               <div className="leading-tight">
                 <p className="font-black text-lg">{restaurant.deliveryFee === 0 ? 'Free' : `$${restaurant.deliveryFee}`}</p>
                 <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Delivery Fee</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-white/5 mb-12">
          {[
            { id: 'menu', label: 'Order Online', icon: Utensils },
            { id: 'reviews', label: 'Reviews', icon: MessageSquare },
            { id: 'info', label: 'Overview', icon: Info },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "pb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all relative",
                activeTab === tab.id ? "text-immersive-accent" : "text-immersive-text-secondary hover:text-white"
              )}
            >
              {activeTab === tab.id && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-immersive-accent" />}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'menu' && (
          <div className="space-y-16">
            {bestsellers.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                     <TrendingUp className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Must Try</h2>
                    <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Our signature legends</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {bestsellers.map((item) => (
                    <MenuCard key={item.id} item={item} onAdd={() => addItem(item)} onShare={() => setShareData({ url: window.location.href, title: item.name })} isMustTry />
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-8">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-immersive-text-secondary flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                Full Menu
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {menuItems.map((item) => (
                  <MenuCard key={item.id} item={item} onAdd={() => addItem(item)} onShare={() => setShareData({ url: window.location.href, title: item.name })} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-12">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white tracking-tight">Customer Voices</h2>
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">{localReviews.length} Verified Reviews</p>
               </div>
               <Button 
                 variant="primary" 
                 size="sm" 
                 className="rounded-xl shadow-[0_8px_20px_rgba(255,107,0,0.2)]"
                 onClick={() => setShowReviewForm(true)}
               >
                 Write Review
               </Button>
            </div>
            
            <div className="space-y-8">
              {localReviews.map((review) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={review.id} 
                  className="p-8 immersive-card rounded-[40px] border border-white/5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-black text-white border border-white/10">
                        {review.userName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-white uppercase text-xs tracking-wider">{review.userName}</p>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-white/10")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-immersive-text-secondary leading-loose italic">"{review.comment}"</p>
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-4 pt-2">
                      {review.photos.map((photo, i) => (
                        <div key={i} className="w-20 h-20 rounded-2xl overflow-hidden border border-white/5 group cursor-pointer">
                           <img src={photo} alt="Review" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              {localReviews.length === 0 && (
                 <div className="py-20 text-center space-y-4">
                    <MessageSquare className="w-12 h-12 text-white/5 mx-auto" />
                    <p className="text-immersive-text-secondary text-sm">No reviews yet. Be the first to share your experience!</p>
                 </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-12">
               <section className="space-y-6">
                  <h3 className="text-xl font-black text-white tracking-tight">Location & Hours</h3>
                  <div className="p-8 immersive-card rounded-[40px] border border-white/5 space-y-6">
                     <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-immersive-accent mt-1" />
                        <div>
                           <p className="text-white font-bold">{restaurant.address || 'Address coming soon'}</p>
                           <p className="text-immersive-accent text-[10px] font-black uppercase tracking-widest mt-1 hover:underline cursor-pointer">Open on Maps</p>
                        </div>
                     </div>
                     <div className="h-48 bg-white/5 rounded-3xl overflow-hidden relative group">
                        <img src="https://picsum.photos/seed/map/800/400?grayscale" className="w-full h-full object-cover opacity-30 saturate-0" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Button variant="secondary" size="sm" className="rounded-full shadow-2xl">View Interactive Map</Button>
                        </div>
                     </div>
                  </div>
               </section>
            </div>
            
            <div className="space-y-8 h-fit md:sticky md:top-24">
               <div className="p-8 immersive-card rounded-[40px] border border-white/5 space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#FF6B00]">Quick Info</h4>
                  <ul className="space-y-4">
                     {[
                        { label: 'Cuisine', value: restaurant.cuisine.join(', ') },
                        { label: 'Avg Cost', value: '$25 for two' },
                        { label: 'Best For', value: 'Dinner with friends' },
                     ].map((item) => (
                        <li key={item.label} className="flex flex-col gap-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{item.label}</span>
                           <span className="text-sm font-bold text-white">{item.value}</span>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MenuCardProps {
  key?: any;
  item: any;
  onAdd: () => void;
  onShare: () => void;
  isMustTry?: boolean;
}

function MenuCard({ item, onAdd, onShare, isMustTry }: MenuCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={cn(
        "immersive-card p-6 rounded-[48px] border flex gap-6 hover:shadow-2xl transition-all relative overflow-hidden group",
        isMustTry ? "border-orange-500/30 bg-orange-500/[0.02]" : "border-white/5"
      )}
    >
      {isMustTry && (
        <div className="absolute -top-1 -left-1 px-4 py-1.5 bg-orange-500 rounded-br-2xl shadow-lg z-10">
           <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1.5">
             <TrendingUp className="w-3 h-3" />
             Must Try
           </span>
        </div>
      )}
      
      <div className="w-32 h-32 rounded-[32px] overflow-hidden flex-shrink-0 bg-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-105 border border-white/5">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 space-y-3 py-1">
        <div className="flex justify-between items-start">
          <div>
             <h3 className="text-xl font-bold text-white leading-tight mb-1 group-hover:text-immersive-accent transition-colors">{item.name}</h3>
             <div className="flex items-center gap-3">
                <span className="text-immersive-accent font-black text-lg font-mono">${item.price.toFixed(2)}</span>
                {item.calories && <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{item.calories} cal</span>}
             </div>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); onShare(); }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/20 hover:text-white transition-colors hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-[13px] text-immersive-text-secondary leading-relaxed line-clamp-2 pr-4">{item.description}</p>
        
        <div className="flex items-center justify-between pt-2">
           <div className="flex items-center gap-2">
              {item.isVegetarian && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                   <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Veg</span>
                </div>
              )}
              {item.tags?.map((tag: string) => tag !== 'Must Try' && (
                <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-white/30 border border-white/10 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
           </div>
           
           <Button 
             size="icon" 
             variant="primary" 
             className="rounded-2xl w-12 h-12 shadow-[0_8px_20px_rgba(255,107,0,0.3)] hover:scale-105 transition-transform"
             onClick={onAdd}
           >
             <Plus className="w-6 h-6" />
           </Button>
        </div>
      </div>
    </motion.div>
  );
}

const Utensils = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>;
