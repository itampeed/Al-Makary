// Stripe Checkout configuration (external flow)
// Replace these with your deployed Checkout URLs

export const CHECKOUT_BASE_URL = 'https://your-checkout-page.example.com/create-session';

// Deep link or universal link your Stripe success page will redirect back to
// Example for Expo/dev: yourapp://purchase-complete
export const RETURN_SUCCESS_URL = 'yourapp://purchase-complete';
export const RETURN_CANCEL_URL = 'yourapp://purchase-cancel';

// Stripe Configuration
// Replace with your actual Stripe keys
export const STRIPE_CONFIG = {
  // Test keys - replace with your actual keys
  publishableKey: 'pk_test_your_publishable_key_here',
  // For production, use: 'pk_live_your_live_publishable_key_here'
  
  // Your Stripe account settings
  merchantId: 'your_merchant_id_here',
  merchantDisplayName: 'Ritual Gem of Fr. Athanasius al-Makary',
  
  // Currency settings
  currency: 'USD',
  
  // Payment methods
  paymentMethods: ['card'],
  
  // Shipping settings
  shippingRequired: true,
  shippingOptions: [
    {
      id: 'free_shipping',
      label: 'شحن مجاني',
      detail: 'الشحن مجاني لجميع الطلبات',
      amount: 0,
    },
  ],
};

// Helper function to format price for Stripe
export const formatPriceForStripe = (price) => {
  // Stripe expects amounts in cents
  return Math.round(price * 100);
};

// Helper function to create payment intent data
export const createPaymentIntentData = (items, customerInfo) => {
  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  return {
    amount: formatPriceForStripe(totalAmount),
    currency: STRIPE_CONFIG.currency,
    metadata: {
      customer_email: customerInfo.email,
      customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
      items: JSON.stringify(items.map(item => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price
      })))
    }
  };
};