import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from './config';

export const productsRef = collection(db, 'products');
export const ordersRef = collection(db, 'orders');

export const createOrder = (payload) =>
  addDoc(ordersRef, { ...payload, createdAt: serverTimestamp() });

export const listenProducts = (callback) =>
  onSnapshot(query(productsRef, orderBy('createdAt', 'desc')), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });

export const getFeaturedProducts = async () => {
  const snap = await getDocs(query(productsRef, orderBy('createdAt', 'desc'), limit(8)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getProductById = async (id) => {
  const snap = await getDoc(doc(db, 'products', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const upsertProduct = async (product) => {
  if (product.id) {
    await updateDoc(doc(db, 'products', product.id), product);
    return product.id;
  }
  const created = await addDoc(productsRef, { ...product, createdAt: serverTimestamp() });
  return created.id;
};

export const removeProduct = async (id) => deleteDoc(doc(db, 'products', id));

export const saveWishlist = (userId, productIds) =>
  setDoc(doc(db, 'wishlist', userId), { userId, productIds }, { merge: true });

export const getUserOrders = async (userId) => {
  const snap = await getDocs(query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
