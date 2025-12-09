import AsyncStorage from '@react-native-async-storage/async-storage';
import { savePurchase as savePurchaseToDb } from './firestore';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

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

// Save complete purchase data to Firestore
export const savePurchaseToFirestore = async (purchaseData) => {
  try {
    const { userId, items, total, customerInfo, purchaseDate, transactionId, revenueCatInfo } = purchaseData;
    
    if (!userId || userId === 'anonymous') {
      console.warn('Cannot save purchase: No user ID');
      return;
    }

    // Save the complete purchase document
    const purchaseDoc = {
      userId: userId,
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        author: item.author || 'غير معروف',
        price: item.price,
        pdfFile: item.pdfFile,
        pdfUrl: item.pdfUrl,
        coverImage: item.coverImage,
        coverUrl: item.coverUrl,
        category: item.category,
        sku: item.sku,
      })),
      total: total,
      customerInfo: {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        postalCode: customerInfo.postalCode,
      },
      purchaseDate: purchaseDate,
      transactionId: transactionId,
      revenueCatInfo: revenueCatInfo || {},
      createdAt: new Date().toISOString(),
      paymentMethod: 'RevenueCat IAP',
    };

    // Save to purchases collection
    const purchasesRef = collection(db, 'purchases');
    await addDoc(purchasesRef, purchaseDoc);

    // Also save to user's purchases subcollection
    const userPurchasesRef = collection(db, 'users', userId, 'purchases');
    await addDoc(userPurchasesRef, purchaseDoc);

    // Save each individual book purchase for easier querying
    for (const item of items) {
      const bookPurchaseRef = collection(db, 'users', userId, 'purchasedBooks');
      await addDoc(bookPurchaseRef, {
        bookId: item.id,
        title: item.title,
        author: item.author,
        price: item.price,
        pdfFile: item.pdfFile,
        pdfUrl: item.pdfUrl,
        coverImage: item.coverImage,
        coverUrl: item.coverUrl,
        category: item.category,
        sku: item.sku,
        purchasedAt: purchaseDate,
        transactionId: transactionId,
        createdAt: new Date().toISOString(),
      });
    }

    console.log('Purchase saved to Firestore successfully');
  } catch (error) {
    console.error('Error saving purchase to Firestore:', error);
    throw error;
  }
};


