import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShopStore } from '../context/store';
import { inr } from '../utils/format';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart, toggleWishlist, wishlist } = useShopStore();

  return (
    <motion.article whileHover={{ y: -6 }} className="glass overflow-hidden rounded-2xl">
      <Link to={`/products/${product.id}`}>
        <img loading="lazy" src={product.images?.[0]} alt={product.name} className="h-56 w-full object-cover" />
      </Link>
      <div className="space-y-2 p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-300 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <p className="font-bold">{inr(product.price)}</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                addToCart(product);
                toast.success('Added to cart');
              }}
              className="rounded-lg bg-indigo-600 p-2"
            >
              <ShoppingCart size={14} />
            </button>
            <button
              onClick={() => toggleWishlist(product.id, user?.uid)}
              className={`rounded-lg p-2 ${wishlist.includes(product.id) ? 'bg-pink-600' : 'bg-slate-700'}`}
            >
              <Heart size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
