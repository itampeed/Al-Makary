import React from 'react';
import { View, Text, StyleSheet, ScrollView, I18nManager } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';

const AboutScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  // Ensure proper RTL text rendering
  I18nManager.allowRTL(true);

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
        {/* Page Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>عن الدرة الطقسية</Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.heading}>
            الدُّرَّة الطَّقسيَّة للكنيسة القبطيَّة بين الكنائس الشَّرقيَّة
          </Text>

          <Text style={styles.text}>
            تضُم الدُّرَّة الطَّقسيَّة واحداً وخمسين كتاباً من القطع المتوسِّط، تشمل 22195 صفحة، بمعدَّل 435 صفحة للكتاب الواحد. وهي تبحث وتوثِّق تُراث الكنيسة القبطيَّة الآبائي والقانوني واللِّيتورجي بكلِّ دقة، بدءاً من القرن الأوَّل وحتى منتصف القرن العشرين للميلاد. والتُّراث اللِّيتورجي للكنيسة القبطيَّة يعني صلواتها وأسرارها وأصوامها وأعيادها.
          </Text>

          <Text style={styles.text}>
            ولقد استعنتُ في هذه الدِّراسات التراثيَّة بمئات المخطوطات القبطيَّة المنتشرة في متاحف ومكتبات مصر والعالم إلى جانب الدِّراسات الأكاديميَّة المدقِّقة التي تتكلَّم عن تراث الكنيسة القبطيَّة، سواء من عُلماء وطنيِّين وهُم قلَّة مقارنة بالمئات من العُلماء الأجانب الذين كتبوا في هذا المجال باللُّغات اليونانيَّة والقبطيَّة واللاَّتينيَّة والإنجليزيَّة والفرنسيَّة والألمانيَّة، مع ترجمة كلِّ هذه اللُّغات إلى اللُّغة العربيَّة، لكي تُصبح كُتُب الدُّرَّة الطَّقسيَّة للكنيسة القبطيَّة متاحة للقارئ العربي الذي لا يعرف سوى اللُّغة العربيَّة، ولكن في ذات الوقت، ظلَّت هذه الكُتُب بمستواها الأكاديمي الذي لا تخطئة أيُّ عين قارئ لها، فاحتلَّت مكانها على رفوف كُبريات المكتبات في العالم، ومنها مكتبة الكونجرس بالولايات المتَّحدة الأمريكيَّة على سبيل المثال. وكان لمكتبة دير القدِّيس أنبا مقار الكبير ببريَّة شيهيت الفضل الكبير، في اطلاعي على هذه المراجع الأجنبية الغزيرة، قبل أن تُعرف شبكة المعلومات الدّوليَّة (الإنترنت) التي يسَّرت المراجع للدَّارسين.
          </Text>

          <Text style={styles.text}>
            لقد بدأت في قراءة متخصِّصة لهذه المجالات الثَّلاثة الآبائيَّة والقانونيَّة واللِّيتورجيَّة منذ خمسين سنة مضت، ثمَّ انتقلتُ لتدوين هذه الدِّراسات على الورق منذ سنة 1979م، ثمَّ التدوين على جهاز الكومبيوتر منذ سنة 1997م، حيث صدر الكتاب الأوَّل منها في القاهرة في يناير سنة 2000م، والكتاب الأخير منها في القاهرة في يناير سنة 2023م. وجاري ترجمة الكُتُب إلى اللُّغة الإنجليزيَّة، وأمَّا ما تُرجم منها بالفعل فهو موجود حاليًّا على موقع أمازون.
          </Text>

          <Text style={styles.text}>
            شاكراً كلَّ الشُّكر الذين دفعوني لهذا العمل، والذين ساعدوني مساعدة مخلِصة على إكماله.
          </Text>

          <Text style={styles.text}>الرَّب يعوضهم جميعاً بالأجر السَّمائي.</Text>

          <Text style={styles.text}>الأحد 28 إبريل سنة 2024م</Text>
          <Text style={styles.text}>عيد أحد الشَّعانين</Text>
          <Text style={styles.text}>الرَّاهب أثناسيوس المقاري</Text>
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
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.header,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.header,
    textAlign: 'right',
    lineHeight: 32,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'right',
    lineHeight: 30,
    marginBottom: 15,
  },
});

export default AboutScreen;
