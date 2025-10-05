import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';

// Placeholder books dataset (empty for now)
// When populated, this will be used to render the list/grid of books
const booksData = require('../assets/data/books.json');

const LibraryScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const hasBooks = Array.isArray(booksData?.books) && booksData.books.length > 0;

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
          <Text style={styles.title}>المكتبة</Text>
        </View>

        <View style={styles.contentContainer}>
          {hasBooks ? (
            <Text style={styles.placeholderText}>سيتم عرض الكتب هنا قريباً</Text>
          ) : (
            <Text style={styles.placeholderText}>لا توجد كتب حالياً</Text>
          )}
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
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
});

export default LibraryScreen;


