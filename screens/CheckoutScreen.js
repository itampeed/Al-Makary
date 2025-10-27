import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CheckoutScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to account if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('account');
    }
  }, [isAuthenticated, onNavigate]);

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setCustomerInfo(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    for (const field of requiredFields) {
      if (!customerInfo[field].trim()) {
        Alert.alert('خطأ في البيانات', 'يرجى ملء جميع الحقول المطلوبة');
        return false;
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      Alert.alert('خطأ في البيانات', 'يرجى إدخال بريد إلكتروني صحيح');
      return false;
    }
    
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'تم الدفع بنجاح',
        'شكراً لك على الشراء! سيتم إرسال تفاصيل الطلب إلى بريدك الإلكتروني.',
        [
          {
            text: 'موافق',
            onPress: () => {
              clearCart();
              onNavigate('home');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('خطأ في الدفع', 'حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderOrderSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>ملخص الطلب</Text>
      {items.map((item) => (
        <View key={item.id} style={styles.summaryItem}>
          <Text style={styles.summaryItemName}>{item.title}</Text>
          <Text style={styles.summaryItemDetails}>
            {item.quantity} × ${item.price} = ${(item.quantity * item.price).toFixed(2)}
          </Text>
        </View>
      ))}
      <View style={styles.summaryTotal}>
        <Text style={styles.summaryTotalLabel}>المجموع الكلي:</Text>
        <Text style={styles.summaryTotalValue}>${getTotalPrice().toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <Layout 
      onMenuPress={onMenuPress} 
      isMenuVisible={isMenuVisible} 
      onCloseMenu={onCloseMenu}
      onNavigate={onNavigate}
      currentScreen={currentScreen}
      onBack={onBack}
      showBack={showBack}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>الدفع</Text>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => {
              logout();
              onNavigate('home');
            }}
          >
            <Text style={styles.logoutButtonText}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>
        
        {/* Customer Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>معلومات العميل</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>الاسم الأول *</Text>
              <TextInput
                style={styles.textInput}
                value={customerInfo.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                placeholder="أدخل الاسم الأول"
                textAlign="right"
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>الاسم الأخير *</Text>
              <TextInput
                style={styles.textInput}
                value={customerInfo.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                placeholder="أدخل الاسم الأخير"
                textAlign="right"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>البريد الإلكتروني *</Text>
            <TextInput
              style={styles.textInput}
              value={customerInfo.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              textAlign="right"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>رقم الهاتف *</Text>
            <TextInput
              style={styles.textInput}
              value={customerInfo.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="+1234567890"
              keyboardType="phone-pad"
              textAlign="right"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>العنوان *</Text>
            <TextInput
              style={styles.textInput}
              value={customerInfo.address}
              onChangeText={(value) => handleInputChange('address', value)}
              placeholder="أدخل العنوان الكامل"
              textAlign="right"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>المدينة *</Text>
              <TextInput
                style={styles.textInput}
                value={customerInfo.city}
                onChangeText={(value) => handleInputChange('city', value)}
                placeholder="أدخل المدينة"
                textAlign="right"
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>الرمز البريدي</Text>
              <TextInput
                style={styles.textInput}
                value={customerInfo.postalCode}
                onChangeText={(value) => handleInputChange('postalCode', value)}
                placeholder="12345"
                keyboardType="numeric"
                textAlign="right"
              />
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>طريقة الدفع</Text>
          <View style={styles.paymentMethod}>
            <Text style={styles.paymentMethodText}>💳 الدفع بالبطاقة الائتمانية (Stripe)</Text>
            <Text style={styles.paymentMethodSubtext}>آمن ومحمي</Text>
          </View>
        </View>

        {/* Order Summary */}
        {renderOrderSummary()}

        {/* Payment Button */}
        <TouchableOpacity 
          style={[styles.paymentButton, isProcessing && styles.paymentButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <Text style={styles.paymentButtonText}>
            {isProcessing ? 'جاري المعالجة...' : `دفع $${getTotalPrice().toFixed(2)}`}
          </Text>
        </TouchableOpacity>

        <Footer />
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 20,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.header,
    textAlign: 'center',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.header,
    marginBottom: 16,
    textAlign: 'right',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  paymentMethod: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.header,
    marginBottom: 4,
  },
  paymentMethodSubtext: {
    fontSize: 14,
    color: Colors.text,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.header,
    marginBottom: 16,
    textAlign: 'right',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryItemName: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  summaryItemDetails: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.header,
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.header,
  },
  paymentButton: {
    backgroundColor: Colors.header,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  paymentButtonDisabled: {
    backgroundColor: '#ccc',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
