import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const CACHE_FOLDER = FileSystem.documentDirectory + 'book_cache/';

export const ensureCacheDirectory = async () => {
    try {
        const dirInfo = await FileSystem.getInfoAsync(CACHE_FOLDER);
        if (!dirInfo.exists) {
            console.log("Creating cache directory...");
            await FileSystem.makeDirectoryAsync(CACHE_FOLDER, { intermediates: true });
        }
    } catch (error) {
        console.error("Error creating cache directory:", error);
    }
};

/**
 * Downloads a file to local cache if not already present.
 * @param {string} remoteUrl 
 * @param {string} filename Optional filename, otherwise derived from URL
 * @returns {Promise<string>} Local URI
 */
export const ensureFileCached = async (remoteUrl, filename = null) => {
    if (!remoteUrl) return null;

    try {
        await ensureCacheDirectory();

        const name = filename || remoteUrl.split('/').pop().split('?')[0];
        const localUri = CACHE_FOLDER + name;

        const fileInfo = await FileSystem.getInfoAsync(localUri);

        if (fileInfo.exists) {
            console.log(`[Cache] File found locally: ${name}`);
            return localUri;
        }

        console.log(`[Cache] Downloading ${name}...`);
        const downloadRes = await FileSystem.downloadAsync(remoteUrl, localUri);
        
        if (downloadRes.status !== 200) {
            throw new Error(`Download failed with status ${downloadRes.status}`);
        }

        console.log(`[Cache] Downloaded to ${downloadRes.uri}`);
        return downloadRes.uri;

    } catch (error) {
        console.error("[Cache] Error ensuring file cached:", error);
        return remoteUrl; // Fallback to remote URL if caching fails
    }
};

/**
 * Reads a local file as Base64 string
 * @param {string} localUri 
 * @returns {Promise<string>} Base64 content
 */
export const readFileAsBase64 = async (localUri) => {
    try {
        return await FileSystem.readAsStringAsync(localUri, { encoding: FileSystem.EncodingType.Base64 });
    } catch (error) {
        console.error("[Cache] Error reading file as base64:", error);
        return null;
    }
};

export const clearCache = async () => {
    try {
        await FileSystem.deleteAsync(CACHE_FOLDER, { idempotent: true });
    } catch (e) {
        console.error("Error clearing cache", e);
    }
};