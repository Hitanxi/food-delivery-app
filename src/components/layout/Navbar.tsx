/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Search, ShoppingBag, User, Heart, Moon, Sun, LogIn, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils.ts';
import { Button } from '../ui/Button.tsx';
import { useTheme } from '../../contexts/ThemeContext.tsx';
import { useCart } from '../../contexts/CartContext.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { items } = useCart();
  const { user, signIn, logout } = useAuth();
  
  const navLinks = [
    { to: '/', icon: Home, label: 'Explore' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/favorites', icon: Heart, label: 'Favorites' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-screen immersive-glass border-r border-white/5 p-8 gap-10">
        <NavLink to="/" className="text-2xl font-black italic tracking-tighter text-immersive-accent px-4 mb-4">
          GUSTO
        </NavLink>

        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm',
                  isActive 
                    ? 'bg-immersive-card text-immersive-accent shadow-[0_0_15px_rgba(255,107,0,0.1)] border border-immersive-accent/10' 
                    : 'text-immersive-text-secondary hover:text-white hover:bg-white/5'
                )
              }
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-6 pt-6 border-t border-white/5">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-4 px-4 py-3 w-full text-immersive-text-secondary hover:text-white transition-colors text-sm font-bold"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Theme
          </button>

          {user ? (
            <div className="flex items-center gap-4 p-4 immersive-card rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5">
                <img src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} alt="User" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.displayName || 'Guest'}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#FFB800]">Gold Member</p>
              </div>
              <button 
                onClick={logout}
                className="text-immersive-text-secondary hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button onClick={signIn} className="w-full rounded-2xl flex items-center justify-center gap-2 py-4">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Bar (remains similar but dark themed) */}
      <nav className="fixed bottom-6 left-6 right-6 z-50 md:hidden immersive-glass bg-[#141414]/90 text-white rounded-[28px] px-8 h-18 flex items-center justify-between shadow-2xl border border-white/10">
        {navLinks.slice(0, 4).map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 transition-all group scale-100 active:scale-90',
                isActive ? 'text-immersive-accent' : 'text-immersive-text-secondary'
              )
            }
          >
            <link.icon className="w-6 h-6" />
          </NavLink>
        ))}
        {user ? (
          <NavLink to="/profile">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/10 shadow-lg">
               <img src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} alt="User" />
            </div>
          </NavLink>
        ) : (
          <button onClick={signIn} className="text-immersive-text-secondary"><LogIn className="w-6 h-6" /></button>
        )}
      </nav>
    </>
  );
}
