import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';
import { useCart } from '../contexts/CartContext';
import booksData from '../assets/data/books.json';

const ShopScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    setBooks(booksData.books);
    setFilteredBooks(booksData.books);
  }, []);

  const categories = ['الكل', ...new Set(books.map(book => book.category))];

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === 'الكل') {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter(book => book.category === category));
    }
  };

  const handleAddToCart = (book) => {
    addToCart(book);
    Alert.alert('تمت الإضافة', `تم إضافة "${book.title}" إلى السلة`);
  };

  const renderBook = (book) => (
    <View key={book.id} style={styles.bookCard}>
      <Image 
        source={{ uri: `../assets/IMG_32673B75A9C0-22.jpg` }} 
        style={styles.bookImage}
        defaultSource={require('../assets/IMG_32673B75A9C0-22.jpg')}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>{book.author}</Text>
        <Text style={styles.bookDescription} numberOfLines={2}>
          {book.description}
        </Text>
        <View style={styles.bookDetails}>
          <Text style={styles.bookPrice}>${book.price}</Text>
          <Text style={styles.bookPages}>{book.pages} صفحة</Text>
        </View>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(book)}
        >
          <Text style={styles.addToCartText}>أضف إلى السلة</Text>
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
          <Text style={styles.title}>المتجر</Text>
          <Text style={styles.subtitle}>اكتشف مجموعتنا الكاملة من الكتب الروحية</Text>
        </View>
        
        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
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
          {filteredBooks.map(renderBook)}
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
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
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
  bookImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
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
});

export default ShopScreen;
