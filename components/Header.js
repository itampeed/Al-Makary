import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const Header = ({ onMenuPress, onBack, showBack }) => {
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
            <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
              <Ionicons name="menu" size={20} color="white" />
            </TouchableOpacity>
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
