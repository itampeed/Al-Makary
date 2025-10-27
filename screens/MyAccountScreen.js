import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';
import { useAuth } from '../contexts/AuthContext';

const MyAccountScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const { isAuthenticated, user, login, register, logout, isLoading, error, clearError } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) clearError();
  };

  const handleLogin = async () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      Alert.alert('تم تسجيل الدخول', 'مرحباً بك!');
    } else {
      Alert.alert('خطأ في تسجيل الدخول', result.error || 'حدث خطأ غير متوقع');
    }
  };

  const handleRegister = async () => {
    if (!formData.email.trim() || !formData.password.trim() || !formData.name.trim()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    const result = await register(formData.email, formData.password, formData.name);
    if (result.success) {
      Alert.alert('تم إنشاء الحساب', 'تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى التحقق من بريدك.');
    } else {
      Alert.alert('خطأ في إنشاء الحساب', result.error || 'حدث خطأ غير متوقع');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل تريد تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تسجيل الخروج', style: 'destructive', onPress: logout }
      ]
    );
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({ email: '', password: '', name: '' });
    clearError();
  };

  const renderLoginForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {isLoginMode ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
      </Text>
      
      {!isLoginMode && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>الاسم الكامل *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="أدخل اسمك الكامل"
            textAlign="right"
          />
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>البريد الإلكتروني *</Text>
        <TextInput
          style={styles.textInput}
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          placeholder="example@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          textAlign="right"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>كلمة المرور *</Text>
        <TextInput
          style={styles.textInput}
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          placeholder="أدخل كلمة المرور"
          secureTextEntry
          textAlign="right"
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={isLoginMode ? handleLogin : handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.submitButtonText}>
          {isLoading 
            ? 'جاري المعالجة...' 
            : isLoginMode 
              ? 'تسجيل الدخول' 
              : 'إنشاء الحساب'
          }
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.toggleButton}
        onPress={toggleMode}
      >
        <Text style={styles.toggleButtonText}>
          {isLoginMode 
            ? 'ليس لديك حساب؟ أنشئ حساب جديد' 
            : 'لديك حساب بالفعل؟ سجل دخولك'
          }
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderUserProfile = () => (
    <View style={styles.profileContainer}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>مرحباً بك!</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <Text style={styles.loggedInText}>تم تسجيل الدخول بنجاح</Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>ما يمكنك فعله:</Text>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📚</Text>
          <Text style={styles.featureText}>تصفح وشراء الكتب الروحية</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🎧</Text>
          <Text style={styles.featureText}>الاستماع للمحاضرات والتأملات</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📖</Text>
          <Text style={styles.featureText}>قراءة الكتب والمقالات</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🛒</Text>
          <Text style={styles.featureText}>إتمام عمليات الشراء بسهولة</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.shopButton}
        onPress={() => onNavigate('shop')}
      >
        <Text style={styles.shopButtonText}>تسوق الآن</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>تسجيل الخروج</Text>
      </TouchableOpacity>
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
          <Text style={styles.title}>حسابي</Text>
        </View>
        
        {isAuthenticated ? renderUserProfile() : renderLoginForm()}

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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.header,
    textAlign: 'center',
  },
  // Login Form Styles
  formContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
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
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.header,
    textAlign: 'center',
    marginBottom: 20,
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
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.header,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    alignItems: 'center',
  },
  toggleButtonText: {
    color: Colors.header,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  // User Profile Styles
  profileContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcomeContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.header,
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  loggedInText: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '500',
  },
  featuresContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.header,
    marginBottom: 16,
    textAlign: 'right',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  shopButton: {
    backgroundColor: Colors.header,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyAccountScreen;
