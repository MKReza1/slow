import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '../firebase/config';
import { removeProduct, upsertProduct } from '../firebase/db';
import { uploadProductImage } from '../firebase/storage';

const initialForm = { name: '', description: '', price: 0, discount: 0, category: 'Accessories', images: [], stock: 0 };

export default function Admin() {
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchAll = async () => {
    const [p, o, u] = await Promise.all([
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'orders')),
      getDocs(collection(db, 'users'))
    ]);

    setProducts(p.docs.map((d) => ({ id: d.id, ...d.data() })));
    setOrders(o.docs.map((d) => ({ id: d.id, ...d.data() })));
    setUsers(u.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const revenue = useMemo(() => orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0), [orders]);

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    const urls = await Promise.all(files.map((f) => uploadProductImage(f)));
    setForm((f) => ({ ...f, images: urls }));
  };

  const saveProduct = async () => {
    await upsertProduct(form);
    toast.success('Product saved');
    setForm(initialForm);
    fetchAll();
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="glass rounded-2xl p-4">Users: {users.length}</div>
        <div className="glass rounded-2xl p-4">Orders: {orders.length}</div>
        <div className="glass rounded-2xl p-4">Revenue: ₹{revenue}</div>
      </section>

      <section className="glass rounded-2xl p-4">
        <h2 className="mb-3 text-xl font-bold">Revenue Trend</h2>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orders.map((o, idx) => ({ name: `O${idx + 1}`, revenue: o.totalPrice }))}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass space-y-3 rounded-2xl p-4">
        <h2 className="text-xl font-bold">Add / Edit Product</h2>
        <input placeholder="Name" className="w-full rounded bg-white/20 p-2" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <textarea placeholder="Description" className="w-full rounded bg-white/20 p-2" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        <input type="number" placeholder="Price" className="w-full rounded bg-white/20 p-2" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
        <input type="number" placeholder="Discount" className="w-full rounded bg-white/20 p-2" value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: Number(e.target.value) }))} />
        <input type="number" placeholder="Stock" className="w-full rounded bg-white/20 p-2" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))} />
        <input type="file" multiple onChange={onUpload} />
        <button className="rounded bg-indigo-600 px-4 py-2" onClick={saveProduct}>Save Product</button>
      </section>

      <section className="glass rounded-2xl p-4">
        <h2 className="mb-3 text-xl font-bold">Manage Products</h2>
        {products.map((p) => (
          <div key={p.id} className="mb-2 flex items-center justify-between rounded border border-white/20 p-2">
            <span>{p.name}</span>
            <div className="flex gap-2">
              <button className="rounded bg-yellow-500 px-2 py-1 text-black" onClick={() => setForm(p)}>Edit</button>
              <button
                className="rounded bg-red-600 px-2 py-1"
                onClick={async () => {
                  await removeProduct(p.id);
                  fetchAll();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="glass rounded-2xl p-4">
        <h2 className="mb-3 text-xl font-bold">Manage Orders</h2>
        {orders.map((o) => (
          <div key={o.id} className="mb-2 flex items-center justify-between rounded border border-white/20 p-2">
            <span>{o.orderId} - {o.status}</span>
            <select
              value={o.status}
              className="rounded bg-white/20 p-1"
              onChange={async (e) => {
                await updateDoc(doc(db, 'orders', o.id), { status: e.target.value });
                fetchAll();
              }}
            >
              <option>Pending</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>
        ))}
      </section>
    </div>
  );
}
