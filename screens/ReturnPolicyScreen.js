import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';
import { useLanguage } from '../contexts/LanguageContext';

const ReturnPolicyScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
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
          <Text style={styles.title}>{t('returnPolicyTitle')}</Text>
        </View>
        
        {/* Main Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.heading, isRTL ? styles.textRight : styles.textLeft]}>{t('salesPolicyHeading')}</Text>

          <Text style={[styles.subheading, isRTL ? styles.textRight : styles.textLeft]}>{t('salesPolicySub1')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('salesPolicyText1')}
          </Text>

          <Text style={[styles.subheading, isRTL ? styles.textRight : styles.textLeft]}>{t('salesPolicySub2')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('salesPolicyText2')}
          </Text>

          <Text style={[styles.subheading, isRTL ? styles.textRight : styles.textLeft]}>{t('salesPolicySub3')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('salesPolicyText3')}
          </Text>

          <Text style={[styles.heading, isRTL ? styles.textRight : styles.textLeft]}>{t('returnPolicyHeading')}</Text>

          <Text style={[styles.subheading, isRTL ? styles.textRight : styles.textLeft]}>{t('returnPolicySub1')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('returnPolicyText1')}
          </Text>

          <Text style={[styles.subheading, isRTL ? styles.textRight : styles.textLeft]}>{t('returnPolicySub2')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('returnPolicyText2')}
          </Text>

          <Text style={[styles.subheading, isRTL ? styles.textRight : styles.textLeft]}>{t('returnPolicySub3')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('returnPolicyText3')}
          </Text>

          <Text style={[styles.heading, isRTL ? styles.textRight : styles.textLeft]}>{t('contactUsHeading')}</Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('contactUsText')}
          </Text>

          <Text style={[styles.contact, isRTL ? styles.textRight : styles.textLeft]}>info@athanasiusalmakary.com</Text>
          <Text style={[styles.contact, isRTL ? styles.textRight : styles.textLeft]}>+201229574466</Text>
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
    marginBottom: 10,
    lineHeight: 30,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: 'gray',
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 28,
    marginBottom: 10,
  },
  contact: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 26,
  },
  textRight: {
      textAlign: 'right',
  },
  textLeft: {
      textAlign: 'left',
  },
});

export default ReturnPolicyScreen;