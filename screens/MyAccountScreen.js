import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const MyAccountScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const { isAuthenticated, user, login, register, logout, isLoading, error, clearError } = useAuth();
  const { t, isRTL } = useLanguage();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotVisible, setForgotVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const ThemedModal = ({ visible, onRequestClose, title, children, primaryAction, secondaryAction }) => (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          {!!title && <Text style={styles.modalTitle}>{title}</Text>}
          <View>
            {children}
          </View>
          <View style={styles.modalActions}>
            {secondaryAction && (
              <TouchableOpacity style={styles.modalSecondaryBtn} onPress={secondaryAction.onPress} disabled={secondaryAction.disabled}>
                <Text style={styles.modalSecondaryText}>{secondaryAction.label}</Text>
              </TouchableOpacity>
            )}
            {primaryAction && (
              <TouchableOpacity style={[styles.modalPrimaryBtn, primaryAction.disabled && styles.submitButtonDisabled]} onPress={primaryAction.onPress} disabled={primaryAction.disabled}>
                <Text style={styles.modalPrimaryText}>{primaryAction.label}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) clearError();
  };

  const handleLogin = async () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      Alert.alert(t('loggedInSuccess'), t('welcome'));
    } else {
      Alert.alert('Login error', result.error || 'An unexpected error occurred');
    }
  };

  const handleRegister = async () => {
    if (!formData.email.trim() || !formData.password.trim() || !formData.name.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!confirmPassword.trim()) {
      Alert.alert('Error', 'Please confirm your password');
      return;
    }
    if (formData.password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match');
      return;
    }

    const result = await register(formData.email, formData.password, formData.name);
    if (result.success) {
      Alert.alert('Account created', 'Please verify your email before signing in.');
      // reset to login mode
      setIsLoginMode(true);
      setFormData({ email: formData.email, password: '', name: '' });
      setConfirmPassword('');
    } else {
      Alert.alert('Registration error', result.error || 'An unexpected error occurred');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('signOut'),
      t('signOut'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('signOut'), style: 'destructive', onPress: logout }
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
        {isLoginMode ? t('signIn') : t('createAccount')}
      </Text>
      
      {!isLoginMode && (
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, isRTL ? styles.textRight : styles.textLeft]}>{t('fullName')} *</Text>
          <TextInput
            style={[styles.textInput, isRTL ? styles.textRight : styles.textLeft]}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder={t('fullName')}
          />
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, isRTL ? styles.textRight : styles.textLeft]}>{t('emailLabel')} *</Text>
        <TextInput
          style={[styles.textInput, isRTL ? styles.textRight : styles.textLeft]}
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          placeholder="example@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, isRTL ? styles.textRight : styles.textLeft]}>{t('passwordLabel')} *</Text>
        <TextInput
          style={[styles.textInput, isRTL ? styles.textRight : styles.textLeft]}
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          placeholder={t('passwordLabel')}
          secureTextEntry
        />
      </View>

      {!isLoginMode && (
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, isRTL ? styles.textRight : styles.textLeft]}>{t('confirmPasswordLabel')} *</Text>
          <TextInput
            style={[styles.textInput, isRTL ? styles.textRight : styles.textLeft]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('confirmPasswordLabel')}
            secureTextEntry
          />
        </View>
      )}

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
            ? t('processing')
            : isLoginMode 
              ? t('signIn') 
              : t('createAccount')
          }
        </Text>
      </TouchableOpacity>

      {isLoginMode && (
        <TouchableOpacity style={styles.forgotButton} onPress={() => { setForgotEmail(formData.email); setForgotVisible(true); }}>
          <Text style={styles.forgotText}>{t('forgotPassword')}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={styles.toggleButton}
        onPress={toggleMode}
      >
        <Text style={styles.toggleButtonText}>
          {isLoginMode 
            ? t('toggleSignUp') 
            : t('toggleSignIn')
          }
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderUserProfile = () => (
    <View style={styles.profileContainer}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>{t('welcome')}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <Text style={styles.loggedInText}>{t('loggedInSuccess')}</Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={[styles.featuresTitle, isRTL ? styles.textRight : styles.textLeft]}>{t('whatYouCanDo')}</Text>
        
        <View style={[styles.featureItem, isRTL ? styles.rowReverse : styles.row]}>
          <Text style={[styles.featureIcon, isRTL ? styles.ml12 : styles.mr12]}>📚</Text>
          <Text style={[styles.featureText, isRTL ? styles.textRight : styles.textLeft]}>{t('featureBrowse')}</Text>
        </View>
        
        <View style={[styles.featureItem, isRTL ? styles.rowReverse : styles.row]}>
          <Text style={[styles.featureIcon, isRTL ? styles.ml12 : styles.mr12]}>🎧</Text>
          <Text style={[styles.featureText, isRTL ? styles.textRight : styles.textLeft]}>{t('featureListen')}</Text>
        </View>
        
        <View style={[styles.featureItem, isRTL ? styles.rowReverse : styles.row]}>
          <Text style={[styles.featureIcon, isRTL ? styles.ml12 : styles.mr12]}>📖</Text>
          <Text style={[styles.featureText, isRTL ? styles.textRight : styles.textLeft]}>{t('featureRead')}</Text>
        </View>
        
        <View style={[styles.featureItem, isRTL ? styles.rowReverse : styles.row]}>
          <Text style={[styles.featureIcon, isRTL ? styles.ml12 : styles.mr12]}>🛒</Text>
          <Text style={[styles.featureText, isRTL ? styles.textRight : styles.textLeft]}>{t('featureBuy')}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.shopButton}
        onPress={() => onNavigate('shop')}
      >
        <Text style={styles.shopButtonText}>{t('shopNow')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>{t('signOut')}</Text>
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('myAccountTitle')}</Text>
        </View>
        
        {isAuthenticated ? renderUserProfile() : renderLoginForm()}

          <Footer />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal (Themed) */}
      <ThemedModal
        visible={forgotVisible}
        onRequestClose={() => setForgotVisible(false)}
        title={t('resetPassword')}
        primaryAction={{
          label: forgotLoading ? t('processing') : t('sendEmail'),
          disabled: forgotLoading,
          onPress: async () => {
            if (!forgotEmail.trim()) {
              Alert.alert(t('invalidEmail'), t('enterEmail'));
              return;
            }
            setForgotLoading(true);
            try {
              const { sendPasswordResetEmail } = require('../config/firebase').firebaseAuth;
              const res = await sendPasswordResetEmail(forgotEmail.trim());
              if (res.success) {
                Alert.alert(t('emailSent'), t('checkInbox'));
                setForgotVisible(false);
              } else {
                Alert.alert('Reset failed', res.error || 'Unable to send reset email');
              }
            } catch (e) {
              Alert.alert('Reset failed', 'Unable to send reset email');
            } finally {
              setForgotLoading(false);
            }
          }
        }}
        secondaryAction={{
          label: t('cancel'),
          onPress: () => setForgotVisible(false),
        }}
      >
        <Text style={styles.modalHint}>{t('enterEmail')}</Text>
        <TextInput
          style={[styles.textInput, isRTL ? styles.textRight : styles.textLeft]}
          value={forgotEmail}
          onChangeText={setForgotEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </ThemedModal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 40,
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
  forgotButton: {
    alignItems: 'center',
    marginBottom: 12,
  },
  forgotText: {
    color: Colors.header,
    fontSize: 14,
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
  },
  featureItem: {
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
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
  // Modal styles
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(53,21,6,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: Colors.background,
    width: '85%',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.header,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalHint: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  modalSecondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.accent,
    borderRadius: 8,
  },
  modalSecondaryText: {
    color: Colors.header,
    fontSize: 16,
    fontWeight: '600',
  },
  modalPrimaryBtn: {
    backgroundColor: Colors.header,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textRight: {
      textAlign: 'right',
  },
  textLeft: {
      textAlign: 'left',
  },
  row: {
      flexDirection: 'row',
  },
  rowReverse: {
      flexDirection: 'row-reverse',
  },
  mr12: {
      marginRight: 12,
  },
  ml12: {
      marginLeft: 12,
  },
});

export default MyAccountScreen;
