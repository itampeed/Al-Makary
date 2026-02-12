import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Layout from '../components/Layout';
import Colors from '../constants/Colors';
import { useLanguage } from '../contexts/LanguageContext';
import { ensureFileCached, readFileAsBase64 } from '../services/fileCache';
import { WebView } from 'react-native-webview';

const LecturesScreen = ({ onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const { t } = useLanguage();
  const [pdfBase64, setPdfBase64] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const PDF_URL = 'https://sfcuxyeybuwiunjmrood.supabase.co/storage/v1/object/public/randomfiles/makhtootatfile.pdf';

  useEffect(() => {
    loadPdf();
  }, []);

  const loadPdf = async () => {
    try {
      const localUri = await ensureFileCached(PDF_URL, 'makhtootatfile.pdf');
      
      if (!localUri) {
         throw new Error("Failed to download or cache file");
      }

      const base64 = await readFileAsBase64(localUri);
      
      if (!base64) {
          throw new Error("Failed to read file as base64");
      }

      setPdfBase64(base64);
    } catch (err) {
      console.error("Error loading PDF:", err);
      setError("Error loading document: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const getViewerHtml = (base64Data) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
        <script>
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        </script>
        <style>
          body { margin: 0; padding: 0; background-color: #525659; }
          #container { width: 100%; }
          canvas { display: block; width: 100%; height: auto; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div id="container"></div>
        <script>
          const pdfData = atob('${base64Data}');
          const loadingTask = pdfjsLib.getDocument({data: pdfData});
          
          loadingTask.promise.then(function(pdf) {
            const container = document.getElementById('container');
            for (let i = 1; i <= pdf.numPages; i++) {
              pdf.getPage(i).then(function(page) {
                const scale = 3.0;
                const viewport = page.getViewport({scale: scale});
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                container.appendChild(canvas);
                
                const renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };
                page.render(renderContext);
              });
            }
          });
        </script>
      </body>
    </html>
  `;

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
        {loading ? (
             <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.header} />
                <Text style={styles.loadingText}>{t('loading') || 'Loading...'}</Text>
             </View>
        ) : error ? (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        ) : (
            <WebView 
                source={{ html: getViewerHtml(pdfBase64) }}
                style={styles.webview}
                originWhitelist={['*']}
            />
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background,
  },
  webview: { 
    flex: 1, 
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#525659',
  },
  loadingContainer: { 
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  errorText: { color: 'red', fontSize: 16 },
});

export default LecturesScreen;