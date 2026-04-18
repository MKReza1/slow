import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../firebase/db';
import { useShopStore } from '../context/store';
import { inr } from '../utils/format';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const wishlist = useShopStore((s) => s.wishlist);

  useEffect(() => {
    if (user) getUserOrders(user.uid).then(setOrders);
  }, [user]);

  return (
    <div className="space-y-6">
      <section className="glass rounded-2xl p-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p>{profile?.name}</p>
        <p className="text-sm text-slate-500">{profile?.email}</p>
      </section>
      <section className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold">Orders History</h2>
        {orders.map((o) => (
          <div key={o.id} className="mt-3 rounded border border-white/20 p-3">
            <p>Order #{o.orderId}</p>
            <p>Status: {o.status}</p>
            <p>Total: {inr(o.totalPrice)}</p>
          </div>
        ))}
      </section>
      <section className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold">Wishlist</h2>
        <p>{wishlist.length} items saved.</p>
      </section>
    </div>
  );
}
