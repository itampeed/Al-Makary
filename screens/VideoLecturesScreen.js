import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import Layout from '../components/Layout';
import Colors from '../constants/Colors';
import { useLanguage } from '../contexts/LanguageContext';

const VideoLecturesScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const { t } = useLanguage();

  const lectures = [
    { id: 1, image: require('../assets/mahazrat/img01.png'), title: t('videoLecture1Title'), url: 'https://www.youtube.com/playlist?list=PLDTISUTAuz_xGQSK-iOrUwRH5v4QSY6QT' },
    { id: 2, image: require('../assets/mahazrat/img02.png'), title: t('videoLecture2Title'), url: 'https://www.youtube.com/playlist?list=PLDTISUTAuz_wuERI6QDNlhWww1tbnHWND' },
    { id: 3, image: require('../assets/mahazrat/img03.png'), title: t('videoLecture3Title'), url: 'https://www.youtube.com/playlist?list=PLDTISUTAuz_xEIb3L5sXOM2jp9UaGp6HW' },
    { id: 4, image: require('../assets/mahazrat/img04.png'), title: t('videoLecture4Title'), url: 'https://www.youtube.com/playlist?list=PLDTISUTAuz_xlTtuKoUSkw-mih_Wk17hu' },
    { id: 5, image: require('../assets/mahazrat/img05.png'), title: t('videoLecture5Title'), url: 'https://www.youtube.com/playlist?list=PLDTISUTAuz_xwa8WEV6IEp3FgjJFNroo7' },
    { id: 6, image: require('../assets/mahazrat/img06.png'), title: t('videoLecture6Title'), url: 'https://www.youtube.com/playlist?list=PLDTISUTAuz_zyUtOWEToIT4qz59rBnw40' },
    { id: 7, image: require('../assets/mahazrat/img07.png'), title: t('videoLecture7Title'), url: 'https://www.youtube.com/playlist?list=PLDTISUTAuz_xJipymOMJLg4s6nI6OGNCd' },
    { id: 8, image: require('../assets/mahazrat/img08.png'), title: t('videoLecture8Title'), url: 'https://www.youtube.com/watch?v=1S7CsJ-edts&list=PLDTISUTAuz_xBxj9h1rJkPtrmYVBHxa2-' },
    { id: 9, image: require('../assets/mahazrat/img09.png'), title: t('videoLecture9Title'), url: 'https://www.youtube.com/playlist?list=PLDTISUTAuz_yy0HwfqsVM5tTcHBUYzdcR' },
    { id: 10, image: require('../assets/mahazrat/img10.png'), title: t('videoLecture10Title'), url: 'https://www.youtube.com/playlist?list=PLDTISUTAuz_wXQhkignejOSmAVp92ETc7' },
  ];

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
      <ScrollView style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('lectures')}</Text>
        </View>

        <View style={styles.listContainer}>
          {lectures.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => Linking.openURL(item.url)}
            >
              <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
              <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{t('tapToWatch')}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingTop: 20
  },
  cardImage: {
    width: '100%',
    height: 350,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.header,
    marginBottom: 5,
    textAlign: 'center',
    
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default VideoLecturesScreen;
