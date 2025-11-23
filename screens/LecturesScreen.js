import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';

// Sample 10 books
const Lectures = [
  { id: 2, cover: require('../assets/book2.jpg'), title: 'كتاب الكنيسة والعذراء مريم' },
  { id: 1, cover: require('../assets/book1.jpg'), title: 'كتاب 1يسوع المسيح وتعاليمه' },
  { id: 4, cover: require('../assets/book4.jpg'), title: 'كتاب قوانين الكنيسة' },
  { id: 3, cover: require('../assets/book3.jpg'), title: 'الإيمان والعقيدة' },
  { id: 6, cover: require('../assets/book2.jpg'), title: 'أسرار الكنيسة' },
  { id: 5, cover: require('../assets/book1.jpg'), title: 'صلوات الكنيسة' },
  { id: 8, cover: require('../assets/book4.jpg'), title: 'أعياد الكنيسة' },
  { id: 7, cover: require('../assets/book3.jpg'), title: 'أصوام الكنيسة' },
  { id: 10, cover: require('../assets/book2.jpg'), title: 'الأبحاث وموضوعات عامة' },
  { id: 9, cover: require('../assets/book1.jpg'), title: 'التَّاريخ اللِّيتورجي لكنيسة الإسكندريَّة' },
];

const LecturesScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const handleBookPress = (book) => {
    const mapping = {
      1: 'lecture-1',
      2: 'lecture-2',
      3: 'lecture-3',
      4: 'lecture-4',
      5: 'lecture-5',
      6: 'lecture-6',
      7: 'lecture-7',
      8: 'lecture-8',
      9: 'lecture-9',
      10: 'lecture-10',
    };
    const routeKey = mapping[book.id];
    if (routeKey) {
      onNavigate(routeKey);
    }
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
          <Text style={styles.title}>محاضرات الراهب أثناسيوس المقاري</Text>
        </View>
        
        {/* Books Grid */}
        <View style={styles.gridContainer}>
          {Lectures.map((book) => (
            <TouchableOpacity 
              key={book.id} 
              style={styles.bookItem} 
              onPress={() => handleBookPress(book)}
            >
              <Image source={book.cover} style={styles.bookCover} resizeMode="cover" />
              <Text style={styles.bookTitle}>{book.title}</Text>
            </TouchableOpacity>
          ))}
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  bookItem: {
    width: '48%', // 3 columns per row
    marginBottom: 20,
    alignItems: 'center',
  },
  bookCover: {
    width: '90%',
    height: 150,
    aspectRatio: 1, // square
    borderRadius: 8,
    marginBottom: 5,
  },
  bookTitle: {
    fontSize: 12,
    color: Colors.header,
    textAlign: 'center',
  },
});

export default LecturesScreen;