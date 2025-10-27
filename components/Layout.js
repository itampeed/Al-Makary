import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from './Header';
import SideMenu from './SideMenu';
import Colors from '../constants/Colors';

const Layout = ({ children, onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  return (
    <View style={styles.container}>
      <Header onMenuPress={onMenuPress} onBack={onBack} showBack={showBack} onNavigate={onNavigate} />
      
      <View style={styles.content}>
        {children}
      </View>

      <SideMenu isVisible={isMenuVisible} onClose={onCloseMenu} onNavigate={onNavigate} currentScreen={currentScreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
});

export default Layout;
