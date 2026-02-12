
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import Layout from '../../components/Layout';
import Footer from '../../components/Footer';
import Colors from '../../constants/Colors';
import { useLanguage } from '../../contexts/LanguageContext';
import { hasSeriesAccess } from '../../services/revenuecat';
import { useContent } from '../../contexts/ContentContext';

import { useAuth } from '../../contexts/AuthContext';
import BookDetailModal from '../../components/BookDetailModal';

const SecondBookScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const [hasAccess, setHasAccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [selectedBook, setSelectedBook] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [languageFilter, setLanguageFilter] = React.useState('Arabic'); // null = all, 'English', 'Arabic'
  
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const { books: allBooks } = useContent();

  const books = useMemo(() => {
    const seriesBooks = allBooks.filter(b => b.series === '2');
    if (!languageFilter) return seriesBooks;
    return seriesBooks.filter(b => b.language === languageFilter);
  }, [allBooks, languageFilter]);

  React.useEffect(() => {
    console.log('SecondBookScreen mounted or user changed, reloading data...');
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      // access check
      const access = await hasSeriesAccess('2');
      setHasAccess(access);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  const handleReadPress = () => {
    setModalVisible(false);
    if (selectedBook) {
      const route = `reader:${encodeURIComponent(selectedBook.pdfUrl)}`;
      onNavigate(route);
    }
  };

  const handleSubscribePress = () => {
     setModalVisible(false);
     onNavigate('subscription');
  };

  if (loading) {
     return (
       <Layout onMenuPress={onMenuPress} isMenuVisible={isMenuVisible} onCloseMenu={onCloseMenu} onNavigate={onNavigate} currentScreen={currentScreen} onBack={onBack} showBack={showBack}>
         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
           <ActivityIndicator size="large" color={Colors.header} />
         </View>
       </Layout>
     );
  }

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
          <Text style={styles.title}>{t('series2')}</Text>
          <Text style={styles.subtitle}>{t('series2Subtitle')}</Text>
        </View>

        {/* Language Filter */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, languageFilter === 'English' && styles.filterButtonActive]}
            onPress={() => setLanguageFilter(languageFilter === 'English' ? null : 'English')}
          >
            <Text style={[styles.filterButtonText, languageFilter === 'English' && styles.filterButtonTextActive]}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, languageFilter === 'Arabic' && styles.filterButtonActive]}
            onPress={() => setLanguageFilter(languageFilter === 'Arabic' ? null : 'Arabic')}
          >
            <Text style={[styles.filterButtonText, languageFilter === 'Arabic' && styles.filterButtonTextActive]}>العربية</Text>
          </TouchableOpacity>
        </View>

        {!hasAccess && (
          <View style={styles.lockedBanner}>
            <Text style={styles.lockedText}>{t('lockedBanner')}</Text>
            <TouchableOpacity style={styles.subscribeButtonSmall} onPress={() => onNavigate('subscription')}>
              <Text style={styles.subscribeButtonText}>{t('subscribeShort')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.gridContainer}>
          {books.map((book, index) => (
            <TouchableOpacity key={index} style={styles.bookItem} onPress={() => handleBookPress(book)}>
              <Image 
                source={book.coverUrl ? { uri: book.coverUrl } : require('../../assets/icon.png')} 
                style={styles.bookCover} 
                contentFit="contain"
                transition={200}
                cachePolicy="memory-disk"
              />
              <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
              {book.author && <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>}
              
              <View style={styles.metaContainer}>
                {book.pages && <Text style={styles.bookMeta}>{book.pages} {t('pages') || 'Pages'}</Text>}
                {book.pages && book.language && <Text style={styles.bookMetaSep}>•</Text>}
                {book.language && <Text style={styles.bookMeta}>{book.language}</Text>}
              </View>

              {/* {book.description && <Text style={styles.bookDescription} numberOfLines={2}>{book.description}</Text>} */}
            </TouchableOpacity>
          ))}
          {books.length === 0 && (
            <Text style={styles.noBooksText}>{t('noBooks')}</Text>
          )}
        </View>

        <Footer />
      </ScrollView>

      <BookDetailModal 
        visible={modalVisible}
        book={selectedBook}
        onClose={() => setModalVisible(false)}
        onRead={handleReadPress}
        onSubscribe={handleSubscribePress}
        hasAccess={hasAccess}
      />
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
  subtitle: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 4,
  },
  lockedBanner: {
    backgroundColor: '#fff3cd',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeeba',
    alignItems: 'center',
  },
  lockedText: {
    color: '#856404',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  subscribeButtonSmall: {
    backgroundColor: Colors.header,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  bookItem: {
    width: '48%',
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  bookCover: {
    width: '100%',
    height: 200, 
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  bookTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Colors.header,
    textAlign: 'center',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  bookMeta: {
    fontSize: 11,
    color: '#666',
  },
  bookMetaSep: {
    fontSize: 11,
    color: '#666',
    marginHorizontal: 4,
  },
  bookDescription: {
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
  },
  noBooksText: {
    textAlign: 'center',
    width: '100%',
    padding: 20,
    fontStyle: 'italic',
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
    paddingHorizontal: 20,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.header,
    borderColor: Colors.header,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SecondBookScreen;

