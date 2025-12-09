import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';
import { useCart } from '../contexts/CartContext';
import { fetchCatalogFromSupabase } from '../services/supabaseContent';
import { Ionicons } from '@expo/vector-icons';

const ITEMS_PER_PAGE = 12;

const ShopScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart, items } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [customAlert, setCustomAlert] = useState({
    visible: false,
    message: '',
    type: 'success', // 'success' or 'error'
  });

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const catalog = await fetchCatalogFromSupabase();
        const normalized = (catalog.books || []).map((b) => ({
          ...b,
          image: b.coverImage,
        }));
        setBooks(normalized);
        setFilteredBooks(normalized);
      } catch (e) {
        setCustomAlert({
          visible: true,
          message: e?.message || 'تعذر جلب الكتالوج من Supabase.',
          type: 'error',
        });
        setBooks([]);
        setFilteredBooks([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const categories = ['الكل', ...new Set(books.map(book => book.category))];

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
    if (category === 'الكل') {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter(book => book.category === category));
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Scroll to top when page changes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [currentPage]);

  const handleAddToCart = (book) => {
    try {
      addToCart(book);
      setCustomAlert({
        visible: true,
        message: `تمت إضافة "${book.title}" إلى السلة`,
        type: 'success',
      });
    } catch (error) {
      setCustomAlert({
        visible: true,
        message: 'حدث خطأ أثناء إضافة الكتاب إلى السلة',
        type: 'error',
      });
    }
  };

  const closeCustomAlert = () => {
    setCustomAlert({ visible: false, message: '', type: 'success' });
  };

  const handleImageLoadStart = (bookId) => {
    setImageLoadingStates(prev => ({ ...prev, [bookId]: true }));
  };

  const handleImageLoad = (bookId) => {
    setImageLoadingStates(prev => ({ ...prev, [bookId]: false }));
  };

  const handleImageError = (bookId) => {
    setImageLoadingStates(prev => ({ ...prev, [bookId]: false }));
  };

  // Preload images for current page
  useEffect(() => {
    const pageStartIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageEndIndex = pageStartIndex + ITEMS_PER_PAGE;
    const booksToPreload = filteredBooks.slice(pageStartIndex, pageEndIndex);
    booksToPreload.forEach((book) => {
      if (book.coverUrl) {
        Image.prefetch(book.coverUrl).catch(() => {
          // Silently handle prefetch errors
        });
      }
    });
  }, [currentPage, filteredBooks]);

  const renderBook = (book) => {
    const isImageLoading = imageLoadingStates[book.id] !== false;
    const imageSource = book.coverUrl 
      ? { uri: book.coverUrl, cache: 'force-cache' }
      : require('../assets/AllBooks.jpg');
    
    // Determine if book is in English
    const isEnglish = book.language && book.language.toLowerCase() === 'english';
    
    // Check if book is already in cart
    const isInCart = items.some(item => item.id === book.id);
    
    return (
      <View key={book.id} style={styles.bookCard}>
        <View style={styles.imageContainer}>
          {isImageLoading && (
            <View style={styles.imagePlaceholder}>
              <ActivityIndicator size="small" color={Colors.header} />
            </View>
          )}
          <Image 
            source={imageSource}
            style={[styles.bookImage, isImageLoading && styles.bookImageLoading]}
            defaultSource={require('../assets/AllBooks.jpg')}
            onLoadStart={() => handleImageLoadStart(book.id)}
            onLoad={() => handleImageLoad(book.id)}
            onError={() => handleImageError(book.id)}
            resizeMode="cover"
            fadeDuration={200}
          />
        </View>
        <View style={[styles.bookInfo, isEnglish && styles.bookInfoEnglish]}>
          <Text style={[styles.bookTitle, isEnglish && styles.bookTitleEnglish]}>{book.title}</Text>
          <Text style={[styles.bookAuthor, isEnglish && styles.bookAuthorEnglish]}>{book.author}</Text>
          <Text style={[styles.bookDescription, isEnglish && styles.bookDescriptionEnglish]} numberOfLines={2}>
            {book.description}
          </Text>
          {book.pdfUrl ? (
            <Text style={[styles.bookAuthor, isEnglish && styles.bookAuthorEnglish]}>{book.pdfFile}</Text>
          ) : null}
          <View style={[styles.bookDetails, isEnglish && styles.bookDetailsEnglish]}>
            <Text style={styles.bookPrice}>${book.price}</Text>
            <Text style={[styles.bookPages, isEnglish && styles.bookPagesEnglish]}>
              {book.pages} صفحة
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.addToCartButton, isInCart && styles.addToCartButtonDisabled]}
            onPress={() => handleAddToCart(book)}
            disabled={isInCart}
          >
            <Text style={[styles.addToCartText, isInCart && styles.addToCartTextDisabled]}>
              {isInCart ? 'موجود في السلة' : 'أضف إلى السلة'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
      <ScrollView 
        ref={scrollViewRef}
        style={styles.content} 
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>المتجر</Text>
          <Text style={styles.subtitle}>اكتشف مجموعتنا الكاملة من الكتب الروحية</Text>
        </View>
        
        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton
              ]}
              onPress={() => filterByCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.productsContainer}>
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.header} />
              <Text style={styles.loaderText}>جاري تحميل الكتب...</Text>
            </View>
          ) : (
            <>
              {currentBooks.map(renderBook)}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <View style={styles.paginationContainer}>
                  <TouchableOpacity
                    style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                    onPress={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? '#ccc' : Colors.header} />
                    <Text style={[styles.paginationButtonText, currentPage === 1 && styles.paginationButtonTextDisabled]}>
                      السابق
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.pageNumbersContainer}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <TouchableOpacity
                            key={page}
                            style={[
                              styles.pageNumberButton,
                              currentPage === page && styles.pageNumberButtonActive
                            ]}
                            onPress={() => goToPage(page)}
                          >
                            <Text style={[
                              styles.pageNumberText,
                              currentPage === page && styles.pageNumberTextActive
                            ]}>
                              {page}
                            </Text>
                          </TouchableOpacity>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <Text key={page} style={styles.pageEllipsis}>...</Text>
                        );
                      }
                      return null;
                    })}
                  </View>

                  <TouchableOpacity
                    style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
                    onPress={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <Text style={[styles.paginationButtonText, currentPage === totalPages && styles.paginationButtonTextDisabled]}>
                      التالي
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? '#ccc' : Colors.header} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Page Info */}
              {totalPages > 1 && (
                <Text style={styles.pageInfo}>
                  صفحة {currentPage} من {totalPages} ({filteredBooks.length} كتاب)
                </Text>
              )}
            </>
          )}
        </View>

        {/* Shop Now Button */}
        <View style={styles.shopNowContainer}>
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => onNavigate('cart')}
          >
            <Text style={styles.shopNowText}>عرض السلة</Text>
          </TouchableOpacity>
        </View>

        <Footer />
      </ScrollView>

      {/* Custom Alert Modal */}
      <Modal
        transparent
        visible={customAlert.visible}
        animationType="fade"
        onRequestClose={closeCustomAlert}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Message */}
              <Text style={styles.modalTitle}>
                {customAlert.type === 'success' ? 'تمت الإضافة' : 'حدث خطأ'}
              </Text>
              <Text style={styles.modalMessage}>
                {customAlert.message}
              </Text>

              {/* Button */}
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  customAlert.type === 'success' ? styles.modalButtonSuccess : styles.modalButtonError
                ]}
                onPress={closeCustomAlert}
              >
                <Text style={styles.modalButtonText}>حسناً</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 10,
    backgroundColor: Colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.header,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.header,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.header,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: Colors.background,
  },
  productsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 12,
    color: Colors.text,
    fontSize: 14,
  },
  bookCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    zIndex: 1,
  },
  bookImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  bookImageLoading: {
    opacity: 0.3,
  },
  bookInfo: {
    padding: 16,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.header,
    marginBottom: 4,
    textAlign: 'right',
  },
  bookAuthor: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  bookDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    textAlign: 'right',
    lineHeight: 18,
  },
  bookDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.header,
  },
  bookPages: {
    fontSize: 12,
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: Colors.header,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  addToCartTextDisabled: {
    color: '#666',
  },
  // English book styles (LTR)
  bookInfoEnglish: {
    // No special styling needed, text alignment handled by child elements
  },
  bookTitleEnglish: {
    textAlign: 'left',
  },
  bookAuthorEnglish: {
    textAlign: 'left',
  },
  bookDescriptionEnglish: {
    textAlign: 'left',
  },
  bookDetailsEnglish: {
    flexDirection: 'row',
  },
  bookPagesEnglish: {
    textAlign: 'left',
  },
  shopNowContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  shopNowButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  shopNowText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.header,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    borderColor: '#ccc',
  },
  paginationButtonText: {
    fontSize: 14,
    color: Colors.header,
    fontWeight: '500',
    marginHorizontal: 4,
  },
  paginationButtonTextDisabled: {
    color: '#ccc',
  },
  pageNumbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flex: 1,
  },
  pageNumberButton: {
    minWidth: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.header,
  },
  pageNumberButtonActive: {
    backgroundColor: Colors.header,
    borderColor: Colors.header,
  },
  pageNumberText: {
    fontSize: 14,
    color: Colors.header,
    fontWeight: '500',
  },
  pageNumberTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageEllipsis: {
    fontSize: 14,
    color: Colors.text,
    marginHorizontal: 4,
  },
  pageInfo: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.text,
    marginTop: 10,
    marginBottom: 10,
  },
  // Custom Alert Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.header,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonSuccess: {
    backgroundColor: Colors.header,
  },
  modalButtonError: {
    backgroundColor: '#f44336',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShopScreen;
