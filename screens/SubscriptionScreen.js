import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Platform, Linking } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';
import { fetchCatalogFromSupabase } from '../services/supabaseContent';
import { getOfferings, purchasePackage, getCustomerInfo } from '../services/revenuecat';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

// Map series IDs to RevenueCat Entitlement Identifiers
// Removed hardcoded map to allow dynamic matching (series_1 or series_a)

// Helper to check access based on active entitlements dictionary
const checkAccess = (activeEntitlements, seriesId) => {
  const map = { '1': 'a', '2': 'b', '3': 'c', '4': 'd' };
  const letter = map[seriesId];
  
  return Object.keys(activeEntitlements).some(key => {
    const lowerKey = key.toLowerCase();
    return lowerKey.includes(`series_${seriesId}`) || (letter && lowerKey.includes(`series_${letter}`));
  });
};

const getSeriesLetter = (id) => {
  const map = { '1': 'a', '2': 'b', '3': 'c', '4': 'd' };
  return map[id] || id;
}

const SubscriptionScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const [loading, setLoading] = useState(true);
  const [seriesData, setSeriesData] = useState({});
  const [offerings, setOfferings] = useState([]);
  const [activeEntitlements, setActiveEntitlements] = useState({});
  const [processingParams, setProcessingParams] = useState(null); // { seriesId: string }
  
  const { t, isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [t, isAuthenticated]); 

  if (!isAuthenticated) {
    return (
      <Layout onMenuPress={onMenuPress} isMenuVisible={isMenuVisible} onCloseMenu={onCloseMenu} onNavigate={onNavigate} currentScreen={currentScreen} onBack={onBack} showBack={showBack}>
        <View style={styles.centerContainer}>
          <Text style={styles.authMessage}>{t('loginToSubscribe') || 'Please log in to view subscriptions.'}</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => onNavigate('account')}>
            <Text style={styles.loginButtonText}>{t('login') || 'Log In'}</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  } 

  const loadData = async () => {
    setLoading(true);
    
    // Default series data with titles from translation
    const grouped = {
        '1': { title: `${t('series1')}: ${t('series1Subtitle')}`, books: [] },
        '2': { title: `${t('series2')}: ${t('series2Subtitle')}`, books: [] },
        '3': { title: `${t('series3')}: ${t('series3Subtitle')}`, books: [] },
        '4': { title: `${t('series4')}: ${t('series4Subtitle')}`, books: [] },
    };
    
    // Set initial data so cards appear
    setSeriesData(grouped);

    try {
      // 1. Fetch Content from Supabase (Non-blocking for UI)
      try {
          const catalog = await fetchCatalogFromSupabase();
          const books = catalog || [];
          
          books.forEach(book => {
            if (book.series && grouped[book.series]) {
              grouped[book.series].books.push(book);
            }
          });
          // Update method with books
          setSeriesData({...grouped}); 
      } catch (err) {
          console.log("Supabase fetch failed, using default titles", err);
      }
      
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (seriesId, pkg) => {
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

  const manageSubscription = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/account/subscriptions');
    } else {
      Linking.openURL('https://play.google.com/store/account/subscriptions');
    }
  };

  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const renderSeriesCard = (seriesId) => {
    const data = seriesData[seriesId];
    if (!data) return null;

    const isSubscribed = checkAccess(activeEntitlements, seriesId);
    const seriesLetter = getSeriesLetter(seriesId);
    
    // Improved matching logic: 
    // Match 'series_1' OR 'series_a' to support both naming conventions
    const pkg = offerings.find(p => 
      p.product.identifier.toLowerCase().includes(`series_${seriesId}`) || 
      p.product.identifier.toLowerCase().includes(`series_${seriesLetter}`)
    );
    
    const priceString = pkg ? pkg.product.priceString : '';
    const productTitle = pkg ? pkg.product.title : data.title;
    const productDesc = pkg ? pkg.product.description : t('subscriptionsSubtitle');
    const isAutoRenewing = pkg && pkg.product.subscriptionPeriod ? true : false; // Naive check

    return (
      <View key={seriesId} style={styles.card}>
        <View style={styles.cardContent}>
            <Text style={styles.seriesTitle}>{productTitle}</Text>
            {isAutoRenewing && <Text style={styles.autoRenewText}>(Auto-renewing)</Text>}
            
            <Text style={styles.description}>{productDesc}</Text>
            
            {/* Books Preview Removed as per user request */}

            <View style={styles.priceContainer}>
               <Text style={styles.priceText}>{pkg ? priceString : t('unavailable')}</Text>
            </View>

             <TouchableOpacity 
               style={[styles.button, isSubscribed ? styles.subscribedButton : null]}
               onPress={() => isSubscribed ? manageSubscription() : handleSubscribe(seriesId, pkg)}
               disabled={!isSubscribed && (!pkg || processingParams?.seriesId === seriesId)}
             >
               {processingParams?.seriesId === seriesId ? (
                 <ActivityIndicator color="#fff" />
               ) : (
                 <Text style={styles.buttonText}>
                   {isSubscribed ? (t('manageSubscription') || 'Manage Subscription') : t('subscribe')}
                 </Text>
               )}
             </TouchableOpacity>

             <View style={styles.cardLegalLinks}>
               <TouchableOpacity onPress={() => onNavigate('privacy-policy')}>
                  <Text style={styles.cardLegalLink}>{t('privacyPolicy')}</Text>
               </TouchableOpacity>
               
               {Platform.OS === 'ios' && (
                 <>
                   <Text style={styles.cardLinkSep}> • </Text>
                   <TouchableOpacity onPress={() => openLink('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>
                      <Text style={styles.cardLegalLink}>Terms of Use</Text>
                   </TouchableOpacity>
                 </>
               )}
             </View>
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
             {['1', '2', '3', '4'].map(id => renderSeriesCard(id))}
          </View>
        )}

        {/* Legal Links (iOS Only) */}
        {Platform.OS === 'ios' && (
          <View style={styles.legalLinksContainer}>
            <TouchableOpacity onPress={() => openLink('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>
              <Text style={styles.legalLink}>Terms of Use (EULA)</Text>
            </TouchableOpacity>
            <Text style={styles.linkSep}> | </Text>
            <TouchableOpacity onPress={() => onNavigate('privacy-policy')}> 
              <Text style={styles.legalLink}>{t('privacyPolicy')}</Text>
            </TouchableOpacity>
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
    backgroundColor: '#f8f9fa',
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
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
  },
  seriesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.header,
    textAlign: 'center',
    marginBottom: 4,
  },
  autoRenewText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  booksScroll: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  rtlScroll: {
      flexDirection: 'row-reverse',
  },
  bookPreview: {
    width: 90,
    marginRight: 12,
    alignItems: 'center',
  },
  bookCover: {
    width: 70,
    height: 105,
    borderRadius: 4,
    marginBottom: 6,
    backgroundColor: '#f0f0f0',
  },
  bookTitle: {
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.activeText,
  },
  button: {
    backgroundColor: Colors.header,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: Colors.header,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  subscribedButton: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  legalLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  legalLink: {
    color: '#007AFF', // Standard iOS blue link color
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authMessage: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: Colors.header,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkSep: {
    fontSize: 12,
    color: '#ccc',
    marginHorizontal: 8,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  cardLegalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  cardLegalLink: {
    fontSize: 12,
    color: '#666',
    textDecorationLine: 'underline',
  },
  cardLinkSep: {
    fontSize: 12,
    color: '#ccc',
    marginHorizontal: 5,
  },
});

export default SubscriptionScreen;

