
import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import Layout from '../../components/Layout';
import Footer from '../../components/Footer';
import Colors from '../../constants/Colors';
import { useLanguage } from '../../contexts/LanguageContext';
import { fetchCatalogFromSupabase } from '../../services/supabaseContent';
import { hasActiveEntitlement } from '../../services/revenuecat';

const SecondBookScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const [hasAccess, setHasAccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [books, setBooks] = React.useState([]);
  const { t, isRTL } = useLanguage();

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [access, catalog] = await Promise.all([
        hasActiveEntitlement('series_2'),
        fetchCatalogFromSupabase()
      ]);
      
      setHasAccess(access);
      setBooks(catalog.filter(b => b.series === '2'));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (book) => {
    if (!hasAccess) {
      Alert.alert(
        t('subscriptionRequired'),
        t('subscriptionRequiredMsg'),
        [
          { text: t('cancel'), style: "cancel" },
          { text: t('subscribe'), onPress: () => onNavigate('subscription') }
        ]
      );
    } else {
      const route = `reader:${encodeURIComponent(book.pdfUrl)}`;
      onNavigate(route);
    }
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
                resizeMode="cover" 
              />
              <Text style={styles.bookTitle}>{book.title}</Text>
              {book.description && <Text style={styles.bookDescription} numberOfLines={2}>{book.description}</Text>}
            </TouchableOpacity>
          ))}
          {books.length === 0 && (
            <Text style={styles.noBooksText}>{t('noBooks')}</Text>
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
  },
  bookCover: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  bookTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Colors.header,
    textAlign: 'center',
    marginBottom: 4,
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
});

export default SecondBookScreen;

