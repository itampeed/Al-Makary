import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import Layout from '../components/Layout';
import Colors from '../constants/Colors';
import { useLanguage } from '../contexts/LanguageContext';

const BookReaderScreen = ({ routeParam, onMenuPress, isMenuVisible, onCloseMenu, onNavigate, currentScreen, onBack, showBack }) => {
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const remoteUrl = useMemo(() => {
    if (routeParam && routeParam.startsWith('reader:')) {
      const encoded = routeParam.slice('reader:'.length);
      try { return decodeURIComponent(encoded); } catch { return encoded; }
    }
    return null;
  }, [routeParam]);

  /* 
   * Custom PDF Viewer using Mozilla's PDF.js
   * This approach allows us to render the PDF inside the WebView WITHOUT any 
   * external toolbars, download buttons, or "pop-out" icons.
   * It renders the PDF pages as simple Canvas elements.
   */
  /* 
   * Custom PDF Viewer using Mozilla's PDF.js
   * Optimized for Mobile:
   * 1. Lazy Loading: Loads pages in batches of 20 to save memory.
   * 2. Skeletons: Shows loading placeholders while rendering.
   * 3. Resolution: Adjusted scale for mobile width (1.5x for crispness/performance balance).
   */
  const getViewerHtml = (url) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
        <script>
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        </script>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            background-color: #525659; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            min-height: 100vh;
          }
          .page-container { 
            margin: 10px 0; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.3); 
            background: white;
            position: relative;
            min-height: 200px; /* Min height to prevent collapse */
          }
          canvas { display: block; max-width: 100%; height: auto; }
          
          /* Skeleton Loading */
          .skeleton {
            width: 100vw;
            height: 140vw; /* Approx A4 aspect ratio */
            background: #e0e0e0;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .skeleton::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 1.5s infinite;
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          #loader { 
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
            color: white; font-family: sans-serif; font-size: 16px; 
            background: rgba(0,0,0,0.7); padding: 10px 20px; borderRadius: 20px;
            z-index: 100;
          }
          #sentinel { height: 10px; width: 100%; background: transparent; }
        </style>
      </head>
      <body>
        <div id="loader">Loading Document...</div>
        <div id="container"></div>
        <div id="sentinel"></div>
        
        <script>
          const url = '${url}';
          const container = document.getElementById('container');
          const loader = document.getElementById('loader');
          
          let pdfDoc = null;
          let pageNum = 1;
          const BATCH_SIZE = 20;
          let rendering = false;
          let hasMore = true;

          // Intersection Observer for Infinite Scroll
          const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting && !rendering && hasMore && pdfDoc) {
              renderBatch();
            }
          }, { rootMargin: '200px' });

          observer.observe(document.getElementById('sentinel'));

          async function renderPage(num) {
            // Create container and skeleton first
            const div = document.createElement('div');
            div.className = 'page-container';
            
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton';
            div.appendChild(skeleton);
            container.appendChild(div);

            try {
              const page = await pdfDoc.getPage(num);
              
              // Mobile-first resolution optimization
              // Using window.innerWidth as base. 1.5x scale offers good crispness without 2x memory cost.
              const desiredWidth = window.innerWidth; 
              const viewportRaw = page.getViewport({scale: 1});
              const scale = (desiredWidth * 1.5) / viewportRaw.width; 
              
              const viewport = page.getViewport({scale: scale});
              
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              canvas.style.width = '100%'; 
              
              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };
              
              await page.render(renderContext).promise;
              
              // Replace skeleton with canvas
              div.replaceChild(canvas, skeleton);
              // Set explicit height to prevent layout shifts if needed, but canvas usually handles it
              
            } catch (err) {
              console.error('Page render error:', err);
              div.innerHTML = '<div style="padding:20px; color:red">Error loading page ' + num + '</div>';
            }
          }

          async function renderBatch() {
            if (rendering || !hasMore) return;
            rendering = true;
            
            const endPage = Math.min(pageNum + BATCH_SIZE - 1, pdfDoc.numPages);
            
            // Render sequentially to keep order
            for(let i = pageNum; i <= endPage; i++) {
               await renderPage(i);
            }
            
            pageNum = endPage + 1;
            if (pageNum > pdfDoc.numPages) {
              hasMore = false;
            }
            rendering = false;
            
            // Re-trigger observer if we still have space and haven't filled screen (rare but possible)
          }

          pdfjsLib.getDocument(url).promise.then(async function(pdf) {
            pdfDoc = pdf;
            loader.style.display = 'none';
            renderBatch(); // Render first batch
          }).catch(function(error) {
            loader.innerText = 'Error: ' + error.message;
            console.error('Error loading PDF:', error);
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
        {remoteUrl ? (
            <WebView 
                source={{ html: getViewerHtml(remoteUrl) }}
                style={styles.webview}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.header} />
                        <Text style={styles.loadingText}>{t('loading') || 'Loading...'}</Text>
                    </View>
                )}
                originWhitelist={['*']}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                }}
            />
        ) : (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{t('error') || 'Error loading book'}</Text>
            </View>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  webview: { flex: 1 },
  loadingContainer: { 
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 1
  },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  errorText: { color: 'red', fontSize: 16, marginBottom: 10 },
});

export default BookReaderScreen;