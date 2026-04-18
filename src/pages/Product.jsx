import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

export default function Product() {
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(200000);
  const [search, setSearch] = useState('');
  const { products, loading } = useProducts({ category, maxPrice, search });

  return (
    <div className="space-y-6">
      <div className="glass grid gap-3 rounded-2xl p-4 md:grid-cols-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" className="rounded-lg bg-white/20 p-2" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg bg-white/20 p-2">
          <option value="all">All Categories</option>
          <option value="Jerseys">Jerseys</option>
          <option value="Sneakers">Sneakers</option>
          <option value="Accessories">Accessories</option>
          <option value="Collectibles">Collectibles</option>
        </select>
        <input type="range" min="1000" max="200000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      </div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
