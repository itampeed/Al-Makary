import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';

const HomeScreen = ({ onNavigate, currentScreen, onBack, showBack, onMenuPress, isMenuVisible, onCloseMenu }) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Updates.reloadAsync();
    } finally {
      setRefreshing(false);
    }
  }, []);

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
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.grid}>
          <View style={styles.section}>
            <Image 
              source={require('../assets/IMG_32673B75A9C0-22.jpg')} 
              style={styles.sectionImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.sectionButton} onPress={() => onNavigate('library')}>
              <Text style={styles.sectionText}>الكتب</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Image 
              source={require('../assets/IMG_32673B75A9C0-21.jpg')} 
              style={styles.sectionImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.sectionButton} onPress={() => onNavigate('library')}>
              <Text style={styles.sectionText}>مخطوطات و مراجع الكتب</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Image 
              source={require('../assets/All Books.jpg')} 
              style={styles.sectionImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.sectionButton} onPress={() => Linking.openURL('https://www.amazon.com/s?i=stripbooks&rh=p_27%3AFr.%2BAthanasius%2Bal-Makary&s=relevancerank&text=Fr.+Athanasius+al-Makary&ref=dp_byline_sr_book_1')}>
              <Text style={styles.sectionText}>كتب مترجمة للإنجليزية</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Image 
              source={require('../assets/IMG_32673B75A9C0-12.jpg')} 
              style={styles.sectionImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.sectionButton} onPress={() => onNavigate('library')}>
              <Text style={styles.sectionText}>المحاضرات</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Image 
              source={require('../assets/IMG_32673B75A9C0-23.jpg')} 
              style={styles.sectionImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.sectionButton} onPress={() => onNavigate('library')}>
              <Text style={styles.sectionText}>مختارات من المحاضرات</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Image 
              source={require('../assets/IMG_32673B75A9C0-10.jpg')} 
              style={styles.sectionImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.sectionButton} onPress={() => onNavigate('library')}>
              <Text style={styles.sectionText}>قداسات و ألحان</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.socialsContainer}>
          <Text style={styles.socialsTitle}>تابعنا</Text>
          <View style={styles.socialsRow}>
            <TouchableOpacity style={styles.socialIconButton} onPress={() => Linking.openURL('https://facebook.com')}>
              <Ionicons name="logo-facebook" size={28} color={Colors.header} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIconButton} onPress={() => Linking.openURL('https://youtube.com')}>
              <Ionicons name="logo-youtube" size={28} color={Colors.header} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIconButton} onPress={() => Linking.openURL('https://instagram.com')}>
              <Ionicons name="logo-instagram" size={28} color={Colors.header} />
            </TouchableOpacity>
          </View>
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
  grid: {
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  sectionText: {
    fontSize: 16,
    color: Colors.activeText,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  socialsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  socialsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.header,
    marginBottom: 10,
    textAlign: 'center',
  },
  socialsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialIconButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    color: Colors.activeText,
    fontSize: 22,
  },
});

export default HomeScreen;
