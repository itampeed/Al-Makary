import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Layout from '../../components/Layout';
import Footer from '../../components/Footer';
import Colors from '../../constants/Colors';

const FourthBookScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
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
          <Text style={styles.title}>السِّلسلة الرَّابعة</Text>
          <Text style={styles.subtitle}>طقوس أصوام وأعياد الكنيسة</Text>
        </View>

        {/* TODO: Replace with actual book content */}
        <View style={styles.body}>
          <Text style={styles.paragraph}>محتوى السلسلة الرابعة...</Text>
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
  subtitle: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 4,
  },
  body: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  paragraph: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    textAlign: 'right',
  },
});

export default FourthBookScreen;

