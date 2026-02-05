import { fetchProductsJson, getSupabaseImageUrl, getSupabasePdfUrl } from '../config/supabase';

/**
 * Fetch catalog from Supabase storage
 * Loads products.json from 'data' bucket, then resolves cover and PDF URLs
 * @returns {Promise<Object>} Object with books array
 */
const SUPABASE_FILE_BUCKET_URL = 'https://sfcuxyeybuwiunjmrood.supabase.co/storage/v1/object/public/file/products.json';
const SUPABASE_COVER_BUCKET_URL = 'https://sfcuxyeybuwiunjmrood.supabase.co/storage/v1/object/public/covers/';
const SUPABASE_BOOK_BUCKET_URL = 'https://sfcuxyeybuwiunjmrood.supabase.co/storage/v1/object/public/books/';

/**
 * Fetch catalog from Supabase storage
 * Loads products.json directly from the public URL
 * @returns {Promise<Array>} Array of book objects
 */
export const fetchCatalogFromSupabase = async () => {
    try {
        console.log('Fetching catalog from:', SUPABASE_FILE_BUCKET_URL);
        const response = await fetch(SUPABASE_FILE_BUCKET_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch catalog: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const products = data.products || [];
        
        // Map to internal format
        const books = products.map((product, index) => {
            const coverUrl = product.image ? `${SUPABASE_COVER_BUCKET_URL}${product.image}` : null;
            const pdfUrl = product.pdfFile ? `${SUPABASE_BOOK_BUCKET_URL}${product.pdfFile}` : null;

            return {
                id: product.id || `bk-${index}`,
                title: product.title,
                author: product.author,
                pages: product.pages,
                language: product.language,
                category: product.category,
                series: product.series,
                coverUrl: coverUrl,
                pdfUrl: pdfUrl,
                pdfFile: product.pdfFile, // Keep original filename refernece if needed
                description: product.description // In case description exists
            };
        });

        console.log(`Fetched ${books.length} books from Supabase`);
        return books;

    } catch (error) {
        console.error('Error in fetchCatalogFromSupabase:', error);
        return []; // Return empty array on error to prevent crashes
    }
};

