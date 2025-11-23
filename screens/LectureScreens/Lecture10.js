import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Layout from '../../components/Layout';
import Footer from '../../components/Footer';
import Colors from '../../constants/Colors';

const Lecture10 = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
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
          <Text style={styles.title}>محاضرة 10</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.paragraph}>محتوى محاضرة 10...</Text>
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

export default Lecture10;

