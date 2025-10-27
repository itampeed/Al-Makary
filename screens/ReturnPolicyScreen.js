import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';

const ReturnPolicyScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
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
          <Text style={styles.title}>سياسة الاسترجاع والاستبدال</Text>
        </View>
        
        {/* Main Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.heading}>سياسة البيع</Text>

          <Text style={styles.subheading}>1. شراء الكتب:</Text>
          <Text style={styles.text}>
            يمكن شراء الكتب من خلال الموقع الإلكتروني عبر الخطوات البسيطة المتاحة.
            بعد إضافة الكتب إلى السلة، يمكنك مراجعة الطلب وإكمال عملية الدفع.
          </Text>

          <Text style={styles.subheading}>2. طرق الدفع:</Text>
          <Text style={styles.text}>
            نقبل الدفع عبر بطاقات الائتمان (فيزا، ماستر كارد).
            الدفع عبر التحويل البنكي متاح أيضًا، ولكن يتم تأكيد الطلب بعد استلام الدفعة.
          </Text>

          <Text style={styles.subheading}>3. التوصيل والشحن:</Text>
          <Text style={styles.text}>
            نقوم بشحن الطلبات محليًا ودوليًا.
            تختلف مدة التوصيل حسب الموقع الجغرافي، ويتم تزويدك بتفاصيل الشحن وتقدير مدة التوصيل عند إتمام الطلب.
            رسوم الشحن تحتسب بناءً على الوجهة ووزن الكتب.
          </Text>

          <Text style={styles.heading}>سياسة الاسترداد</Text>

          <Text style={styles.subheading}>1. الإرجاع والاستبدال:</Text>
          <Text style={styles.text}>
            يمكنك إرجاع الكتب أو استبدالها خلال 14 يومًا من استلام الطلب.
            يجب أن تكون الكتب بحالة جديدة وغير مستخدمة، مع الحفاظ على التغليف الأصلي.
          </Text>

          <Text style={styles.subheading}>2. عملية الاسترداد:</Text>
          <Text style={styles.text}>
            للتقدم بطلب إرجاع أو استبدال، يرجى الاتصال بخدمة العملاء عبر البريد الإلكتروني أو الهاتف.
            سيُطلب منك تزويدنا بتفاصيل الطلب وصورة من الفاتورة.
          </Text>

          <Text style={styles.subheading}>3. استرداد الأموال:</Text>
          <Text style={styles.text}>
            بعد استلام الكتب المرتجعة والتحقق من حالتها، سنقوم بمعالجة استرداد الأموال إلى طريقة الدفع الأصلية.
            قد يستغرق الاسترداد من 5 إلى 10 أيام عمل للوصول إلى حسابك.
          </Text>

          <Text style={styles.heading}>الاتصال بنا</Text>
          <Text style={styles.text}>
            إذا كان لديك أي استفسارات أو تحتاج إلى مساعدة إضافية، يرجى التواصل معنا عبر:
          </Text>

          <Text style={styles.contact}>info@athanasiusalmakary.com</Text>
          <Text style={styles.contact}>+201229574466</Text>
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
    marginBottom: 10,
    lineHeight: 30,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'right',
    color: 'gray',
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'right',
    lineHeight: 28,
    marginBottom: 10,
  },
  contact: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'right',
    lineHeight: 26,
  },
});

export default ReturnPolicyScreen;