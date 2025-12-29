import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../constants/translations';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar'); // Default to Arabic

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('userLanguage');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.log('Error loading language', error);
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    try {
        await AsyncStorage.setItem('userLanguage', lang);
    } catch (error) {
        console.log('Error saving language', error);
    }
    // Note: We are NOT forcing I18nManager.forceRTL here to avoid full app restarts logic complexity for now,
    // handling layout via isRTL prop manually in components is often smoother for hot-switching.
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
