import { buildDownloadUrl, hasValidDriveConfig, DRIVE_FOLDERS, STRUCTURE_FILE_ID, STRUCTURE_FILE_URL, driveApi, isDriveListingAvailable, PARENT_FOLDER_ID } from '../config/drive';

const extractDriveId = (maybeUrl) => {
  if (!maybeUrl || typeof maybeUrl !== 'string') return null;
  // Matches: https://drive.google.com/file/d/{id}/view?... or .../uc?export=download&id={id}
  const m1 = maybeUrl.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (m1 && m1[1]) return m1[1];
  const m2 = maybeUrl.match(/[?&]id=([^&]+)/i);
  if (m2 && m2[1]) return m2[1];
  // If it looks like a raw ID (no schema, no domain, 20+ chars), accept it
  if (!/^https?:/i.test(maybeUrl) && maybeUrl.length >= 20) return maybeUrl;
  return null;
};

const normalizeDriveUrl = (maybeUrlOrId) => {
  if (!maybeUrlOrId) return null;
  const id = extractDriveId(maybeUrlOrId);
  return id ? buildDownloadUrl(id) : null;
};

// Discover child folders and fetch almakary.json
const discoverChildFolders = async () => {
  if (DRIVE_FOLDERS?.structureFolderId && DRIVE_FOLDERS?.coversFolderId && DRIVE_FOLDERS?.booksFolderId) {
    return {
      structureFolderId: DRIVE_FOLDERS.structureFolderId,
      coversFolderId: DRIVE_FOLDERS.coversFolderId,
      booksFolderId: DRIVE_FOLDERS.booksFolderId,
    };
  }
  if (isDriveListingAvailable()) {
    const children = await driveApi.listFilesInFolder(PARENT_FOLDER_ID);
    const folders = children.filter((f) => f.mimeType === 'application/vnd.google-apps.folder');
    const byName = {};
    folders.forEach((f) => { byName[f.name.toLowerCase()] = f.id; });
    return {
      structureFolderId: byName['structure'],
      coversFolderId: byName['covers'],
      booksFolderId: byName['books'],
    };
  }
  return {
    structureFolderId: DRIVE_FOLDERS.structureFolderId,
    coversFolderId: DRIVE_FOLDERS.coversFolderId,
    booksFolderId: DRIVE_FOLDERS.booksFolderId,
  };
};

export const fetchCatalogJson = async () => {
  const { structureFolderId } = await discoverChildFolders();
  if (STRUCTURE_FILE_ID || STRUCTURE_FILE_URL) {
    const url = STRUCTURE_FILE_URL || buildDownloadUrl(STRUCTURE_FILE_ID);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch catalog');
    const text = await res.text();
    return JSON.parse(text);
  }
  if (isDriveListingAvailable() && structureFolderId) {
    const files = await driveApi.listFilesInFolder(structureFolderId);
    const jsonFile = files.find((f) => f.name.toLowerCase().endsWith('.json'));
    if (!jsonFile) throw new Error('almakary.json not found');
    const res = await driveApi.getFileContent(jsonFile.id);
    const text = await res.text();
    return JSON.parse(text);
  }
  throw new Error('almakary.json file reference missing');
};

// Map cover names => public download URLs
export const fetchCoversIndex = async () => {
  if (isDriveListingAvailable()) {
    const { coversFolderId } = await discoverChildFolders();
    if (!coversFolderId) return {};
    const files = await driveApi.listFilesInFolder(coversFolderId);
    const index = {};
    files.forEach((f) => { index[f.name] = buildDownloadUrl(f.id); });
    return index;
  }
  return {};
};

// Map pdf names => public download URLs
export const fetchBooksIndex = async () => {
  if (isDriveListingAvailable()) {
    const { booksFolderId } = await discoverChildFolders();
    if (!booksFolderId) return {};
    const files = await driveApi.listFilesInFolder(booksFolderId);
    const index = {};
    files.forEach((f) => { index[f.name] = buildDownloadUrl(f.id); });
    return index;
  }
  return {};
};

// Unified function: returns normalized catalog with resolved coverUrl and pdfUrl
export const fetchCatalogFromDrive = async () => {
  if (!hasValidDriveConfig()) {
    throw new Error('Drive API key not configured');
  }
  const [catalog, covers, pdfs] = await Promise.all([
    fetchCatalogJson(),
    fetchCoversIndex(),
    fetchBooksIndex(),
  ]);
  const books = (catalog.books || []).map((b, i) => ({
    id: b.id || `bk-${i + 1}`,
    title: b.title || b.displayName,
    author: b.author || 'غير معروف',
    price: b.price || 0,
    description: b.description || '',
    category: b.category || 'عام',
    language: b.language || 'عربي',
    pages: b.pages || 0,
    sku: b.sku,
    // Accept either IDs or URLs directly in JSON
    coverImage: b.coverImage,
    coverUrl: normalizeDriveUrl(b.coverUrl) || normalizeDriveUrl(b.coverId) || (covers[b.coverImage] || null),
    pdfFile: b.pdfFile,
    pdfUrl: normalizeDriveUrl(b.pdfUrl) || normalizeDriveUrl(b.pdfId) || (pdfs[b.pdfFile] || null),
  }));
  return { books };
};


