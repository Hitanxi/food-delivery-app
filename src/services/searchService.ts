import Fuse from 'fuse.js';
import { MOCK_RESTAURANTS, MOCK_MENU } from '../constants.ts';
import { Restaurant, MenuItem } from '../types.ts';

export type Suggestion = {
  type: 'restaurant' | 'dish';
  id: string;
  name: string;
  sub: string;
  restaurantId?: string;
};

const restaurantFuse = new Fuse(MOCK_RESTAURANTS, {
  keys: ['name', 'cuisine'],
  threshold: 0.4,
});

const menuFuse = new Fuse(MOCK_MENU, {
  keys: ['name', 'category'],
  threshold: 0.4,
});

export function getFuzzyRestaurants(query: string): Restaurant[] {
  if (!query.trim()) return MOCK_RESTAURANTS;
  
  const restResults = restaurantFuse.search(query).map(r => r.item);
  const menuMatches = menuFuse.search(query);
  const restaurantIdsFromMenu = Array.from(new Set(menuMatches.map(m => m.item.restaurantId)));
  const restsFromMenu = MOCK_RESTAURANTS.filter(r => restaurantIdsFromMenu.includes(r.id));

  const merged = [...restResults];
  restsFromMenu.forEach(r => {
    if (!merged.find(existing => existing.id === r.id)) {
      merged.push(r);
    }
  });
  
  return merged;
}

export function getSuggestions(query: string): Suggestion[] {
  if (!query.trim()) return [];
  
  const restResults = restaurantFuse.search(query).slice(0, 3).map(r => ({
    type: 'restaurant' as const,
    id: r.item.id,
    name: r.item.name,
    sub: r.item.cuisine.join(', '),
  }));

  const itemResults = menuFuse.search(query).slice(0, 3).map(r => ({
    type: 'dish' as const,
    id: r.item.id,
    name: r.item.name,
    sub: r.item.category,
    restaurantId: r.item.restaurantId
  }));

  return [...restResults, ...itemResults];
}
