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
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[entitlementId] !== undefined;
  } catch (error) {
    console.error('Error checking entitlement:', error);
    return false;
  }
};

/**
 * Create a consumable purchase for a specific amount
 * This creates a one-time purchase for the cart total
 */
export const purchaseCartTotal = async (totalAmount, items) => {
  try {
    // For dynamic pricing, you might need to create products in RevenueCat
    // with different price points, or use a single product and handle pricing server-side
    
    // Option 1: Use a single product ID (you'll need to create this in RevenueCat)
    // The price will be set in RevenueCat dashboard
    const productId = `cart_total_${Math.round(totalAmount * 100)}`; // Price in cents
    
    // Option 2: Use a predefined product and pass metadata
    // This requires setting up products in RevenueCat dashboard first
    
    // For now, we'll try to find a matching package or create a purchase
    const offerings = await Purchases.getOfferings();
    
    if (offerings.current && offerings.current.availablePackages.length > 0) {
      // Use the first available package (you should configure this properly)
      const packageToPurchase = offerings.current.availablePackages[0];
      
      // Add metadata about the purchase
      await Purchases.setAttributes({
        cart_total: totalAmount.toString(),
        cart_items: JSON.stringify(items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
        }))),
      });
      
      return await purchasePackage(packageToPurchase);
    } else {
      throw new Error('No packages available for purchase');
    }
  } catch (error) {
    return {
      success: false,
      cancelled: false,
      error: error.message || 'Purchase failed',
    };
  }
};

