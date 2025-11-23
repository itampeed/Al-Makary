import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';
import { useAuth } from '../contexts/AuthContext';
import { getPurchasedBooks } from '../services/purchases';
import { downloadBookToCache, isBookCached } from '../services/storage';

// For now, assume files are hosted in Google Drive with direct links provided elsewhere.
// You will need to provide a mapping from pdfFile to a secured download URL.
const buildRemoteUrl = (book) => book.pdfUrl || null;

const PurchasedScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('account');
      return;
    }
    (async () => {
      const purchased = await getPurchasedBooks(user?.id);
      setItems(purchased);
    })();
  }, [isAuthenticated, user]);

  const handleDownload = async (book) => {
    try {
      setDownloadingId(book.id);
      const existingPath = await isBookCached(book.pdfFile);
      if (existingPath) {
        onNavigate('reader:' + encodeURIComponent(existingPath));
        return;
      }
      const url = buildRemoteUrl(book);
      const path = await downloadBookToCache(url, book.pdfFile);
      onNavigate('reader:' + encodeURIComponent(path));
    } catch (e) {
      Alert.alert('Download failed', 'An error occurred while downloading the book.');
    } finally {
      setDownloadingId(null);
    }
  };

  const renderItem = (book) => (
    <View key={book.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{book.title}</Text>
        <Text style={styles.cardMeta}>{book.category}</Text>
      </View>
      <View style={styles.cardBody}>
        {book.pdfUrl ? (
          <Text style={styles.cardDetail}>PDF: {book.pdfFile}</Text>
        ) : null}
        <TouchableOpacity
          style={[styles.actionBtn, downloadingId === book.id && styles.actionBtnDisabled]}
          onPress={() => handleDownload(book)}
          disabled={downloadingId === book.id}
        >
          <Text style={styles.actionText}>{downloadingId === book.id ? 'جارٍ التنزيل...' : 'تنزيل وقراءة'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>مشترياتي</Text>
          <Text style={styles.subtitle}>الكتب التي قمت بشرائها</Text>
        </View>

        <View style={styles.list}>{items.map(renderItem)}</View>

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
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.header,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    opacity: 0.8,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.header,
    textAlign: 'right',
  },
  cardMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  cardBody: {
    padding: 16,
  },
  cardDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    textAlign: 'right',
  },
  actionBtn: {
    backgroundColor: Colors.header,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnDisabled: {
    backgroundColor: '#aaa',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PurchasedScreen;


