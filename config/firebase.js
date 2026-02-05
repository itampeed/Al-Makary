// Firebase Configuration - Real SDK initialization
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  sendEmailVerification as fbSendEmailVerification,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
} from 'firebase/firestore';
import {
  getStorage,
} from 'firebase/storage';

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIABafwfyKn5BWMZ4hmsmM_9kPAwX4_xY",
  authDomain: "almakary-e3125.firebaseapp.com",
  projectId: "almakary-e3125",
  storageBucket: "almakary-e3125.firebasestorage.app",
  messagingSenderId: "931311548909",
  appId: "1:931311548909:web:4ed384f7d98bf0fbafcfe4",
  measurementId: "G-VPB4HJ518G"
};

// Initialize Firebase (avoid re-init in Fast Refresh)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services
export { auth, db, storage };
export default { config: firebaseConfig, app };

// Firebase Authentication Helper Functions
export const firebaseAuth = {
  // Sign in with email and password
  signInWithEmailAndPassword: async (email, password) => {
    try {
      const userCredential = await fbSignInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName || email.split('@')[0],
          createdAt: userCredential.user.metadata.creationTime,
          emailVerified: !!userCredential.user.emailVerified,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Create user with email and password
  createUserWithEmailAndPassword: async (email, password, displayName) => {
    try {
      const userCredential = await fbCreateUserWithEmailAndPassword(auth, email, password);
      try { await fbSendEmailVerification(userCredential.user); } catch {}

      return {
        success: true,
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email,
          name: displayName,
          createdAt: userCredential.user.metadata.creationTime,
          emailVerified: false,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await fbSignOut(auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (email) => {
    try {
      await fbSendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    return fbOnAuthStateChanged(auth, callback);
  }
};