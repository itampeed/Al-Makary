import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform, TouchableOpacity, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import { WebView } from 'react-native-webview';
import Layout from '../components/Layout';
import Colors from '../constants/Colors';

const BookReaderScreen = ({ routeParam, onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const [localUri, setLocalUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const remoteUrl = useMemo(() => {
    if (routeParam && routeParam.startsWith('reader:')) {
      const encoded = routeParam.slice('reader:'.length);
      try { return decodeURIComponent(encoded); } catch { return encoded; }
    }
    return null;
  }, [routeParam]);

  useEffect(() => {
    if (!remoteUrl) return;
    loadBook();
  }, [remoteUrl]);

  /* State */
  const [downloadProgress, setDownloadProgress] = useState(0);

  // ... (useEffect same)

  const loadBook = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setDownloadProgress(0);

      // 1. Setup Cache Directory
      const booksDir = FileSystem.documentDirectory + 'books/';
      const dirInfo = await FileSystem.getInfoAsync(booksDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(booksDir, { intermediates: true });
      }

      // 2. Generate CONSISTENT local filename
      // Remove query parameters (like Supabase tokens) so cache persists
      const baseName = remoteUrl.split('?')[0].split('/').pop();
      const safeName = baseName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const fileUri = booksDir + safeName;

      // 3. Check Cache
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      let finalUri = fileUri;

      if (fileInfo.exists) {
        console.log('Book found in cache:', safeName);
        finalUri = fileUri;
      } else {
        console.log('Downloading book from:', remoteUrl);
        console.log('Saving to:', fileUri);
        
        const downloadResumable = FileSystem.createDownloadResumable(
          remoteUrl, 
          fileUri,
          {},
          (downloadProgress) => {
            const total = downloadProgress.totalBytesExpectedToWrite;
            const written = downloadProgress.totalBytesWritten;
            
            if (total > 0) {
              setDownloadProgress(written / total);
            } else {
              // If content-length is missing, we can't calculate percentage
              // Just show a small non-zero value to switch text to "Downloading..."
              setDownloadProgress(0.01); 
            }
          }
        );
        const { uri } = await downloadResumable.downloadAsync();
        finalUri = uri;
      }

      // 4. Handle Platform Differences
      if (Platform.OS === 'android') {
        // Expo Go for Android: Cannot display local PDF in WebView.
        // Must use IntentLauncher to open in external PDF app.
        const contentUri = await FileSystem.getContentUriAsync(finalUri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
          type: 'application/pdf',
        });
        setIsLoading(false); // Done handling
      } else {
        // iOS: Native WebView handles local PDFs perfectly
        setLocalUri(finalUri);
        setIsLoading(false);
      }

    } catch (err) {
      console.error('Book Load Error:', err);
      setError('Failed to load book.');
      setIsLoading(false);
    }
  };

  const openAndroidReader = () => {
    loadBook(); // Retry or re-open
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.header} />
            <Text style={styles.loadingText}>
              {downloadProgress > 0.01 
                ? `Downloading Book... ${Math.round(downloadProgress * 100)}%` 
                : downloadProgress > 0 
                  ? 'Downloading Book...'
                  : 'Preparing download...'}
            </Text>
          </View>
        ) : error ? (
           <View style={styles.centerContainer}>
             <Text style={styles.errorText}>{error}</Text>
             <TouchableOpacity onPress={loadBook} style={styles.retryButton}>
               <Text style={styles.retryText}>Retry</Text>
             </TouchableOpacity>
           </View>
        ) : Platform.OS === 'ios' && localUri ? (
          <WebView 
            source={{ uri: localUri }} 
            style={styles.webview} 
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
          />
        ) : (
          <View style={styles.centerContainer}>
            <Text style={styles.infoText}>Book downloaded.</Text>
            <TouchableOpacity onPress={openAndroidReader} style={styles.openButton}>
              <Text style={styles.openButtonText}>Open in PDF Reader</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  webview: { flex: 1 },
  loadingContainer: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  centerContainer: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  errorText: { color: 'red', fontSize: 16, marginBottom: 10 },
  retryButton: { padding: 10, backgroundColor: Colors.header, borderRadius: 5 },
  retryText: { color: '#fff' },
  infoText: { fontSize: 16, marginBottom: 20, color: '#333' },
  openButton: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.header, borderRadius: 8 },
  openButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default BookReaderScreen;