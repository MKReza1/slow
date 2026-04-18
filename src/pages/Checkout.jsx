import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShopStore } from '../context/store';
import { createOrder } from '../firebase/db';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useShopStore();
  const [form, setForm] = useState({ address: '', phone: '' });

  const totalPrice = cart.reduce((s, i) => s + i.qty * i.price, 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to checkout');

    await createOrder({
      orderId: crypto.randomUUID(),
      userId: user.uid,
      items: cart,
      totalPrice,
      status: 'Pending',
      ...form
    });

    clearCart();
    toast.success('Order placed successfully');
    navigate('/dashboard');
  };

  return (
    <form onSubmit={submit} className="glass mx-auto max-w-lg space-y-4 rounded-2xl p-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <input required placeholder="Address" className="w-full rounded bg-white/20 p-2" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
      <input required placeholder="Phone" className="w-full rounded bg-white/20 p-2" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
      <button className="w-full rounded-full bg-indigo-600 py-2 font-semibold">Confirm Order</button>
    </form>
  );
}
