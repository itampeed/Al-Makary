import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Layout from '../components/Layout';
import Colors from '../constants/Colors';
import { WebView } from 'react-native-webview';

// This screen expects to receive a local file uri in the form of reader:<encodedUri>
const BookReaderScreen = ({ routeParam, onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const fileUri = useMemo(() => {
    if (routeParam && routeParam.startsWith('reader:')) {
      const encoded = routeParam.slice('reader:'.length);
      try { return decodeURIComponent(encoded); } catch { return encoded; }
    }
    return null;
  }, [routeParam]);

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
        {fileUri ? (
          <WebView source={{ uri: fileUri }} style={styles.webview} allowFileAccess allowUniversalAccessFromFileURLs />
        ) : null}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  webview: { flex: 1 },
});

export default BookReaderScreen;


