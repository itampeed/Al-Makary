import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';
import { useLanguage } from '../contexts/LanguageContext';

// Sample book data (replace with your own)
// Note: Ideally this data should also come from translation or backend
const booksData = [
  { id: 2, cover: require('../assets/book2.jpg'), seriesKey: 'series2', subtitleKey: 'series2Subtitle' },
  { id: 1, cover: require('../assets/book1.jpg'), seriesKey: 'series1', subtitleKey: 'series1Subtitle' },
  { id: 4, cover: require('../assets/book4.jpg'), seriesKey: 'series4', subtitleKey: 'series4Subtitle' },
  { id: 3, cover: require('../assets/book3.jpg'), seriesKey: 'series3', subtitleKey: 'series3Subtitle' },
];

const LibraryScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const { t, isRTL } = useLanguage();

  const handleBookPress = (book) => {
    // Map book to its dedicated screen key
    let routeKey = null;
    switch (book.id) {
      case 1:
        routeKey = 'book-first';
        break;
      case 2:
        routeKey = 'book-second';
        break;
      case 3:
        routeKey = 'book-third';
        break;
      case 4:
        routeKey = 'book-fourth';
        break;
      default:
        routeKey = null;
    }
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

        {/* Original Page Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('library')}</Text>
        </View>

        {/* Image section */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/AllBooks.jpg')}
            style={styles.firstimage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/logos/right.png')}
            style={styles.secondimage}
            resizeMode="contain"
          />
        </View>

        {/* Main Title before Grid */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>
            {t('libraryMainTitle')}
          </Text>
        </View>

        {/* Book Grid */}
        <View style={styles.gridContainer}>
          {booksData.map((book) => (
            <TouchableOpacity key={book.id} style={styles.bookItem} onPress={() => handleBookPress(book)}>
              <Image source={book.cover} style={styles.bookCover} resizeMode="cover" />
              <Text style={styles.bookTitle}>{t(book.seriesKey)}</Text>
              <Text style={[styles.bookDescription, isRTL ? styles.textRight : styles.textLeft]}>{t(book.subtitleKey)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Paragraph Section */}
        <View style={styles.paragraphContainer}>
          <Text style={[styles.paragraphTitle, isRTL ? styles.textRight : styles.textLeft]}>
            {t('libraryMainTitle')}
          </Text>

          <Text style={[styles.paragraphText, isRTL ? styles.textRight : styles.textLeft]}>
            {t('libraryIntro1')}
          </Text>

          <Text style={[styles.paragraphText, isRTL ? styles.textRight : styles.textLeft]}>
            {t('libraryIntro2')}
          </Text>

          <Text style={[styles.paragraphText, isRTL ? styles.textRight : styles.textLeft]}>
            {t('libraryIntro3')}
          </Text>

          <Text style={[styles.paragraphText, isRTL ? styles.textRight : styles.textLeft]}>
            {t('libraryClosing1')}
          </Text>

          <Text style={[styles.paragraphText, isRTL ? styles.textRight : styles.textLeft]}>
            {t('libraryClosing2')}
          </Text>

          <Text style={[styles.paragraphText, isRTL ? styles.textRight : styles.textLeft]}>
            {t('libraryDate')}
          </Text>

          <Text style={[styles.paragraphText, isRTL ? styles.textRight : styles.textLeft]}>
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
    paddingTop: 10,
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
    marginBottom: 5,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.header,
  },
  imageContainer: {
    alignItems: 'center',
  },
  firstimage: {
    width: '90%',
    height: 100,
    borderRadius: 12,
  },
  secondimage: {
    height: 130,
    width: '80%',
    filter: 'invert(1)',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  bookItem: {
    width: '48%',
    marginBottom: 20,
    alignItems: 'center',
  },
  bookCover: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 5,
  },
  bookTitle: {
    fontWeight: '500',
    fontSize: 14,
    color: Colors.header,
  },
  bookDescription: {
    fontSize: 12,
    color: Colors.text,
  },
  paragraphContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  paragraphTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.header,
    marginBottom: 10,
  },
  paragraphText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 10,
    lineHeight: 22,
  },
  textRight: {
      textAlign: 'right',
  },
  textLeft: {
        textAlign: 'left',
  },
});

export default LibraryScreen;