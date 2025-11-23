import AsyncStorage from '@react-native-async-storage/async-storage';
import { savePurchase as savePurchaseToDb } from './firestore';

const STORAGE_KEY_PREFIX = 'purchases:';

export const getPurchasedBooks = async (userId) => {
  if (!userId) return [];
  try {
    const raw = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const recordPurchase = async (userId, items) => {
  if (!userId || !Array.isArray(items) || items.length === 0) return;
  try {
    const existing = await getPurchasedBooks(userId);
    const now = new Date().toISOString();
    const normalized = items.map((it) => ({
      id: it.id,
      title: it.title || it.displayName || 'كتاب',
      price: it.price || 0,
      pdfFile: it.pdfFile,
      pdfUrl: it.pdfUrl,
      coverImage: it.coverImage,
      coverUrl: it.coverUrl,
      category: it.category,
      purchasedAt: now,
      sku: it.sku,
    }));
    const mergedById = {};
    [...existing, ...normalized].forEach((b) => { mergedById[b.id] = b; });
    const result = Object.values(mergedById);
    await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(result));

    // Also save each item to Firestore (placeholder)
    for (const p of normalized) {
      await savePurchaseToDb(userId, {
        bookId: p.id,
        title: p.title,
        price: p.price,
        purchasedAt: p.purchasedAt,
        sku: p.sku || null,
      });
    }
  } catch (e) {
    // swallow for now
  }
};

// Placeholder for Firestore integration; call this alongside recordPurchase when Firestore is available
export const savePurchaseToFirestore = async (userId, items) => {
  // Implement with @react-native-firebase/firestore when backend is ready
  return Promise.resolve();
};


