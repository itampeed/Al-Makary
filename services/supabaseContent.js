import { fetchProductsJson, getSupabaseImageUrl, getSupabasePdfUrl } from '../config/supabase';

/**
 * Fetch catalog from Supabase storage
 * Loads products.json from 'data' bucket, then resolves cover and PDF URLs
 * @returns {Promise<Object>} Object with books array
 */
export const fetchCatalogFromSupabase = async () => {
  try {
    // Fetch products.json from data bucket
    const productsData = await fetchProductsJson();
    
    // Map products to books format with Supabase URLs
    const books = (productsData.products || []).map((product, i) => {
      // Get cover URL from cover bucket using image field
      const coverUrl = product.image ? getSupabaseImageUrl(product.image) : null;
      
      // Get PDF URL from books bucket using pdfFile field
      const pdfUrl = product.pdfFile ? getSupabasePdfUrl(product.pdfFile) : null;
      
      return {
        id: product.id || `bk-${i + 1}`,
        title: product.title || '',
        author: product.author || 'غير معروف',
        price: product.price || 0,
        description: product.description || '',
        category: product.category || 'عام',
        language: product.language || 'عربي',
        pages: product.pages || 0,
        sku: product.sku,
        // Map image field to coverImage for consistency
        coverImage: product.image,
        coverUrl: coverUrl,
        pdfFile: product.pdfFile,
        pdfUrl: pdfUrl,
      };
    });
    
    return { books };
  } catch (error) {
    console.error('Error fetching catalog from Supabase:', error);
    throw error;
  }
};

