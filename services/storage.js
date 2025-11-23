import * as FileSystem from 'expo-file-system';

const CACHE_DIR = `${FileSystem.cacheDirectory}books/`;

export const ensureCacheDir = async () => {
  const info = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
  return CACHE_DIR;
};

export const getCachedPathFor = (fileName) => `${CACHE_DIR}${encodeURIComponent(fileName)}`;

export const isBookCached = async (fileName) => {
  await ensureCacheDir();
  const path = getCachedPathFor(fileName);
  const info = await FileSystem.getInfoAsync(path);
  return info.exists ? path : null;
};

// Secure-ish download: keep in app cache; no sharing; do not copy to external storage
export const downloadBookToCache = async (remoteUrl, fileName) => {
  await ensureCacheDir();
  const path = getCachedPathFor(fileName);
  const { exists } = await FileSystem.getInfoAsync(path);
  if (exists) return path;
  const res = await FileSystem.downloadAsync(remoteUrl, path, { md5: false });
  if (res.status !== 200) throw new Error('Download failed');
  return res.uri;
};