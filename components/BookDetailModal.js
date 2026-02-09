import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Dimensions 
} from 'react-native';
// Switched to MaterialIcons for stability
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { useLanguage } from '../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

const BookDetailModal = ({ 
  visible, 
  book, 
  onClose, 
  onRead, 
  onSubscribe, 
  hasAccess 
}) => {
  const { t, isRTL } = useLanguage();

  if (!book) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>

          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContent}>
              <Image 
                source={book.coverUrl ? { uri: book.coverUrl } : require('../assets/icon.png')} 
                style={styles.coverImage}
                resizeMode="contain"
              />
              <Text style={styles.title}>{book.title}</Text>
              {book.author && <Text style={styles.author}>{book.author}</Text>}
              
              <View style={styles.metaRow}>
                {book.pages && (
                  <View style={styles.metaItem}>
                    <MaterialIcons name="description" size={16} color="#666" />
                    <Text style={styles.metaText}>{book.pages} {t('pages') || 'Pages'}</Text>
                  </View>
                )}
                {book.language && (
                  <View style={styles.metaItem}>
                    <MaterialIcons name="language" size={16} color="#666" />
                    <Text style={styles.metaText}>{book.language}</Text>
                  </View>
                )}
              </View>
            </View>

            {book.description ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('aboutBook') || 'About this Book'}</Text>
                <Text style={styles.description}>{book.description}</Text>
              </View>
            ) : null}

            <View style={styles.footerSpacing} />
          </ScrollView>

          <View style={styles.footer}>
            {hasAccess ? (
              <TouchableOpacity style={styles.readButton} onPress={onRead}>
                <MaterialIcons name="menu-book" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>{t('readBook') || 'Read Book'}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.subscribeButton} onPress={onSubscribe}>
                 <MaterialIcons name="lock" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>{t('subscribeToRead') || 'Subscribe to Read'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.85, 
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingTop: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  coverImage: {
    width: 240,
    height: 360,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.header,
    textAlign: 'center',
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginHorizontal: 5,
    marginBottom: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.header,
    marginBottom: 8,
    textAlign: 'left',
  },
  description: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    textAlign: 'left',
  },
  footerSpacing: {
    height: 80, // Space for footer
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  readButton: {
    backgroundColor: Colors.header,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  subscribeButton: {
    backgroundColor: '#d9534f', // Reddish color for locked action 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookDetailModal;
