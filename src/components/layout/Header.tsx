import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { ThemeToggle } from '../common/ThemeToggle';
import { cn } from '../../utils/cn';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=tshirt', label: 'T-Shirts' },
  { to: '/shop?category=hoodie', label: 'Hoodies' },
  { to: '/shop?category=print3d', label: '3D Lab' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    setQuery('');
    if (q) navigate(`/shop?q=${encodeURIComponent(q)}`);
    else navigate('/shop');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-brand-950/95 backdrop-blur-md border-b border-brand-200 dark:border-brand-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <button
            type="button"
            className="lg:hidden p-2 -ml-2 text-brand-900 dark:text-brand-100"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tighter text-brand-950 dark:text-white"
          >
            NOIR
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-brand-950 dark:hover:text-white',
                    isActive
                      ? 'text-brand-950 dark:text-white'
                      : 'text-brand-600 dark:text-brand-400'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <ThemeToggle compact />

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 text-brand-700 hover:text-brand-950 dark:text-brand-300 dark:hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to={user ? '/account' : '/login'}
              className="hidden sm:block p-2 text-brand-700 hover:text-brand-950 dark:text-brand-300 dark:hover:text-white transition-colors"
              aria-label={user ? 'Account' : 'Log in'}
            >
              <User className="h-5 w-5" />
            </Link>

            <Link
              to="/wishlist"
              className="relative p-2 text-brand-700 hover:text-brand-950 dark:text-brand-300 dark:hover:text-white transition-colors"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-900 dark:bg-white dark:text-brand-950 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 text-brand-700 hover:text-brand-950 dark:text-brand-300 dark:hover:text-white transition-colors"
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-900 dark:bg-white dark:text-brand-950 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="absolute inset-x-0 top-full border-b border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-950 shadow-lg">
          <form
            onSubmit={submitSearch}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search merch & 3D prints…"
                className="w-full h-11 pl-10 pr-4 border border-brand-300 dark:border-brand-700 dark:bg-brand-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                aria-label="Search products"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-5 bg-brand-900 text-white text-sm font-medium rounded-md hover:bg-brand-800"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="h-11 px-3 text-brand-600 hover:text-brand-900"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-brand-950 shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 h-16 border-b border-brand-200 dark:border-brand-800">
              <span className="text-xl font-extrabold tracking-tighter">NOIR</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 -mr-2"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1" aria-label="Mobile">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block px-3 py-3 text-base font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-brand-100 dark:bg-brand-800 text-brand-950 dark:text-white'
                        : 'text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="px-3 pt-4">
                <ThemeToggle />
              </div>
            </nav>

            <div className="border-t border-brand-200 dark:border-brand-800 p-4 space-y-2">
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-brand-700 dark:text-brand-300"
              >
                <User className="h-5 w-5" />
                Account
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-brand-700 dark:text-brand-300"
              >
                <Heart className="h-5 w-5" />
                Wishlist ({wishlistCount})
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-brand-500 text-sm"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
