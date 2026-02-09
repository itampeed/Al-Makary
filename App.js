import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, BackHandler, LogBox } from 'react-native';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import LecturesScreen from './screens/LecturesScreen';
import LibraryScreen from './screens/LibraryScreen';

import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import ContactScreen from './screens/ContactScreen';
import MyAccountScreen from './screens/MyAccountScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
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
import BookReaderScreen from './screens/BookReaderScreen';
import { initializeRevenueCat, setupCustomerInfoListener } from './services/revenuecat';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ContentProvider } from './contexts/ContentContext';
import Colors from './constants/Colors';

// Ignore common timer warnings if any
LogBox.ignoreLogs(['Setting a timer']);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState(['home']);

  useEffect(() => {
    console.log("App mounted. Initializing..."); 
    // Initialize RevenueCat anonymously on app launch
    const initRC = async () => {
        try {
            await initializeRevenueCat(); 
            console.log("RevenueCat initialized");

            // Setup global listener for real-time updates
            setupCustomerInfoListener((info) => {
                console.log("[App.js] Listener received update:", JSON.stringify(info?.entitlements?.active, null, 2));
            });
        } catch (e) {
            console.log("Failed to init RC", e);
        }
    };
    initRC();
  }, []);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  const handleNavigate = (screen) => {
    if (screen !== currentScreen) {
        setNavigationHistory(prev => [...prev, screen]);
        setCurrentScreen(screen);
    }
    setIsMenuVisible(false);
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
        const newHistory = [...navigationHistory];
        newHistory.pop(); // remove current
        const previousScreen = newHistory[newHistory.length - 1];
        setNavigationHistory(newHistory);
        setCurrentScreen(previousScreen);
        return true;
    }
    return false; // Exit app if at root
  };

  useEffect(() => {
    const backAction = () => {
      if (isMenuVisible) {
        setIsMenuVisible(false);
        return true;
      }
      return handleBack();
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [isMenuVisible, navigationHistory]);


  const renderCurrentScreen = () => {
    const commonProps = {
      onMenuPress: () => setIsMenuVisible(true),
      isMenuVisible: isMenuVisible,
      onCloseMenu: () => setIsMenuVisible(false),
      onNavigate: handleNavigate,
      currentScreen: currentScreen,
      onBack: handleBack,
      showBack: navigationHistory.length > 1
    };

    if (currentScreen.startsWith('reader:')) {
      const pdfUrl = decodeURIComponent(currentScreen.split('reader:')[1]);
      return <BookReaderScreen {...commonProps} pdfUrl={pdfUrl} />;
    }

    switch (currentScreen) {
      case 'home':
        return <HomeScreen {...commonProps} />;
      case 'about':
        return <AboutScreen {...commonProps} />;
      case 'lectures':
        return <LecturesScreen {...commonProps} />;
      case 'library':
        return <LibraryScreen {...commonProps} />;

      case 'privacy-policy':
        return <PrivacyPolicyScreen {...commonProps} />;
      case 'contact':
        return <ContactScreen {...commonProps} />;
      case 'account':
      case 'myAccount': // handle both keys just in case
        return <MyAccountScreen {...commonProps} />;
      case 'subscription':
        return <SubscriptionScreen {...commonProps} />;
        
      // Book Series
      case 'book-first':
        return <FirstBookScreen {...commonProps} />;
      case 'book-second':
        return <SecondBookScreen {...commonProps} />;
      case 'book-third':
        return <ThirdBookScreen {...commonProps} />;
      case 'book-fourth':
        return <FourthBookScreen {...commonProps} />;

      // Lectures
      case 'lecture-1': return <Lecture1 {...commonProps} />;
      case 'lecture-2': return <Lecture2 {...commonProps} />;
      case 'lecture-3': return <Lecture3 {...commonProps} />;
      case 'lecture-4': return <Lecture4 {...commonProps} />;
      case 'lecture-5': return <Lecture5 {...commonProps} />;
      case 'lecture-6': return <Lecture6 {...commonProps} />;
      case 'lecture-7': return <Lecture7 {...commonProps} />;
      case 'lecture-8': return <Lecture8 {...commonProps} />;
      case 'lecture-9': return <Lecture9 {...commonProps} />;
      case 'lecture-10': return <Lecture10 {...commonProps} />;

      default:
        return <HomeScreen {...commonProps} />;
    }
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <ContentProvider>
            <View style={styles.container}>
            <StatusBar style="light" backgroundColor={Colors.header} />
            {isLoading ? (
                <SplashScreen onFinish={handleSplashFinish} />
            ) : (
                renderCurrentScreen()
            )}
            </View>
        </ContentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
