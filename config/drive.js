// Google Drive configuration and helpers

// OPTIONAL: Google Drive API key (enable Drive API in Google Cloud). If provided, the app can list folders by name.
export const DRIVE_API_KEY = '8879061036-j8kj0vosb0goeurbe0ujonaptnkpdhrp.apps.googleusercontent.com';

// Parent shared folder (contains: structure, covers, books)
export const PARENT_FOLDER_ID = '1vTyziAIUWYB9H3q9H053umg8NfYOMXvU';

// Explicit folder IDs (provided by you)
export const DRIVE_FOLDERS = {
  structureFolderId: '10CLWruqMReDRwTJgqZL6elwI1Et12oMa',
  coversFolderId: '1mI0uA_yvYVHwDq5mFzyy5OTUo3VuOifY',
  booksFolderId: '1V1rkIYeK-fd52zqgrX5X0ZsrtrzoOOH4',
};

// If you know the file ID of almakary.json, set it here for direct download
export const STRUCTURE_FILE_ID = '1-Oqpuig37E5UFqMa4WlfFBzt_UXtT2xv';
export const STRUCTURE_FILE_URL = '';

// Build a direct download URL. If API key set, prefer Drive API alt=media; else use public uc link
export const buildDownloadUrl = (fileId) => {
  if (!fileId) return null;
  if (DRIVE_API_KEY && !DRIVE_API_KEY.includes('YOUR_DRIVE_API_KEY_HERE')) {
    return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${DRIVE_API_KEY}`;
  }
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

// Drive API helpers (listing requires API key)
export const driveApi = {
  listFilesInFolder: async (folderId) => {
    if (!folderId) return [];
    const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
    const fields = encodeURIComponent('files(id,name,mimeType,modifiedTime,thumbnailLink,webViewLink,webContentLink,size)');
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&includeItemsFromAllDrives=true&supportsAllDrives=true&pageSize=1000&key=${DRIVE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      let body = '';
      try { body = await res.text(); } catch {}
      throw new Error(`Drive list failed: ${res.status} ${body}`);
    }
    const json = await res.json();
    return json.files || [];
  },
  getFileContent: async (fileId) => {
    const url = buildDownloadUrl(fileId);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Drive file fetch failed');
    return res;
  },
};

export const isDriveListingAvailable = () => !!DRIVE_API_KEY && !DRIVE_API_KEY.includes('YOUR_DRIVE_API_KEY_HERE');
export const hasValidDriveConfig = () => {
  return !!(STRUCTURE_FILE_ID || STRUCTURE_FILE_URL || isDriveListingAvailable());
};