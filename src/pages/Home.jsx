import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useProducts } from '../hooks/useProducts';

const categories = ['Jerseys', 'Sneakers', 'Accessories', 'Collectibles'];

export default function Home() {
  const { products, loading } = useProducts();

  return (
    <div className="space-y-10">
      <section className="glass relative overflow-hidden rounded-3xl p-10 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-pink-500/20 to-cyan-500/20" />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 space-y-4">
          <h1 className="text-4xl font-black md:text-6xl">Luxury Fan Merchandise</h1>
          <p className="mx-auto max-w-2xl text-slate-500 dark:text-slate-200">₹1 lakh-grade design language with streetwear energy and premium collectibles.</p>
          <Link to="/products" className="inline-block rounded-full bg-indigo-600 px-8 py-3 font-semibold">Shop Collection</Link>
        </motion.div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Categories</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((cat) => (
            <div key={cat} className="glass rounded-2xl p-6 text-center font-semibold">{cat}</div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Featured & Trending</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
}
