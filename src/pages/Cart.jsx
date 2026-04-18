import { Link } from 'react-router-dom';
import { useShopStore } from '../context/store';
import { inr } from '../utils/format';

export default function Cart() {
  const { cart, removeFromCart, updateQty } = useShopStore();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="space-y-6">
      {cart.map((item) => (
        <div key={item.id} className="glass flex items-center justify-between rounded-2xl p-4">
          <div>
            <p className="font-semibold">{item.name}</p>
            <p>{inr(item.price)}</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="number" className="w-16 rounded bg-white/20 p-1" value={item.qty} onChange={(e) => updateQty(item.id, Number(e.target.value))} />
            <button className="rounded bg-red-500 px-3 py-1" onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        </div>
      ))}
      <div className="glass rounded-2xl p-4">
        <p className="text-xl font-bold">Total: {inr(total)}</p>
        <Link className="mt-3 inline-block rounded-full bg-indigo-600 px-6 py-2" to="/checkout">Checkout</Link>
      </div>
    </div>
  );
}
