import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Dimensions,
  ScrollView,
  Image,
  I18nManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

const SideMenu = ({ isVisible, onClose, onNavigate, currentScreen }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const slideAnim = useRef(new Animated.Value(width)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  
  const { t, language, setLanguage, isRTL } = useLanguage();

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: width, // Slide out correct side
           // Note: simple slide out to width works if we position 'right: 0' for logic or transform
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, slideAnim, backdropOpacity]);

  const toggleExpanded = (itemKey) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const handleMenuPress = (itemKey) => {
    onNavigate(itemKey);
    onClose();
  };

  const menuItems = [
    { key: 'home', text: t('home'), icon: 'home-outline' },
    { key: 'about', text: t('about'), icon: 'person-outline' },

    { 
      key: 'library', 
      text: t('library'), 
      icon: 'library-outline',
      hasDropdown: true,
      subItems: [
        { key: 'book-first', text: t('series1') },
        { key: 'book-second', text: t('series2') },
        { key: 'book-third', text: t('series3') },
        { key: 'book-fourth', text: t('series4') },
      ]
    },
    { 
      key: 'lectures', 
      text: t('lectures'), 
      icon: 'mic-outline',
      hasDropdown: true,
      subItems : [
        { key: 'lecture-1', text: 'Lecture 1' },
        { key: 'lecture-2', text: 'Lecture 2' },
        { key: 'lecture-3', text: 'Lecture 3' },
        { key: 'lecture-4', text: 'Lecture 4' },
        { key: 'lecture-5', text: 'Lecture 5' },
        { key: 'lecture-6', text: 'Lecture 6' },
        { key: 'lecture-7', text: 'Lecture 7' },
        { key: 'lecture-8', text: 'Lecture 8' },
        { key: 'lecture-9', text: 'Lecture 9' },
        { key: 'lecture-10', text: 'Lecture 10' },
      ]
    },
    { key: 'subscription', text: t('subscription'), icon: 'card-outline' },
    { key: 'return-policy', text: t('returnPolicy'), icon: 'refresh-outline' },
    { key: 'privacy-policy', text: t('privacyPolicy'), icon: 'shield-checkmark-outline' },
    { key: 'contact', text: t('contact'), icon: 'mail-outline' },
    { key: 'account', text: t('myAccount'), icon: 'person-circle-outline' },
  ];

  const renderMenuItem = (item) => {
    const isExpanded = expandedItems[item.key];
    const isActive = currentScreen === item.key;
    
    return (
      <View key={item.key}>
        {item.hasDropdown ? (
          <View style={[styles.menuItem, isRTL ? styles.rowReverse : styles.row]}>
            <TouchableOpacity 
              onPress={() => toggleExpanded(item.key)} 
              style={styles.iconTouchable}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons 
                name={isExpanded ? "remove" : "add"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuTextWrapper, isRTL ? styles.alignRight : styles.alignLeft]}
              onPress={() => handleMenuPress(item.key)}
            >
               <View style={[styles.menuLabelContainer, isRTL ? styles.rowReverse : styles.row]}>
                   {item.icon && <Ionicons name={item.icon} size={20} color="#666" style={{ marginHorizontal: 10 }} />}
                  <Text style={[
                    styles.menuText, 
                    isActive && styles.activeMenuText,
                    isRTL ? styles.textRight : styles.textLeft
                  ]}>
                    {item.text}
                  </Text>
               </View>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.menuItem, isRTL ? styles.rowReverse : styles.row]}
            onPress={() => handleMenuPress(item.key)}
          >
             <View style={[styles.menuLabelContainer, isRTL ? styles.rowReverse : styles.row]}>
                {item.icon && <Ionicons name={item.icon} size={20} color="#666" style={{ marginHorizontal: 10 }} />}
                <Text style={[
                  styles.menuText, 
                  isActive && styles.activeMenuText,
                  isRTL ? styles.textRight : styles.textLeft
                ]}>
                  {item.text}
                </Text>
             </View>
          </TouchableOpacity>
        )}
        
        {item.hasDropdown && isExpanded && item.subItems && (
          <View style={styles.subMenuContainer}>
            {item.subItems.map(subItem => {
              const isSubItemActive = currentScreen === subItem.key;
              return (
                <TouchableOpacity 
                  key={subItem.key} 
                  style={[styles.subMenuItem, isRTL ? styles.rowReverse : styles.row]}
                  onPress={() => handleMenuPress(subItem.key)}
                >
                  <Text style={[
                    styles.subMenuText,
                    isSubItemActive && styles.activeSubMenuText,
                    isRTL ? styles.textRight : styles.textLeft
                  ]}>{subItem.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[
        styles.menuContainer,
        { 
             transform: [{ translateX: isRTL ? slideAnim : Animated.multiply(slideAnim, -1) }]
             // Logic: if RTL, slide from right (positive width -> 0). 
             // If LTR, slide from left (-width -> 0). But current implementation logic uses positive width for hidden state.
             // Let's stick to absolute positioning side based on language.
        },
        isRTL ? { right: 0 } : { left: 0 } // Position based on language
      ]}>
        <View style={[styles.menuHeader, isRTL ? styles.rowReverse : styles.row]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Image 
            source={require('../assets/logos/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <ScrollView 
          style={styles.menuContent}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.menuContentContainer}
        >
          {menuItems.map(renderMenuItem)}

          {/* Language Toggle */}
          <View style={styles.languageSection}>
            <View style={styles.languageButtons}>
              <TouchableOpacity 
                style={[styles.langButton, language === 'en' && styles.activeLangButton]} 
                onPress={() => setLanguage('en')}
              >
                <Text style={[styles.langText, language === 'en' && styles.activeLangText]}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.langButton, language === 'ar' && styles.activeLangButton]} 
                onPress={() => setLanguage('ar')}
              >
                <Text style={[styles.langText, language === 'ar' && styles.activeLangText]}>العربية</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </ScrollView>
        <Image 
            source={require('../assets/logos/logo.png')}
            style={styles.bottomImage}
            resizeMode="contain"
          />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backdropTouchable: {
    flex: 1,
  },
  menuContainer: {
    width: width * 0.8,
    backgroundColor: Colors.background,
    height: '100%',
    paddingTop: 20,
    position: 'absolute',
    top: 0,
    bottom: 0,
    // right/left is handled dynamically
  },
  menuHeader: {
    height: 80,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent,
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  closeButton: {
    padding: 8,
  },
  menuContent: {
    flex: 1,
  },
  menuContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuItem: {
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  alignRight: {
      alignItems: 'flex-end',
  },
  alignLeft: {
      alignItems: 'flex-start',
  },
  menuLabelContainer: {
      flex: 1,
      alignItems: 'center'
  },
  menuText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  textRight: {
      textAlign: 'right',
  },
  textLeft: {
      textAlign: 'left',
  },
  menuTextWrapper: {
    flex: 1,
  },
  activeMenuText: {
    color: Colors.activeText,
    fontWeight: 'bold',
  },
  subMenuContainer: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 5,
  },
  subMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  subMenuText: {
    fontSize: 14,
    color: Colors.text,
  },
  activeSubMenuText: {
    color: Colors.activeText,
    fontWeight: 'bold',
  },
  iconTouchable: {
      padding: 5,
  },
  languageSection: {
      marginTop: 20,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: Colors.accent,
      alignItems: 'center',
  },
  languageButtons: {
      flexDirection: 'row',
      backgroundColor: '#eee',
      borderRadius: 20,
      padding: 4,
  },
  langButton: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 16,
  },
  activeLangButton: {
      backgroundColor: Colors.header,
  },
  langText: {
      color: '#666',
      fontWeight: '600',
  },
  activeLangText: {
      color: '#fff',
  },
  bottomImage: {
    width: '100%',
    height: 100,
    marginTop: 20,
    opacity: 0.8,
  },
});

export default SideMenu;
