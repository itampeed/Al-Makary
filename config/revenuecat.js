// RevenueCat Configuration
// Get your API keys from: https://app.revenuecat.com/
import { Platform } from 'react-native';

// RevenueCat API Keys
// Replace with your actual API keys from RevenueCat dashboard
export const REVENUECAT_API_KEY_IOS = 'appl_rKDSiiNeFdoWwsAdrepLivNStQx';
export const REVENUECAT_API_KEY_ANDROID = 'goog_RwYNGkAsxyQQHkWJqBzKATrXZyK';

// Platform detection helper
export const getRevenueCatApiKey = () => {
  if (Platform.OS === 'ios') {
    return REVENUECAT_API_KEY_IOS;
  } else if (Platform.OS === 'android') {
    return REVENUECAT_API_KEY_ANDROID;
  }
  return null;
};

export const PRODUCT_IDS = {
  SERIES_A: 'series_a', 
  SERIES_B: 'series_b',
  SERIES_C: 'series_c',
  SERIES_D: 'series_d',
};

// Entitlement IDs - These must match what you configured in RevenueCat
export const ENTITLEMENT_IDS = {
  SERIES_1: 'series_a_access',
  SERIES_2: 'series_b_access',
  SERIES_3: 'series_c_access',
  SERIES_4: 'series_d_access',
};

export default {
  iosApiKey: REVENUECAT_API_KEY_IOS,
  androidApiKey: REVENUECAT_API_KEY_ANDROID,
  productIds: PRODUCT_IDS,
};