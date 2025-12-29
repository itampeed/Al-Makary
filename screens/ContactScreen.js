import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../contexts/LanguageContext';

const ContactScreen = ({
  onMenuPress,
  isMenuVisible,
  onCloseMenu,
  onNavigate,
  currentScreen,
  onBack,
  showBack
}) => {
  const { t, isRTL } = useLanguage();

  const handleCall = () => {
    Linking.openURL('tel:+201001116618');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:minasas2001@yahoo.com');
  };

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
          <Text style={styles.title}>{t('contactTitle')}</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('contactAddress')}
          </Text>
          <Text style={[styles.text, isRTL ? styles.textRight : styles.textLeft]}>
            {t('contactPerson')}
          </Text>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={[styles.button, styles.emailButton]} onPress={handleEmail}>
              <Ionicons name="mail-outline" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
        <Footer />
    </Layout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 20,
    height: '100%',
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
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    width: '100%',
  },
  textRight: {
      textAlign: 'right',
  },
  textLeft: {
      textAlign: 'left',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  callButton: {
    backgroundColor: Colors.primary,
  },
  emailButton: {
    backgroundColor: Colors.header,
  },
  icon: {
    marginRight: 6,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default ContactScreen;