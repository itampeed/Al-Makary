// Supabase Configuration
// Get these values from your Supabase project settings: https://supabase.com/dashboard/project/uniugppoodxjwlyzyuhu/settings/api

const SUPABASE_URL = 'https://uniugppoodxjwlyzyuhu.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'; // Replace with your actual anon key from Supabase dashboard

// Storage bucket names
export const DATA_BUCKET = 'data';
export const BOOKS_BUCKET = 'books';
export const COVER_BUCKET = 'cover';

/**
 * Get public URL for a file in Supabase storage
 * @param {string} fileName - Name of the file in the bucket
 * @param {string} bucket - Bucket name (default: 'cover')
 * @returns {string} Public URL to the file
 */
export const getSupabaseFileUrl = (fileName, bucket = COVER_BUCKET) => {
  if (!fileName) return null;
  
  // Construct public URL for Supabase storage
  // Format: https://{project-ref}.supabase.co/storage/v1/object/public/{bucket}/{file}
  const encodedFileName = encodeURIComponent(fileName);
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodedFileName}`;
};

/**
 * Get public URL for a cover image
 * @param {string} fileName - Name of the image file
 * @returns {string} Public URL to the cover image
 */
export const getSupabaseImageUrl = (fileName) => {
  return getSupabaseFileUrl(fileName, COVER_BUCKET);
};

/**
 * Get public URL for a PDF book
 * @param {string} fileName - Name of the PDF file
 * @returns {string} Public URL to the PDF
 */
export const getSupabasePdfUrl = (fileName) => {
  return getSupabaseFileUrl(fileName, BOOKS_BUCKET);
};

/**
 * Get public URL for products.json from data bucket
 * @returns {string} Public URL to products.json
 */
export const getProductsJsonUrl = () => {
  return getSupabaseFileUrl('products.json', DATA_BUCKET);
};

/**
 * Fetch products.json from Supabase storage
 * @returns {Promise<Object>} Parsed JSON data
 */
export const fetchProductsJson = async () => {
  const url = getProductsJsonUrl();
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch products.json: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  return JSON.parse(text);
};

export default {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  dataBucket: DATA_BUCKET,
  booksBucket: BOOKS_BUCKET,
  coverBucket: COVER_BUCKET,
};

