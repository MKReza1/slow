import { Link, NavLink } from 'react-router-dom';
import { Moon, Sun, ShoppingBag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useShopStore } from '../context/store';

const links = [
  ['/', 'Home'],
  ['/products', 'Products'],
  ['/dashboard', 'Dashboard']
];

export default function Layout({ children }) {
  const { darkMode, setDarkMode } = useTheme();
  const { user, profile, login, logout, isAdmin } = useAuth();
  const cartCount = useShopStore((s) => s.cart.reduce((acc, item) => acc + item.qty, 0));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-200 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link className="text-xl font-bold gradient-text" to="/">FANLUXE</Link>
          <div className="hidden gap-6 md:flex">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} className="text-sm font-medium hover:text-indigo-400">{label}</NavLink>
            ))}
            {isAdmin && <NavLink to="/admin" className="text-sm font-medium text-pink-400">Admin</NavLink>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="glass rounded-full p-2">
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="/cart" className="glass relative rounded-full p-2">
              <ShoppingBag size={16} />
              {!!cartCount && <span className="absolute -right-1 -top-1 rounded-full bg-pink-500 px-1 text-xs">{cartCount}</span>}
            </Link>
            {user ? (
              <button className="glass rounded-full px-3 py-1 text-sm" onClick={logout}>Logout</button>
            ) : (
              <button className="glass rounded-full px-3 py-1 text-sm" onClick={login}>Google Login</button>
            )}
            {profile?.photoURL && <img src={profile.photoURL} alt={profile.name} className="h-8 w-8 rounded-full" />}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
