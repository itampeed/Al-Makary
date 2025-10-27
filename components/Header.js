import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { useCart } from '../contexts/CartContext';

const Header = ({ onMenuPress, onBack, showBack, onNavigate }) => {
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();
  return (
    <View style={styles.headerContainer}>
      {/* Logo Bar */}
      <View style={styles.logoBar}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/logos/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.middleContainer}>
          <Image 
            source={require('../assets/logos/middle.png')} 
            style={styles.middleLogo}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.rightContainer}>
          <Image 
            source={require('../assets/logos/right.png')} 
            style={styles.rightLogo}
            resizeMode="contain"
          />
        </View>
      </View>
      
      {/* Menu Button Bar */}
      <View style={styles.menuBar}>
        <View style={styles.menuRow}>
          <View style={styles.leftSlot}>
            {showBack && (
              <TouchableOpacity style={[styles.menuButton, styles.backButton]} onPress={onBack}>
                <Ionicons name="arrow-back" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.rightSlot}>
            <View style={styles.rightButtons}>
              <TouchableOpacity 
                style={styles.cartButton} 
                onPress={() => onNavigate('cart')}
              >
                <Ionicons name="cart" size={20} color="white" />
                {cartItemCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
                <Ionicons name="menu" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.header,
  },
  logoBar: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomColor: Colors.accent,
    borderBottomWidth: 1,
  },
  menuBar: {
    backgroundColor: Colors.accent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftSlot: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightSlot: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    backgroundColor: Colors.header,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  middleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 60,
    height: 60,
  },
  middleLogo: {
    width: 60,
    height: 60,
  },
  rightLogo: {
    width: 60,
    height: 60,
  },
  menuButton: {
    backgroundColor: Colors.header,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
});

export default Header;
