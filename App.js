import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import HomePageScreen from './screens/HomePageScreen';
import AboutScreen from './screens/AboutScreen';
import BooksScreen from './screens/BooksScreen';
import BuyBooksScreen from './screens/BuyBooksScreen';
import LecturesScreen from './screens/LecturesScreen';
import LectureSelectionsScreen from './screens/LectureSelectionsScreen';
import ReturnPolicyScreen from './screens/ReturnPolicyScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import ContactScreen from './screens/ContactScreen';
import MyAccountScreen from './screens/MyAccountScreen';
import ShoppingCartScreen from './screens/ShoppingCartScreen';
import Colors from './constants/Colors';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState(['home']);
  const currentScreen = history[history.length - 1];

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

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} />;
      case 'homepage':
        return <HomePageScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} />;
      case 'about':
        return <AboutScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} />;
      case 'books':
        return <BooksScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} />;
      case 'buy-books':
        return <BuyBooksScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} />;
      case 'lectures':
        return <LecturesScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} />;
      case 'lecture-selections':
        return <LectureSelectionsScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} />;
      case 'return-policy':
        return <ReturnPolicyScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} />;
      case 'privacy-policy':
        return <PrivacyPolicyScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} />;
      case 'contact':
        return <ContactScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} />;
      case 'account':
        return <MyAccountScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} />;
      case 'cart':
        return <ShoppingCartScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} currentScreen={currentScreen} onBack={handleBack} showBack={currentScreen !== 'home'} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={Colors.header} />
      {isLoading ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        renderCurrentScreen()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
