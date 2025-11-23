import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Dimensions,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const SideMenu = ({ isVisible, onClose, onNavigate, currentScreen }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const slideAnim = useRef(new Animated.Value(width)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

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
          toValue: width,
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
    { key: 'home', text: 'Home - الصفحة الرئيسية' },
    { key: 'about', text: 'About - عن الدرة الطقسية' },
    { key: 'shop', text: 'Shop - المتجر' },
    { 
      key: 'library', 
      text: 'Books - الكتب', 
      hasDropdown: true,
      subItems: [
        { key: 'book-first', text: 'Book First - الكتاب الأول' },
        { key: 'book-second', text: 'Book Second - الكتاب الثاني' },
        { key: 'book-third', text: 'Book Third - الكتاب الثالث' },
        { key: 'book-fourth', text: 'Book Fourth - الكتاب الرابع' },
      ]
    },
    { 
      key: 'lectures', 
      text: 'Lectures - المحاضرات', 
      hasDropdown: true,
      subItems : [
        { key: 'lecture-1', text: 'Lecture 1 - كتاب 1يسوع المسيح وتعاليمه' },
        { key: 'lecture-2', text: 'Lecture 2 - كتاب الكنيسة والعذراء مريم' },
        { key: 'lecture-3', text: 'Lecture 3 - الإيمان والعقيدة' },
        { key: 'lecture-4', text: 'Lecture 4 - كتاب قوانين الكنيسة' },
        { key: 'lecture-5', text: 'Lecture 5 - صلوات الكنيسة' },
        { key: 'lecture-6', text: 'Lecture 6 - أسرار الكنيسة' },
        { key: 'lecture-7', text: 'Lecture 7 - أصوام الكنيسة' },
        { key: 'lecture-8', text: 'Lecture 8 - أعياد الكنيسة' },
        { key: 'lecture-9', text: 'Lecture 9 - التَّاريخ اللِّيتورجي لكنيسة الإسكندريَّة' },
        { key: 'lecture-10', text: 'Lecture 10 - الأبحاث وموضوعات عامة' },
      ]
    },
    { key: 'return-policy', text: 'Return Policy - سياسة الاسترجاع والاستبدال' },
    { key: 'privacy-policy', text: 'Privacy Policy - سياسة الخصوصية' },
    { key: 'contact', text: 'Contact - للتواصل معنا' },
    { key: 'account', text: 'My Account - حسابي' },
    { key: 'cart', text: 'Shopping Cart - سلة المشتريات' },
    { key: 'purchased', text: 'My Books - كتبي' },
  ];

  const renderMenuItem = (item) => {
    const isExpanded = expandedItems[item.key];
    const isActive = currentScreen === item.key;
    
    return (
      <View key={item.key}>
        {item.hasDropdown ? (
          <View style={styles.menuItem}>
            <TouchableOpacity 
              onPress={() => toggleExpanded(item.key)} 
              style={styles.iconTouchable}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons 
                name={isExpanded ? "remove" : "add"} 
                size={20} 
                color="#666" 
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuTextWrapper}
              onPress={() => handleMenuPress(item.key)}
            >
              <Text style={[
                styles.menuText, 
                isActive && styles.activeMenuText
              ]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuPress(item.key)}
          >
            <Text style={[
              styles.menuText, 
              isActive && styles.activeMenuText
            ]}>
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
        {item.hasDropdown && isExpanded && item.subItems && (
          <View style={styles.subMenuContainer}>
            {item.subItems.map(subItem => {
              const isSubItemActive = currentScreen === subItem.key;
              return (
                <TouchableOpacity 
                  key={subItem.key} 
                  style={styles.subMenuItem}
                  onPress={() => handleMenuPress(subItem.key)}
                >
                  <Text style={[
                    styles.subMenuText,
                    isSubItemActive && styles.activeSubMenuText
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
        { transform: [{ translateX: slideAnim }] }
      ]}>
        <View style={styles.menuHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.menuContent}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.menuContentContainer}
        >
          {menuItems.map(renderMenuItem)}
        </ScrollView>
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
    flexDirection: 'row',
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
  },
  menuHeader: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingTop: 20,
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent,
  },
  icon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'right',
    flex: 1,
  },
  activeMenuText: {
    color: Colors.activeText,
    fontWeight: 'bold',
  },
  subMenuContainer: {
    backgroundColor: '#f5f5f5',
    paddingLeft: 20,
  },
  subMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  subMenuText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'right',
  },
  activeSubMenuText: {
    color: Colors.activeText,
    fontWeight: 'bold',
  },
  iconTouchable: {
  },
  menuTextWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default SideMenu;
