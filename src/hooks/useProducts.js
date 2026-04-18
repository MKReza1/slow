import { useEffect, useMemo, useState } from 'react';
import { listenProducts } from '../firebase/db';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenProducts((items) => {
      setProducts(items);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const { category = 'all', maxPrice = Infinity, search = '' } = filters;
    return products.filter((p) => {
      const matchCategory = category === 'all' || p.category === category;
      const matchPrice = Number(p.price || 0) <= Number(maxPrice);
      const term = search.toLowerCase();
      const matchSearch = !term || p.name?.toLowerCase().includes(term);
      return matchCategory && matchPrice && matchSearch;
    });
  }, [filters, products]);

  return { products: filtered, loading };
};
