import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';

// Sample book data (replace with your own)
const booksData = [
  { id: 2, cover: require('../assets/book2.jpg'), title: 'السِّلسلة الثَّانية', description: 'مقدِّمات في طقوس الكنيسة' },
  { id: 1, cover: require('../assets/book1.jpg'), title: 'السِّلسلة الأولى', description: 'مصادر طقوس الكنيسة' },
  { id: 4, cover: require('../assets/book4.jpg'), title: 'السِّلسلة الرَّابعة', description: 'طقوس أصوام وأعياد الكنيسة' },
  { id: 3, cover: require('../assets/book3.jpg'), title: 'السِّلسلة الثَّالثة', description: 'طقوس أسرار وصلوات الكنيسة' },
];

const LibraryScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const handleBookPress = (book) => {
    // Map book to its dedicated screen key
    let routeKey = null;
    switch (book.id) {
      case 1:
        routeKey = 'book-first';
        break;
      case 2:
        routeKey = 'book-second';
        break;
      case 3:
        routeKey = 'book-third';
        break;
      case 4:
        routeKey = 'book-fourth';
        break;
      default:
        routeKey = null;
    }
    if (routeKey) {
      onNavigate(routeKey);
    }
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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>

        {/* Original Page Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>الكتب</Text>
        </View>

        {/* Image section */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/AllBooks.jpg')}
            style={styles.firstimage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/logos/right.png')}
            style={styles.secondimage}
            resizeMode="contain"
          />
        </View>

        {/* Main Title before Grid */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>
            الدُّرَّة الطَّقسيَّة للكنيسة القبطيَّة بين الكنائس الشَّرقيَّة
          </Text>
        </View>

        {/* Book Grid */}
        <View style={styles.gridContainer}>
          {booksData.map((book) => (
            <TouchableOpacity key={book.id} style={styles.bookItem} onPress={() => handleBookPress(book)}>
              <Image source={book.cover} style={styles.bookCover} resizeMode="cover" />
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookDescription}>{book.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Paragraph Section */}
        <View style={styles.paragraphContainer}>
          <Text style={styles.paragraphTitle}>
            الدُّرَّة الطَّقسيَّة للكنيسة القبطيَّة بين الكنائس الشَّرقيَّة
          </Text>

          <Text style={styles.paragraphText}>
            تضُم الدُّرَّة الطَّقسيَّة واحداً وخمسين كتاباً من القطع المتوسِّط، تشمل 22195 صفحة، بمعدَّل 435 صفحة للكتاب الواحد. وهي تبحث وتوثِّق تُراث الكنيسة القبطيَّة الآبائي والقانوني واللِّيتورجي بكلِّ دقة، بدءاً من القرن الأوَّل وحتى منتصف القرن العشرين للميلاد. والتُّراث اللِّيتورجي للكنيسة القبطيَّة يعني صلواتها وأسرارها وأصوامها وأعيادها.
          </Text>

          <Text style={styles.paragraphText}>
            ولقد استعنتُ في هذه الدِّراسات التراثيَّة بمئات المخطوطات القبطيَّة المنتشرة في متاحف ومكتبات مصر والعالم إلى جانب الدِّراسات الأكاديميَّة المدقِّقة التي تتكلَّم عن تراث الكنيسة القبطيَّة، سواء من عُلماء وطنيِّين وهُم قلَّة مقارنة بالمئات من العُلماء الأجانب الذين كتبوا في هذا المجال باللُّغات اليونانيَّة والقبطيَّة واللاَّتينيَّة والإنجليزيَّة والفرنسيَّة والألمانيَّة، مع ترجمة كلِّ هذه اللُّغات إلى اللُّغة العربيَّة، لكي تُصبح كُتُب الدُّرَّة الطَّقسيَّة للكنيسة القبطيَّة متاحة للقارئ العربي الذي لا يعرف سوى اللُّغة العربيَّة، ولكن في ذات الوقت، ظلَّت هذه الكُتُب بمستواها الأكاديمي الذي لا تخطئة أيُّ عين قارئ لها، فاحتلَّت مكانها على رفوف كُبريات المكتبات في العالم، ومنها مكتبة الكونجرس بالولايات المتَّحدة الأمريكيَّة على سبيل المثال. وكان لمكتبة دير القدِّيس أنبا مقار الكبير ببريَّة شيهيت الفضل الكبير، في اطلاعي على هذه المراجع الأجبية الغزيرة، قبل أن تُعرف شبكة المعلومات الدّوليَّة (الإنترنت) التي يسَّرت المراجع للدَّارسين.
          </Text>

          <Text style={styles.paragraphText}>
            لقد بدأت في قراءة متخصِّصة لهذه المجالات الثَّلاثة الآبائيَّة والقانونيَّة واللِّيتورجيَّة منذ خمسين سنة مضت، ثمَّ انتقلتُ لتدوين هذه الدِّراسات على الورق منذ سنة 1979م، ثمَّ التدوين على جهاز الكومبيوتر منذ سنة 1997م، حيث صدر الكتاب الأوَّل منها في القاهرة في يناير سنة 2000م، والكتاب الأخير منها في القاهرة في يناير سنة 2023م. وجاري ترجمة الكُتُب إلى اللُّغة الإنجليزيَّة، وأمَّا ما تُرجم منها بالفعل فهو موجود حاليًّا على موقع أمازون.
          </Text>

          <Text style={styles.paragraphText}>
            شاكراً كلَّ الشُّكر الذين دفعوني لهذا العمل، والذين ساعدوني مساعدة مخلِصة على إكماله.
          </Text>

          <Text style={styles.paragraphText}>
            الرَّب يعوضهم جميعاً بالأجر السَّمائي.
          </Text>

          <Text style={styles.paragraphText}>
            الأحد 28 إبريل سنة 2024م
          </Text>

          <Text style={styles.paragraphText}>
            عيد أحد الشَّعانين
          </Text>

          <Text style={styles.paragraphText}>
            الرَّاهب أثناسيوس المقاري
          </Text>
        </View>

        <Footer />
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 10,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.header,
    textAlign: 'center',
    marginBottom: 5,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.header,
  },
  imageContainer: {
    alignItems: 'center',
  },
  firstimage: {
    width: '90%',
    height: 100,
    borderRadius: 12,
  },
  secondimage: {
    height: 130,
    width: '80%',
    filter: 'invert(1)',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  bookItem: {
    width: '48%',
    marginBottom: 20,
    alignItems: 'center',
  },
  bookCover: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 5,
  },
  bookTitle: {
    fontWeight: '500',
    fontSize: 14,
    color: Colors.header,
  },
  bookDescription: {
    fontSize: 12,
    color: Colors.text,
    textAlign: 'right',
  },
  paragraphContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  paragraphTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'right',
    color: Colors.header,
    marginBottom: 10,
  },
  paragraphText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'right',
    marginBottom: 10,
    lineHeight: 22,
  },
});

export default LibraryScreen;