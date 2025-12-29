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
import { initializeRevenueCat } from './services/revenuecat';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  // ... (rest of state items are unchanged)

  // ... (rest of functions are unchanged)

  useEffect(() => {
    // Initialize RevenueCat anonymously on app launch
    // AuthContext will handle identifying the user later if they are logged in
    const initRC = async () => {
        try {
            await initializeRevenueCat(); 
        } catch (e) {
            console.log("Failed to init RC", e);
        }
    };
    initRC();
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <View style={styles.container}>
          <StatusBar style="light" backgroundColor={Colors.header} />
          {isLoading ? (
            <SplashScreen onFinish={handleSplashFinish} />
          ) : (
            renderCurrentScreen()
          )}
        </View>
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
