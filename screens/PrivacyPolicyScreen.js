import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';

const PrivacyPolicyScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
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
          <Text style={styles.title}>سياسة الخصوصية</Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.heading}>1. مقدمة</Text>
          <Text style={styles.text}>
            نحن نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيف نقوم بجمع واستخدام وحماية المعلومات التي تقدمها لنا.
          </Text>

          <Text style={styles.heading}>2. جمع المعلومات الشخصية</Text>
          <Text style={styles.text}>
            نقوم بجمع المعلومات الشخصية التي تقدمها لنا عند التسجيل على الموقع، مثل اسمك، بريدك الإلكتروني، وعنوانك. يمكننا أيضًا جمع معلومات عن استخدامك للموقع مثل الصفحات التي تزورها.
          </Text>

          <Text style={styles.heading}>3. استخدام المعلومات الشخصية</Text>
          <Text style={styles.text}>
            نستخدم المعلومات التي نجمعها للأغراض التالية:
            {'\n'}• توفير وتحسين خدماتنا.
            {'\n'}• معالجة الطلبات والمعاملات.
            {'\n'}• إرسال إشعارات بالبريد الإلكتروني حول المنتجات والعروض الخاصة.
            {'\n'}• تحليل استخدام الموقع لتحسين الأداء.
          </Text>

          <Text style={styles.heading}>4. حماية المعلومات الشخصية</Text>
          <Text style={styles.text}>
            نتخذ إجراءات أمنية معقولة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير.
          </Text>

          <Text style={styles.heading}>5. مشاركة المعلومات الشخصية</Text>
          <Text style={styles.text}>
            لن نقوم ببيع أو تأجير معلوماتك الشخصية لأطراف ثالثة. قد نشارك المعلومات مع مزودي الخدمات الذين يساعدوننا في تشغيل الموقع أو تنفيذ الأعمال.
          </Text>

          <Text style={styles.heading}>6. حقوقك</Text>
          <Text style={styles.text}>
            لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها وطلب حذفها. إذا كنت ترغب في ممارسة هذه الحقوق، يرجى الاتصال بنا على البريد الإلكتروني.
          </Text>

          <Text style={styles.heading}>7. التغييرات على سياسة الخصوصية</Text>
          <Text style={styles.text}>
            قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة. نوصي بمراجعة هذه السياسة بانتظام.
          </Text>

          <Text style={styles.heading}>8. الاتصال بنا</Text>
          <Text style={styles.text}>
            إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية، يرجى الاتصال بنا.
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
    paddingTop: 20,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
    marginBottom: 8,
    lineHeight: 30,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'right',
    lineHeight: 28,
    marginBottom: 15,
  },
});

export default PrivacyPolicyScreen;