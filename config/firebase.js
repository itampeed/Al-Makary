// Firebase Configuration
// This file provides mock Firebase functions for development
// Replace with actual Firebase imports when ready to deploy

// Mock Firebase functions for development
const mockAuth = {
  signInWithEmailAndPassword: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: {
        uid: 'mock-user-id',
        email: email,
        displayName: email.split('@')[0],
        metadata: { creationTime: new Date().toISOString() },
        emailVerified: true
      }
    };
  },
  createUserWithEmailAndPassword: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: {
        uid: 'mock-user-id',
        email: email,
        displayName: email.split('@')[0],
        metadata: { creationTime: new Date().toISOString() },
        emailVerified: false
      }
    };
  },
  sendEmailVerification: async () => {
    // Simulate email verification
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve();
  },
  signOut: async () => {
    // Simulate sign out
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve();
  },
  currentUser: null,
  onAuthStateChanged: (callback) => {
    // Mock auth state change listener
    return () => {};
  }
};

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCsnjANlU-ZU4SdKR1Uy15gIrGHqvVx2E",
  authDomain: "almakary-12b81.firebaseapp.com",
  projectId: "almakary-12b81",
  storageBucket: "almakary-12b81.firebasestorage.app",
  messagingSenderId: "33622921489",
  appId: "1:33622921489:web:05af41db93bd73af1a3cb0",
  measurementId: "G-789QGEWGWK"
};

// For development, use mock auth
// Replace with actual Firebase imports when ready
const auth = mockAuth;

// Export Firebase services
export { auth };
export default { config: firebaseConfig };

// Firebase Authentication Helper Functions
export const firebaseAuth = {
  // Sign in with email and password
  signInWithEmailAndPassword: async (email, password) => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      return {
        success: true,
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName || email.split('@')[0],
          createdAt: userCredential.user.metadata.creationTime,
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
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      
      // Update display name
      await userCredential.user.updateProfile({
        displayName: displayName
      });

      // Send email verification
      await userCredential.user.sendEmailVerification();

      return {
        success: true,
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email,
          name: displayName,
          createdAt: userCredential.user.metadata.creationTime,
          emailVerified: userCredential.user.emailVerified,
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
      await auth.signOut();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    return auth.onAuthStateChanged(callback);
  }
};