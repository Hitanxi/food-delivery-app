/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  loyaltyPoints: number;
  createdAt: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: [number, number]; // [min, max]
  deliveryFee: number;
  imageUrl: string;
  isPromoted?: boolean;
  categories: string[];
  dietaryOptions?: string[]; // e.g. ['vegetarian', 'vegan', 'gluten-free']
  address?: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: number;
  photos?: string[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  calories?: number;
  isVegetarian?: boolean;
  isBestseller?: boolean;
  tags?: string[]; // e.g. ["Must Try", "Spicy"]
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
  estimatedDelivery: number;
  deliveryAddress: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
