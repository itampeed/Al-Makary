import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import LecturesScreen from './screens/LecturesScreen';
import LibraryScreen from './screens/LibraryScreen';
import ReturnPolicyScreen from './screens/ReturnPolicyScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import ContactScreen from './screens/ContactScreen';
import MyAccountScreen from './screens/MyAccountScreen';
import ShoppingCartScreen from './screens/ShoppingCartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import ShopScreen from './screens/ShopScreen';
import PurchasedScreen from './screens/PurchasedScreen';
import BookReaderScreen from './screens/BookReaderScreen';
import FirstBookScreen from './screens/booksscreen/First';
import SecondBookScreen from './screens/booksscreen/Second';
import ThirdBookScreen from './screens/booksscreen/Third';
import FourthBookScreen from './screens/booksscreen/Fourth';
import Lecture1 from './screens/LectureScreens/Lecture1';
import Lecture2 from './screens/LectureScreens/Lecture2';
import Lecture3 from './screens/LectureScreens/Lecture3';
import Lecture4 from './screens/LectureScreens/Lecture4';
import Lecture5 from './screens/LectureScreens/Lecture5';
import Lecture6 from './screens/LectureScreens/Lecture6';
import Lecture7 from './screens/LectureScreens/Lecture7';
import Lecture8 from './screens/LectureScreens/Lecture8';
import Lecture9 from './screens/LectureScreens/Lecture9';
import Lecture10 from './screens/LectureScreens/Lecture10';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import Colors from './constants/Colors';
import { initializeRevenueCat } from './services/revenuecat';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState(['home']);
  const currentScreen = history[history.length - 1];
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Initialize RevenueCat when app starts
  useEffect(() => {
    initializeRevenueCat().catch((error) => {
      console.error('Failed to initialize RevenueCat:', error);
    });
  }, []);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  const handleNavigate = (screenKey) => {
    setHistory(prev => [...prev, screenKey]);
  };

  const handleBack = () => {
    setHistory(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.slice(0, -1);
      return next;
    });
  };

  const handleToggleMenu = () => {
    setIsMenuVisible(prev => !prev);
  };

  const handleCloseMenu = () => {
    setIsMenuVisible(false);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'about':
        return <AboutScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'shop':
        return <ShopScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'lectures':
        return <LecturesScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'lecture-1':
        return <Lecture1 onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'lecture-2':
        return <Lecture2 onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'lecture-3':
        return <Lecture3 onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'lecture-4':
        return <Lecture4 onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'lecture-5':
        return <Lecture5 onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'lecture-6':
        return <Lecture6 onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'lecture-7':
        return <Lecture7 onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'lecture-8':
        return <Lecture8 onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'lecture-9':
        return <Lecture9 onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'lecture-10':
        return <Lecture10 onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'library':
        return <LibraryScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'book-first':
        return <FirstBookScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'book-second':
        return <SecondBookScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'book-third':
        return <ThirdBookScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'book-fourth':
        return <FourthBookScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'return-policy':
        return <ReturnPolicyScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'privacy-policy':
        return <PrivacyPolicyScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'contact':
        return <ContactScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'account':
        return <MyAccountScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'cart':
        return <ShoppingCartScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'checkout':
        return <CheckoutScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      case 'purchased':
        return <PurchasedScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
      default:
        // Support pseudo-route for reader:localUri
        if (currentScreen.startsWith('reader:')) {
          return <BookReaderScreen routeParam={currentScreen} onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={true} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
        }
        return <HomeScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} onMenuPress={handleToggleMenu} isMenuVisible={isMenuVisible} onCloseMenu={handleCloseMenu} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <View style={styles.container}>
          <StatusBar style="light" backgroundColor={Colors.header} />
          {isLoading ? (
            <SplashScreen onFinish={handleSplashFinish} />
          ) : (
            renderCurrentScreen()
          )}
        </View>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
