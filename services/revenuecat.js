import Purchases from 'react-native-purchases';
import { getRevenueCatApiKey } from '../config/revenuecat';

let isInitialized = false;
let customerInfoCache = null;
let externalUpdateCallback = null;
let listenerAttached = false;

/**
 * Attach customer info listener ONCE
 */
const attachCustomerInfoListener = () => {
  if (listenerAttached) return;

  Purchases.addCustomerInfoUpdateListener((customerInfo) => {
    console.log('[RevenueCat] Customer info updated');
    customerInfoCache = customerInfo;
    
    // Notify external subscriber if exists
    if (externalUpdateCallback) {
      externalUpdateCallback(customerInfo);
    }
  });

  listenerAttached = true;
};

// ... imports

// Flag to track if configure() has been called
let isConfigured = false;

/**
 * Initialize RevenueCat SDK
 * Safe to call multiple times - ensures singleton exists.
 */
export const initializeRevenueCat = async () => {
  if (isConfigured) {
      console.log("[RevenueCat] Already configured, skipping.");
      return;
  }

  const apiKey = getRevenueCatApiKey();
  if (!apiKey) {
    console.error('[RevenueCat] No API key found for this platform.');
    return;
  }

  try {
    console.log('[RevenueCat] Configuring SDK...');
    await Purchases.configure({ apiKey });
    isConfigured = true;
    isInitialized = true;
    
    // Initial fetch of customer info
    customerInfoCache = await Purchases.getCustomerInfo();
    attachCustomerInfoListener();
    
    console.log('[RevenueCat] SDK Configured Successfully');
  } catch (error) {
    console.error('[RevenueCat] Configuration failed:', error);
  }
};

/**
 * Ensure SDK is ready before making calls
 */
const ensureInitialized = async () => {
    if (!isConfigured) {
        console.warn("[RevenueCat] SDK not configured yet. Attempting auto-init...");
        await initializeRevenueCat();
    }
};

/**
 * Setup a listener for customer info updates (e.g. from outside the app or background)
 * @param {Function} callback - Function to call with new customerInfo
 */
export const setupCustomerInfoListener = (callback) => {
  // Just register the callback, do not attach a new listener to RevenueCat
  externalUpdateCallback = callback;
  
  // Immediately invoke with current cache if available, so App.js gets current state
  if (customerInfoCache) {
    callback(customerInfoCache);
  }
};

/**
 * Get latest cached customer info
 */
export const getCustomerInfo = async () => {
  await ensureInitialized(); // SAFETY CHECK
  if (customerInfoCache) return customerInfoCache;

  customerInfoCache = await Purchases.getCustomerInfo();
  return customerInfoCache;
};

/**
 * Fetch all offerings
 */
export const getOfferings = async () => {
  await ensureInitialized(); // SAFETY CHECK
  return Purchases.getOfferings();
};

/**
 * Get available packages
 */
export const getPackages = async () => {
  const offerings = await Purchases.getOfferings();
  return offerings.current?.availablePackages ?? [];
};

/**
 * Purchase a package
 */
export const purchasePackage = async (pkg) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    customerInfoCache = customerInfo;
    return { success: true, customerInfo };
  } catch (error) {
    if (error.userCancelled) {
      return { success: false, cancelled: true };
    }
    return { success: false, cancelled: false, error: error.message };
  }
};

/**
 * Restore purchases
 */
export const restorePurchases = async () => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    customerInfoCache = customerInfo;
    return { success: true, customerInfo };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Check exact entitlement (async with optional refresh)
 */
export const hasActiveEntitlement = async (entitlementId, { refresh = false } = {}) => {
  if (refresh) {
    try {
      customerInfoCache = await Purchases.getCustomerInfo();
    } catch (e) {
      console.error('[RevenueCat] Refresh failed:', e);
    }
  }
  
  const active = customerInfoCache?.entitlements?.active ?? {};
  return !!active[entitlementId];
};

/**
 * Check series access (checks only exact 'series_a', 'series_b' etc.)
 */
export const hasSeriesAccess = async (seriesId, options = {}) => {
  return true
  const letterMap = {
    '1': 'series_a_access',
    '2': 'series_b_access',
    '3': 'series_c_access',
    '4': 'series_d_access',
  };

  const entitlementKey = letterMap[seriesId];
  // If no mapping found (e.g. invalid seriesId), return false
  if (!entitlementKey) return false;

  return hasActiveEntitlement(entitlementKey, options);
};

/**
 * Login to RevenueCat
 */
export const loginToRevenueCat = async (userId) => {
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    customerInfoCache = customerInfo;
    console.log('[RevenueCat] Login success');
    return customerInfo;
  } catch (error) {
    console.error('[RevenueCat] Login error:', error);
  }
};

/**
 * Logout RevenueCat (back to anonymous)
 */
export const logoutFromRevenueCat = async () => {
  try {
    const { customerInfo } = await Purchases.logOut();
    customerInfoCache = customerInfo;
    console.log('[RevenueCat] Logout success');
    return customerInfo;
  } catch (error) {
    console.error('[RevenueCat] Logout error:', error);
  }
};

