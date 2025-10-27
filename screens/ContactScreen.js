import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ContactScreen = ({
  onMenuPress,
  isMenuVisible,
  onCloseMenu,
  onNavigate,
  currentScreen,
  onBack,
  showBack
}) => {

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
          <Text style={styles.title}>للتواصل معنا</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.text}>
            للكتب يُطلب من{'\n'} مكتبة مجلَّة مرقس القاهرة:{'\n'} 28 شارع شبرا - القاهرة
          </Text>
          <Text style={styles.text}>
            25770614 والمكتبات {'\n'} المسيحيَّة والكنسيَّة كما {'\n'} يُطلب من الأستاذ المحاسب {'\n'} مينا سمير أنطون
          </Text>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={[styles.button, styles.emailButton]} onPress={handleCall}>
              <Ionicons name="call-outline" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Contact</Text>
            </TouchableOpacity>

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
    textAlign: 'right',
    width: '100%',
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