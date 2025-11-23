// Firestore service using Firebase Web SDK (compatible with Expo managed)
import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';

export const savePurchase = async (userId, purchase) => {
  if (!userId) return;
  const colRef = collection(db, 'users', userId, 'purchases');
  await addDoc(colRef, {
    ...purchase,
    createdAt: new Date().toISOString(),
  });
};

export const getPurchases = async (userId) => {
  if (!userId) return [];
  const colRef = collection(db, 'users', userId, 'purchases');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

