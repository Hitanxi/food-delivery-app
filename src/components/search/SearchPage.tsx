/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Filter, SlidersHorizontal, Star, Utensils, Store, Leaf } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../../constants.ts';
import { RestaurantCard } from '../restaurant/RestaurantCard.tsx';
import { Button } from '../ui/Button.tsx';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils.ts';
import { motion, AnimatePresence } from 'motion/react';
import { getFuzzyRestaurants, getSuggestions, Suggestion } from '../../services/searchService.ts';

import { useSearchParams } from 'react-router-dom';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [cuisineSearch, setCuisineSearch] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const dietaryPreferences = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten-Free' },
  ];

  // Extract all unique cuisines from mock data
  const allCuisines = useMemo(() => {
    const cuisines = new Set<string>();
    MOCK_RESTAURANTS.forEach(r => r.cuisine.forEach(c => cuisines.add(c)));
    return Array.from(cuisines).sort();
  }, []);

  const filteredCuisines = useMemo(() => {
    if (!cuisineSearch) return allCuisines;
    return allCuisines.filter(c => c.toLowerCase().includes(cuisineSearch.toLowerCase()));
  }, [allCuisines, cuisineSearch]);

  // Sync searchQuery with URL param if it changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Suggestions logic
  const suggestions = useMemo(() => getSuggestions(searchQuery), [searchQuery]);

  // Main filtered results logic
  const filtered = useMemo(() => {
    const results = getFuzzyRestaurants(searchQuery);
    return results.filter(r => {
      const matchesPrice = !priceFilter || (priceFilter === 'free' ? r.deliveryFee === 0 : r.deliveryFee > 0);
      const matchesRating = !ratingFilter || r.rating >= ratingFilter;
      const matchesCuisine = selectedCuisines.length === 0 || 
                            r.cuisine.some(c => selectedCuisines.includes(c));
      const matchesDietary = selectedDietary.length === 0 || 
                            selectedDietary.every(d => r.dietaryOptions?.includes(d));
      return matchesPrice && matchesRating && matchesCuisine && matchesDietary;
    });
  }, [searchQuery, priceFilter, ratingFilter, selectedCuisines, selectedDietary]);

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };

  const toggleDietary = (id: string) => {
    setSelectedDietary(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
  };

  return (
    <div className="pt-24 pb-32 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tight text-white">Discover</h1>
        <div className="relative group max-w-2xl" ref={searchRef}>
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-immersive-text-secondary group-focus-within:text-immersive-accent transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search for restaurants, dishes..."
            value={searchQuery}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 pl-16 pr-6 text-base font-bold text-white placeholder:text-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-immersive-accent/10 focus:border-immersive-accent/50 focus:bg-white/10"
          />

          {/* Autocomplete Suggestions */}
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
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-72 space-y-8 scrollbar-hide md:sticky md:top-24 h-fit">
           <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF6B00] flex items-center gap-2 px-1">
                <SlidersHorizontal className="w-3 h-3" />
                Price Range
              </h3>
              <div className="flex flex-wrap gap-2">
                {['any', 'free', 'paid'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriceFilter(p === 'any' ? null : p)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                      (p === 'any' && !priceFilter) || priceFilter === p
                        ? "bg-immersive-accent text-white border-white/20 shadow-[0_0_15px_rgba(255,107,0,0.2)]"
                        : "bg-white/5 border-white/5 text-immersive-text-secondary hover:border-white/10 hover:text-white"
                    )}
                  >
                    {p === 'any' ? 'All' : p}
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-immersive-text-secondary flex items-center gap-2 px-1">
                <Leaf className="w-3 h-3 text-green-500" />
                Dietary
              </h3>
              <div className="flex flex-wrap gap-2">
                {dietaryPreferences.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => toggleDietary(d.id)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                      selectedDietary.includes(d.id)
                        ? "bg-green-500/20 text-green-400 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                        : "bg-white/5 border-white/5 text-immersive-text-secondary hover:border-white/10 hover:text-white"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-immersive-text-secondary flex items-center gap-2">
                  <Utensils className="w-3 h-3 text-immersive-accent" />
                  Cuisines
                </h3>
                {selectedCuisines.length > 0 && (
                  <button 
                    onClick={() => setSelectedCuisines([])}
                    className="text-[10px] font-black uppercase tracking-widest text-immersive-accent hover:underline"
                  >
                    Clear ({selectedCuisines.length})
                  </button>
                )}
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
                <input 
                  type="text"
                  placeholder="Search cuisines..."
                  value={cuisineSearch}
                  onChange={(e) => setCuisineSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[11px] font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-immersive-accent/30 focus:bg-white/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                {filteredCuisines.map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => toggleCuisine(cuisine)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border text-left",
                      selectedCuisines.includes(cuisine)
                        ? "bg-white/10 text-white border-immersive-accent shadow-[0_0_10px_rgba(255,107,0,0.1)]"
                        : "bg-white/5 border-white/5 text-immersive-text-secondary hover:border-white/10 hover:text-white"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-md border flex items-center justify-center transition-all flex-shrink-0",
                      selectedCuisines.includes(cuisine)
                        ? "bg-immersive-accent border-immersive-accent"
                        : "bg-black/20 border-white/10"
                    )}>
                      {selectedCuisines.includes(cuisine) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <span className="truncate">{cuisine}</span>
                  </button>
                ))}
                {filteredCuisines.length === 0 && (
                  <div className="col-span-2 py-4 text-center">
                    <p className="text-[10px] font-black uppercase text-white/20">No matches</p>
                  </div>
                )}
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-immersive-text-secondary flex items-center gap-2 px-1">
                <Star className="w-3 h-3 text-yellow-400" />
                Min. Rating
              </h3>
              <div className="space-y-2">
                {[4.5, 4.0, 3.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRatingFilter(ratingFilter === r ? null : r)}
                    className={cn(
                      "w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border",
                      ratingFilter === r
                        ? "bg-white/10 text-white border-immersive-accent shadow-[0_0_15px_rgba(255,107,0,0.1)]"
                        : "bg-white/5 border-white/5 text-immersive-text-secondary hover:border-white/10 hover:text-white"
                    )}
                  >
                    <span>{r}+ Stars</span>
                    <Star className={cn("w-4 h-4", ratingFilter === r ? "fill-yellow-400 text-yellow-400" : "fill-white/5 text-white/10")} />
                  </button>
                ))}
              </div>
           </div>
        </aside>

        {/* Results */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-immersive-text-secondary">
              Found <span className="text-white">{filtered.length}</span> results
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="search-results">
            {filtered.map((restaurant) => (
              <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                <RestaurantCard restaurant={restaurant} />
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center space-y-4 immersive-card rounded-[48px] border border-white/5">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Filter className="w-10 h-10 text-white/10" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Try adjusting filters</h3>
              <p className="text-immersive-text-secondary max-w-xs mx-auto text-sm">We couldn't find exactly what you're looking for with these settings.</p>
              <Button variant="ghost" onClick={() => { setSearchQuery(''); setPriceFilter(null); setRatingFilter(null); setSelectedCuisines([]); setSelectedDietary([]); }}>
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
