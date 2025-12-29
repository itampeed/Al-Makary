import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';
import { getRevenueCatApiKey } from '../config/revenuecat';

let isInitialized = false;

/**
 * Initialize RevenueCat SDK
 * Call this once when the app starts
 */
export const initializeRevenueCat = async (userId = null) => {
  try {
    if (isInitialized) {
      return;
    }

    const apiKey = getRevenueCatApiKey();
    if (!apiKey) {
      throw new Error('RevenueCat API key not configured for this platform');
    }

    await Purchases.configure({ apiKey });
    
    // Set user ID if provided (for authenticated users)
    if (userId) {
      await Purchases.logIn(userId);
    }

    isInitialized = true;
    console.log('RevenueCat initialized successfully');
  } catch (error) {
    console.error('Error initializing RevenueCat:', error);
    throw error;
  }
};

/**
 * Get available products/offerings from RevenueCat
 */
export const getOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error) {
    console.error('Error fetching offerings:', error);
    throw error;
  }
};

/**
 * Get available packages for purchase
 */
export const getPackages = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      return offerings.current.availablePackages;
    }
    return [];
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
};

/**
 * Purchase a package
 * @param {Package} packageToPurchase - The RevenueCat package to purchase
 * @returns {Promise<PurchaseResult>}
 */
export const purchasePackage = async (packageToPurchase) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return {
      success: true,
      customerInfo,
    };
  } catch (error) {
    if (error.userCancelled) {
      return {
        success: false,
        cancelled: true,
        error: 'User cancelled the purchase',
      };
    }
    return {
      success: false,
      cancelled: false,
      error: error.message || 'Purchase failed',
    };
  }
};

/**
 * Purchase a product by identifier
 * @param {string} productIdentifier - The product identifier
 * @returns {Promise<PurchaseResult>}
 */
export const purchaseProduct = async (productIdentifier) => {
  try {
    const offerings = await Purchases.getOfferings();
    if (!offerings.current) {
      throw new Error('No current offering available');
    }

    // Find the package with the matching product identifier
    const packageToPurchase = offerings.current.availablePackages.find(
      (pkg) => pkg.storeProduct.identifier === productIdentifier
    );

    if (!packageToPurchase) {
      throw new Error(`Product ${productIdentifier} not found`);
    }

    return await purchasePackage(packageToPurchase);
  } catch (error) {
    return {
      success: false,
      cancelled: false,
      error: error.message || 'Purchase failed',
    };
  }
};

/**
 * Restore purchases for the current user
 */
export const restorePurchases = async () => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return {
      success: true,
      customerInfo,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to restore purchases',
    };
  }
};

/**
 * Get customer info
 */
export const getCustomerInfo = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Error fetching customer info:', error);
    throw error;
  }
};

/**
 * Check if user has active entitlement (has purchased)
 * @param {string} entitlementId - The entitlement identifier
 */
export const hasActiveEntitlement = async (entitlementId) => {
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[entitlementId] !== undefined;
  } catch (error) {
    console.error('Error checking entitlement:', error);
    return false;
  }
};

/**
 * Log in to RevenueCat with a specific user ID
 * @param {string} userId - The Firebase User ID
 */
export const loginToRevenueCat = async (userId) => {
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    console.log('RevenueCat login success:', customerInfo);
    return customerInfo;
  } catch (error) {
    console.error('RevenueCat login error:', error);
    // Don't throw, just log. Subscription features might be limited but app shouldn't crash.
  }
};

/**
 * Log out from RevenueCat (resets to anonymous ID)
 */
export const logoutFromRevenueCat = async () => {
  try {
    const { customerInfo } = await Purchases.logOut();
    console.log('RevenueCat logout success');
    return customerInfo;
  } catch (error) {
    console.error('RevenueCat logout error:', error);
  }
};
