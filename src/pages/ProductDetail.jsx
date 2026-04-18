import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProductById } from '../firebase/db';
import { useShopStore } from '../context/store';
import { inr } from '../utils/format';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const addToCart = useShopStore((s) => s.addToCart);

  useEffect(() => {
    getProductById(id).then(setProduct);
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <img className="glass h-96 w-full rounded-2xl object-cover" src={product.images?.[0]} alt={product.name} />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p>{product.description}</p>
        <p className="text-2xl font-bold">{inr(product.price)}</p>
        <button
          className="rounded-full bg-indigo-600 px-6 py-3 font-semibold"
          onClick={() => {
            addToCart(product);
            toast.success('Added to cart');
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
