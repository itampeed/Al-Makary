import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';
import { fetchCatalogFromSupabase } from '../services/supabaseContent';
import { getOfferings, purchasePackage, getCustomerInfo } from '../services/revenuecat';
import { useLanguage } from '../contexts/LanguageContext';

// Map series IDs to RevenueCat Entitlement Identifiers
// Adjust these if your RevenueCat configuration differs
const SERIES_ENTITLEMENTS = {
  '1': 'series_1',
  '2': 'series_2',
  '3': 'series_3',
  '4': 'series_4',
};

const SubscriptionScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const [loading, setLoading] = useState(true);
  const [seriesData, setSeriesData] = useState({});
  const [offerings, setOfferings] = useState([]);
  const [activeEntitlements, setActiveEntitlements] = useState({});
  const [processingParams, setProcessingParams] = useState(null); // { seriesId: string }
  
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    loadData();
  }, [t]); // Reload data if language changes to ensuring titles update if we relied on state (but here we map dynamically in render)

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Content from Supabase
      const catalog = await fetchCatalogFromSupabase();
      const books = catalog.books || [];

      // Group books by series
      // Use t() for localized titles
      const grouped = {
        '1': { title: `${t('series1')}: ${t('series1Subtitle')}`, books: [] },
        '2': { title: `${t('series2')}: ${t('series2Subtitle')}`, books: [] },
        '3': { title: `${t('series3')}: ${t('series3Subtitle')}`, books: [] },
        '4': { title: `${t('series4')}: ${t('series4Subtitle')}`, books: [] },
      };

      books.forEach(book => {
        if (book.series && grouped[book.series]) {
          grouped[book.series].books.push(book);
        }
      });
      setSeriesData(grouped);
      
      // 2. Fetch RevenueCat Offerings
      const offeringsData = await getOfferings();
      if (offeringsData.current && offeringsData.current.availablePackages) {
        setOfferings(offeringsData.current.availablePackages);
      }

      // 3. Check Current Entitlements
      const info = await getCustomerInfo();
      setActiveEntitlements(info.entitlements.active);

    } catch (error) {
      console.error('Error loading subscription data:', error);
      Alert.alert('Error', 'Failed to load subscription data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (seriesId) => {
    const entitlementId = SERIES_ENTITLEMENTS[seriesId];
    if (!entitlementId) return;

    // specific package for this series
    // Assumption: Package identifier contains series ID (e.g., "series_1_monthly")
    // Or you can map seriesId to specific package identifiers if they are strict.
    // For now, we will try to find a package that matches the entitlement.
    // Since RevenueCat offerings map packages -> products -> entitlements, we need to pick the right package.
    // Simple heuristic: Look provided package identifier or product identifier containing 'series_X'
    
    const pkg = offerings.find(p => p.product.identifier.includes(`series_${seriesId}`));
    
    if (!pkg) {
      Alert.alert(t('unavailable'), 'Subscription for this series is currently unavailable.');
      return;
    }

    try {
      setProcessingParams({ seriesId });
      const { customerInfo } = await purchasePackage(pkg);
      
      // Update local state
      setActiveEntitlements(customerInfo.entitlements.active);
      Alert.alert('Success', 'You have successfully subscribed!');
    } catch (error) {
      if (!error.userCancelled) {
        Alert.alert('Error', error.message || 'Purchase failed.');
      }
    } finally {
      setProcessingParams(null);
    }
  };

  const renderSeriesCard = (seriesId) => {
    const data = seriesData[seriesId];
    if (!data) return null;

    const entitlementId = SERIES_ENTITLEMENTS[seriesId];
    const isSubscribed = activeEntitlements[entitlementId] !== undefined;
    
    // Find price
    const pkg = offerings.find(p => p.product.identifier.includes(`series_${seriesId}`));
    const priceString = pkg ? pkg.product.priceString : 'N/A';
    
    return (
      <View key={seriesId} style={styles.card}>
        <View style={[styles.cardHeader, isRTL ? styles.rowReverse : styles.row]}>
            <Text style={[styles.seriesTitle, isRTL ? styles.textRight : styles.textLeft]}>
            {data.title}
          </Text>
          {isSubscribed && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{t('subscribedBadge')}</Text>
            </View>
          )}
        </View>

        {/* Books Preview */}
        <ScrollView horizontal style={styles.booksScroll} showsHorizontalScrollIndicator={false} contentContainerStyle={isRTL ? styles.rtlScroll : null}>
          {data.books.map((book, index) => (
            <View key={index} style={styles.bookPreview}>
              <Image 
                source={book.coverUrl ? { uri: book.coverUrl } : require('../assets/book1.jpg')} 
                style={styles.bookCover}
                resizeMode="cover"
              />
              <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.cardFooter}>
           {isSubscribed ? (
             <TouchableOpacity style={[styles.button, styles.subscribedButton]} disabled>
               <Text style={styles.buttonText}>{t('subscribedButton')}</Text>
             </TouchableOpacity>
           ) : (
             <TouchableOpacity 
               style={styles.button}
               onPress={() => handleSubscribe(seriesId)}
               disabled={!pkg || processingParams?.seriesId === seriesId}
             >
               {processingParams?.seriesId === seriesId ? (
                 <ActivityIndicator color="#fff" />
               ) : (
                 <Text style={styles.buttonText}>
                   {t('subscribeNow')} {pkg ? `(${priceString})` : `(${t('unavailable')})`}
                 </Text>
               )}
             </TouchableOpacity>
           )}
        </View>
      </View>
    );
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
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>{t('subscriptionsTitle')}</Text>
          <Text style={styles.subTitle}>{t('subscriptionsSubtitle')}</Text>
        </View>
        

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.header} />
            <Text style={styles.loaderText}>{t('loadingData')}</Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {offerings.length > 0 ? (
                offerings
                .map(pkg => {
                    // unexpected identifier format handling
                    // Expected format: series_1_monthly, series_1, etc.
                    // We extract the first number found or look for "series_X"
                    const match = pkg.product.identifier.match(/series_(\d+)/i);
                    const seriesId = match ? match[1] : null;

                    // If we can't map it to a series we have content for, skip it
                    if (!seriesId || !seriesData[seriesId]) return null;

                    return { pkg, seriesId };
                })
                .filter(Boolean) // remove nulls
                .sort((a, b) => parseInt(a.seriesId) - parseInt(b.seriesId)) // Sort by series ID
                .map(({ seriesId }) => renderSeriesCard(seriesId))
            ) : (
                 <Text style={{textAlign: 'center', marginTop: 20, color: Colors.text}}>
                    {t('unavailable')}
                 </Text>
            )}
            
            {/* Fallback/Dev check: If no packages found, maybe show hardcoded for now? 
                User requested "not hardcoded ones", so we stick to strictly what RC returns. */
            }
          </View>
        )}

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
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.header,
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  loaderContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: Colors.text,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  row: {
      flexDirection: 'row',
  },
  rowReverse: {
      flexDirection: 'row-reverse',
  },
  seriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.header,
    flex: 1,
  },
  textRight: {
      textAlign: 'right',
  },
  textLeft: {
      textAlign: 'left',
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  booksScroll: {
    marginBottom: 16,
  },
  rtlScroll: {
      flexDirection: 'row-reverse',
  },
  bookPreview: {
    width: 100,
    marginRight: 10,
    alignItems: 'center',
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginBottom: 4,
    backgroundColor: '#eee',
  },
  bookTitle: {
    fontSize: 10,
    textAlign: 'center',
    color: Colors.text,
  },
  cardFooter: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.header,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  subscribedButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubscriptionScreen;
