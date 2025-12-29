import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';
import { useLanguage } from '../contexts/LanguageContext';

const AboutScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const { t, isRTL } = useLanguage();

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
        {/* Page Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('aboutTitle')}</Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.heading, isRTL ? styles.textRight : styles.textLeft]}>
            {t('libraryMainTitle')}
          </Text>

          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('libraryIntro1')}
          </Text>

          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('libraryIntro2')}
          </Text>

          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('libraryIntro3')}
          </Text>

          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('libraryClosing1')}
          </Text>

          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
             {t('libraryClosing2')}
          </Text>

          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
             {t('libraryDate')}
          </Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
             {t('libraryAuthor')}
          </Text>
        </View>

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
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.header,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.header,
    lineHeight: 32,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 30,
    marginBottom: 15,
  },
  textRight: {
      textAlign: 'right',
  },
  textLeft: {
      textAlign: 'left',
  },
});

export default AboutScreen;