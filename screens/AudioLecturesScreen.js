import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Layout from '../components/Layout';
import Colors from '../constants/Colors';
import { useLanguage } from '../contexts/LanguageContext';
import { useAudio } from '../contexts/AudioContext';

const AudioLecturesScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const { t, isRTL } = useLanguage();
  const { 
    sound, 
    isPlaying, 
    currentAudio, 
    position, 
    duration, 
    playSound, 
    handlePlayPause, 
    handleSeek, 
    closePlayer, 
    setIsSeeking,
    loadingFile,
    sections,
    loadingData 
  } = useAudio();

  const formatTime = (millis) => {
      if (!millis) return '00:00';
      const minutes = Math.floor(millis / 60000);
      const seconds = ((millis % 60000) / 1000).toFixed(0);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const isActive = currentAudio?.file === item.file;
    const isLoading = loadingFile === item.file;

    return (
      <TouchableOpacity 
        style={[styles.card, isActive && styles.activeCard]} 
        onPress={() => playSound(item)}
      >
        <View style={styles.iconContainer}>
            {isLoading ? (
                <ActivityIndicator size="small" color={isActive ? "#fff" : Colors.header} />
            ) : (
                <Ionicons 
                    name={isActive && isPlaying ? "pause-circle" : "play-circle"} 
                    size={40} 
                    color={isActive ? "#fff" : Colors.header} 
                />
            )}
        </View>
        <View style={styles.textContainer}>
            <Text style={[styles.cardTitle, isActive && styles.activeText]}>{item.title}</Text>
        </View>
      </TouchableOpacity>
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
        <View style={styles.container}>
            {/* Screen title removed as it will be part of sections or header */}
             <Text style={styles.screenTitle}>{t('selectedLectures')}</Text>
            
            {loadingData ? (
                <ActivityIndicator size="large" color={Colors.header} style={{marginTop: 50}} />
            ) : (
                <SectionList
                    sections={sections}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    keyExtractor={(item, index) => item.file + index}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    stickySectionHeadersEnabled={false}
                    ListEmptyComponent={
                        <Text style={{textAlign: 'center', marginTop: 20, color: '#666'}}>
                            No lectures available.
                        </Text>
                    }
                />
            )}

            {currentAudio && (
                 <View style={styles.playerBar}>
                    <View style={styles.playerHeader}>
                        <Text style={styles.playerTitle} numberOfLines={1}>{currentAudio.title}</Text>
                        <TouchableOpacity onPress={closePlayer}>
                             <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.controlsRow}>
                        <Text style={styles.timeText}>{formatTime(position)}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={duration}
                            value={position}
                            onSlidingStart={() => setIsSeeking(true)}
                            onSlidingComplete={handleSeek}
                            minimumTrackTintColor="#fff"
                            maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
                            thumbTintColor="#fff"
                        />
                        <Text style={styles.timeText}>{formatTime(duration)}</Text>
                    </View>
                    
                    <View style={styles.playButtonContainer}>
                        <TouchableOpacity onPress={handlePlayPause}>
                            <Ionicons 
                                name={isPlaying ? "pause-circle" : "play-circle"} 
                                size={50} 
                                color="#fff" 
                            />
                        </TouchableOpacity>
                    </View>
                 </View>
            )}
        </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.header,
    textAlign: 'center',
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 220, 
  },
  sectionHeader: {
    backgroundColor: Colors.background, 
    paddingVertical: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.header,
    textAlign: 'right', // Assuming RTL default for headers based on content
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeCard: {
      backgroundColor: Colors.header,
  },
  iconContainer: {
      marginRight: 15,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
  },
  textContainer: {
      flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
  },
  activeText: {
      color: '#fff',
      fontWeight: 'bold',
  },
  playerBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 180, 
      backgroundColor: Colors.header,
      paddingHorizontal: 20,
      paddingTop: 15,
      paddingBottom: 40,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      elevation: 50,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      zIndex: 9999,
  },
  playerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
  },
  playerTitle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      flex: 1,
      marginRight: 10,
  },
  controlsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 15,
  },
  slider: {
      flex: 1,
      marginHorizontal: 10,
      height: 40,
  },
  timeText: {
      color: '#fff',
      fontSize: 12,
      width: 40,
      textAlign: 'center',
  },
  playButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
  }

});

export default AudioLecturesScreen;