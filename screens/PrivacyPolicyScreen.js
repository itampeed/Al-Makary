import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPolicyScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
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
          <Text style={styles.title}>{t('privacyPolicyTitle')}</Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.heading, isRTL ? styles.textRight : styles.textLeft]}>{t('privacyHeading1')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('privacyText1')}
          </Text>

          <Text style={[styles.heading, isRTL ? styles.textRight : styles.textLeft]}>{t('privacyHeading2')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('privacyText2')}
          </Text>

          <Text style={[styles.heading, isRTL ? styles.textRight : styles.textLeft]}>{t('privacyHeading3')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('privacyText3')}
          </Text>

          <Text style={[styles.heading, isRTL ? styles.textRight : styles.textLeft]}>{t('privacyHeading4')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('privacyText4')}
          </Text>

          <Text style={[styles.heading, isRTL ? styles.textRight : styles.textLeft]}>{t('privacyHeading5')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
             {t('privacyText5')}
          </Text>

          <Text style={[styles.heading, isRTL ? styles.textRight : styles.textLeft]}>{t('privacyHeading6')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('privacyText6')}
          </Text>

          <Text style={[styles.heading, isRTL ? styles.textRight : styles.textLeft]}>{t('privacyHeading7')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('privacyText7')}
          </Text>

          <Text style={[styles.heading, isRTL ? styles.textRight : styles.textLeft]}>{t('privacyHeading8')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('privacyText8')}
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
    marginBottom: 20,
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
    marginBottom: 8,
    lineHeight: 30,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 28,
    marginBottom: 15,
  },
  textRight: {
      textAlign: 'right',
  },
  textLeft: {
      textAlign: 'left',
  },
});

export default PrivacyPolicyScreen;