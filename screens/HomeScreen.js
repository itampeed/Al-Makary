import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';

const HomeScreen = ({ onNavigate, currentScreen, onBack, showBack }) => {
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
  };

  return (
    <Layout 
      onMenuPress={toggleMenu} 
      isMenuVisible={isMenuVisible} 
      onCloseMenu={closeMenu}
      onNavigate={onNavigate}
      currentScreen={currentScreen}
      onBack={onBack}
      showBack={showBack}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        <View style={styles.section}>
          <Image 
            source={require('../assets/All Books.jpg')} 
            style={styles.sectionImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.sectionButton}>
            <Text style={styles.sectionText}>الكتب</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Image 
            source={require('../assets/All Books.jpg')} 
            style={styles.sectionImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.sectionButton}>
            <Text style={styles.sectionText}>مخطوطات و مراجع الكتب</Text>
          </TouchableOpacity>
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
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
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
});

export default HomeScreen;
