// RevenueCat Configuration
// Get your API keys from: https://app.revenuecat.com/
import { Platform } from 'react-native';

// RevenueCat API Keys
// Replace with your actual API keys from RevenueCat dashboard
export const REVENUECAT_API_KEY_IOS = 'YOUR_IOS_API_KEY_HERE';
export const REVENUECAT_API_KEY_ANDROID = 'YOUR_ANDROID_API_KEY_HERE';

// Platform detection helper
export const getRevenueCatApiKey = () => {
  if (Platform.OS === 'ios') {
    return REVENUECAT_API_KEY_IOS;
  } else if (Platform.OS === 'android') {
    return REVENUECAT_API_KEY_ANDROID;
  }
  return null;
};

// Product IDs - These should match your RevenueCat products
// You'll need to create products in RevenueCat dashboard and use their identifiers here
export const PRODUCT_IDS = {
  // Example: Create products in RevenueCat with these IDs
  // You can create products based on price tiers or individual book purchases
  BOOK_PURCHASE: 'book_purchase', // Replace with your actual product ID
};

export default {
  iosApiKey: REVENUECAT_API_KEY_IOS,
  androidApiKey: REVENUECAT_API_KEY_ANDROID,
  productIds: PRODUCT_IDS,
};