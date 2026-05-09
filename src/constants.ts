/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Restaurant, MenuItem } from './types.ts';

export const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'LayoutGrid' },
  { id: 'pizza', name: 'Pizza', icon: 'Pizza' },
  { id: 'burger', name: 'Burger', icon: 'Burger' },
  { id: 'sushi', name: 'Sushi', icon: 'Sushi' },
  { id: 'tacos', name: 'Tacos', icon: 'UtensilsCrossed' },
  { id: 'dessert', name: 'Desserts', icon: 'IceCream' },
  { id: 'healthy', name: 'Healthy', icon: 'Leaf' },
];

export const COLLECTIONS = [
  {
    id: 'col-1',
    title: 'Top Rated This Week',
    description: 'The highest-rated spots in your city right now.',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    count: 12
  },
  {
    id: 'col-2',
    title: 'Pocket Friendly',
    description: 'Great food that doesn\'t break the bank.',
    imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80',
    count: 8
  },
  {
    id: 'col-3',
    title: 'Late Night Cravings',
    description: 'Open late for your midnight snacks.',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    count: 15
  }
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'The Burger Lab',
    cuisine: ['American', 'Burgers', 'Fast Food'],
    rating: 4.8,
    reviewCount: 1250,
    deliveryTime: [20, 30],
    deliveryFee: 1.99,
    imageUrl: 'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=800&q=80',
    categories: ['burger'],
    isPromoted: true,
    dietaryOptions: ['vegetarian'],
    address: '123 Market St, San Francisco, CA 94103',
    reviews: [
      {
        id: 'rev-1',
        userId: 'u1',
        userName: 'Alex Johnson',
        rating: 5,
        comment: 'Best burgers in town! The secret sauce is actually incredible.',
        createdAt: Date.now() - 86400000 * 2,
        photos: ['https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80']
      },
      {
        id: 'rev-2',
        userId: 'u2',
        userName: 'Sarah Smith',
        rating: 4,
        comment: 'Solid burger, but the fries were a bit cold.',
        createdAt: Date.now() - 86400000 * 5,
      }
    ]
  },
  {
    id: 'rest-2',
    name: 'Sushi Zen',
    cuisine: ['Japanese', 'Sushi', 'Seafood', 'Healthy'],
    rating: 4.9,
    reviewCount: 850,
    deliveryTime: [35, 50],
    deliveryFee: 2.50,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    categories: ['sushi'],
    isPromoted: true,
    dietaryOptions: ['gluten-free'],
    address: '456 Post St, San Francisco, CA 94102',
    reviews: [
      {
        id: 'rev-3',
        userId: 'u3',
        userName: 'Elena Rodriguez',
        rating: 5,
        comment: 'The salmon sashimi melts in your mouth. Authentic vibe.',
        createdAt: Date.now() - 86400000 * 1,
      }
    ]
  },
  {
    id: 'rest-3',
    name: 'Stone Pizza Co.',
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    rating: 4.6,
    reviewCount: 2100,
    deliveryTime: [25, 40],
    deliveryFee: 0,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    categories: ['pizza'],
    isPromoted: false,
    dietaryOptions: ['vegetarian', 'vegan'],
    address: '789 Mission St, San Francisco, CA 94103',
  },
  {
    id: 'rest-4',
    name: 'Taco Haven',
    cuisine: ['Mexican', 'Tacos', 'Street Food'],
    rating: 4.7,
    reviewCount: 950,
    deliveryTime: [15, 25],
    deliveryFee: 0.99,
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    categories: ['tacos'],
    isPromoted: true,
    dietaryOptions: ['gluten-free', 'vegan'],
    address: '321 Valencia St, San Francisco, CA 94103',
  },
  {
    id: 'rest-5',
    name: 'Green Garden',
    cuisine: ['Healthy', 'Salads', 'Vegetarian', 'Vegan', 'Bowls'],
    rating: 4.5,
    reviewCount: 450,
    deliveryTime: [20, 35],
    deliveryFee: 3.00,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    categories: ['healthy'],
    isPromoted: false,
    dietaryOptions: ['vegetarian', 'vegan', 'gluten-free'],
    address: '654 Hayes St, San Francisco, CA 94102',
  },
  {
    id: 'rest-6',
    name: 'Spice Route',
    cuisine: ['Indian', 'Curry', 'Tandoori', 'Spicy'],
    rating: 4.4,
    reviewCount: 650,
    deliveryTime: [40, 55],
    deliveryFee: 1.50,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    categories: ['spicy'],
    isPromoted: false,
    address: '987 Mission St, San Francisco, CA 94103',
  },
  {
    id: 'rest-7',
    name: 'Dim Sum Palace',
    cuisine: ['Chinese', 'Dim Sum', 'Dumplings', 'Asian'],
    rating: 4.7,
    reviewCount: 1500,
    deliveryTime: [25, 45],
    deliveryFee: 2.00,
    imageUrl: 'https://images.unsplash.com/photo-1563245394-17f991e1d113?auto=format&fit=crop&w=800&q=80',
    categories: ['asian'],
    isPromoted: false,
    address: '123 Pine St, San Francisco, CA 94104',
  }
];

export const MOCK_MENU: MenuItem[] = [
  {
    id: 'item-1',
    restaurantId: 'rest-1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty, cheddar, lettuce, tomato, and secret sauce.',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    category: 'Burgers',
    calories: 850,
    isBestseller: true,
    tags: ['Must Try', 'Bestseller']
  },
  {
    id: 'item-2',
    restaurantId: 'rest-1',
    name: 'Truffle Fries',
    description: 'Crispy golden fries tossed in white truffle oil and parmesan.',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80',
    category: 'Sides',
    calories: 420,
    tags: ['Bestseller']
  },
  {
    id: 'item-3',
    restaurantId: 'rest-2',
    name: 'Dragon Roll',
    description: 'Shrimp tempura, eel, avocado, and unagi sauce.',
    price: 16.99,
    imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=80',
    category: 'Special Rolls',
    calories: 550,
    isBestseller: true,
    tags: ['Must Try']
  }
];

export const FOOD_GALLERY = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80',
];
