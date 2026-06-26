import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserCustomContent } from '../lib/firebase';
import type { TestResult, BookmarkedQuestion } from '../types';
import { uploadBase64ToSupabase } from '../lib/supabaseStorage';

// The Supabase storage URL pattern to detect
const SUPABASE_URL_PATTERN = /https:\/\/mcavmkqvshgpzsfzhvud\.supabase\.co\/storage\/v1\/object\/public\/study-images\/[^\s"'<>)]+/g;

// Backup file format
export interface BackupData {
  version: number;
  exportedAt: string;
  appName: string;
  data: {
    results: TestResult[];
    bookmarks: BookmarkedQuestion[];
    customContent: UserCustomContent | null;
    images: { [url: string]: string }; // url -> base64 data URL
  };
}

export interface ImportSummary {
  resultsCount: number;
  bookmarksCount: number;
  customTestsCount: number;
  customChaptersCount: number;
  imagesCount: number;
  exportedAt: string;
}

const CURRENT_VERSION = 1;
const APP_NAME = 'ExamPracticePortal';

/**
 * Find all Supabase image URLs in user custom content
 */
function findAllSupabaseUrls(customContent: UserCustomContent | null): string[] {
  if (!customContent) return [];

  const urls = new Set<string>();
  const jsonStr = JSON.stringify(customContent);

  const matches = jsonStr.match(SUPABASE_URL_PATTERN);
  if (matches) {
    matches.forEach(url => {
      // Clean up any trailing escaped characters from JSON
      const cleanUrl = url.replace(/\\"/g, '').replace(/\\'/g, '');
      urls.add(cleanUrl);
    });
  }

  return Array.from(urls);
}

/**
 * Download an image and convert to base64 data URL
 */
async function imageUrlToBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(`Failed to download image: ${url}`, error);
    return null;
  }
}

/**
 * Export all user data from Firebase as a BackupData object,
 * including Supabase images embedded as base64
 */
export async function exportUserData(
  userId: string,
  onProgress?: (message: string) => void
): Promise<BackupData> {
  onProgress?.('Fetching user data from cloud...');

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  let results: TestResult[] = [];
  let bookmarks: BookmarkedQuestion[] = [];
  let customContent: UserCustomContent | null = null;

  if (userSnap.exists()) {
    const data = userSnap.data();
    results = (data.results || []) as TestResult[];
    bookmarks = (data.bookmarks || []) as BookmarkedQuestion[];
    customContent = (data.customContent as UserCustomContent) || null;
  }

  // Find and download all Supabase images
  const images: { [url: string]: string } = {};
  const supabaseUrls = findAllSupabaseUrls(customContent);

  if (supabaseUrls.length > 0) {
    onProgress?.(`Downloading ${supabaseUrls.length} image(s)...`);

    // Download all images in parallel (batches of 5)
    for (let i = 0; i < supabaseUrls.length; i += 5) {
      const batch = supabaseUrls.slice(i, i + 5);
      const results = await Promise.all(
        batch.map(async (url) => {
          const base64 = await imageUrlToBase64(url);
          return { url, base64 };
        })
      );

      results.forEach(({ url, base64 }) => {
        if (base64) {
          images[url] = base64;
        }
      });

      onProgress?.(`Downloaded ${Math.min(i + 5, supabaseUrls.length)} of ${supabaseUrls.length} images...`);
    }
  }

  onProgress?.('Creating backup file...');

  return {
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    appName: APP_NAME,
    data: {
      results,
      bookmarks,
      customContent,
      images,
    },
  };
}

/**
 * Validate that the parsed JSON is a valid backup file
 */
export function validateBackupFile(data: any): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid file: not a valid JSON object.' };
  }

  if (data.appName !== APP_NAME) {
    return { valid: false, error: 'Invalid file: this backup is not from Exam Practice Portal.' };
  }

  if (typeof data.version !== 'number' || data.version < 1) {
    return { valid: false, error: 'Invalid file: unrecognized backup version.' };
  }

  if (!data.data || typeof data.data !== 'object') {
    return { valid: false, error: 'Invalid file: missing data section.' };
  }

  if (!Array.isArray(data.data.results)) {
    return { valid: false, error: 'Invalid file: results data is corrupted.' };
  }

  if (!Array.isArray(data.data.bookmarks)) {
    return { valid: false, error: 'Invalid file: bookmarks data is corrupted.' };
  }

  return { valid: true };
}

/**
 * Generate a summary of what will be imported
 */
export function getImportSummary(backupData: BackupData): ImportSummary {
  let customTestsCount = 0;
  let customChaptersCount = 0;

  if (backupData.data.customContent?.categories) {
    Object.values(backupData.data.customContent.categories).forEach((cat) => {
      customTestsCount += Object.keys(cat.tests || {}).length;
      customChaptersCount += Object.keys(cat.chapters || {}).length;
    });
  }

  const imagesCount = Object.keys(backupData.data.images || {}).length;

  return {
    resultsCount: backupData.data.results.length,
    bookmarksCount: backupData.data.bookmarks.length,
    customTestsCount,
    customChaptersCount,
    imagesCount,
    exportedAt: backupData.exportedAt,
  };
}

/**
 * Check if a URL is still accessible (returns 200)
 */
async function isUrlAlive(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Re-upload images from backup to Supabase ONLY if the original URL is dead.
 * If the original URL is still accessible, keep it (no duplicate upload).
 */
async function reuploadImages(
  customContent: UserCustomContent,
  images: { [url: string]: string },
  onProgress?: (message: string) => void
): Promise<UserCustomContent> {
  const imageUrls = Object.keys(images);
  if (imageUrls.length === 0) return customContent;

  // Build a URL replacement map: old URL -> new URL
  const urlMap: { [oldUrl: string]: string } = {};

  onProgress?.(`Checking ${imageUrls.length} image(s)...`);

  for (let i = 0; i < imageUrls.length; i += 5) {
    const batch = imageUrls.slice(i, i + 5);
    const results = await Promise.all(
      batch.map(async (oldUrl) => {
        // First check if original URL still works
        const alive = await isUrlAlive(oldUrl);
        if (alive) {
          // Original URL works — no need to re-upload
          return { oldUrl, newUrl: oldUrl, reused: true };
        }

        // URL is dead — re-upload from backup
        try {
          const base64Data = images[oldUrl];
          const newUrl = await uploadBase64ToSupabase(base64Data);
          return { oldUrl, newUrl, reused: false };
        } catch (error) {
          console.warn(`Failed to re-upload image: ${oldUrl}`, error);
          return { oldUrl, newUrl: oldUrl, reused: true };
        }
      })
    );

    let reusedCount = 0;
    let uploadedCount = 0;
    results.forEach(({ oldUrl, newUrl, reused }) => {
      urlMap[oldUrl] = newUrl;
      if (reused) reusedCount++;
      else uploadedCount++;
    });

    const processed = Math.min(i + 5, imageUrls.length);
    onProgress?.(`Processed ${processed}/${imageUrls.length} images (${uploadedCount} re-uploaded, ${reusedCount} still online)...`);
  }

  // Replace old URLs with new URLs in content (only for URLs that changed)
  let contentStr = JSON.stringify(customContent);
  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    if (oldUrl !== newUrl) {
      const escapedOld = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      contentStr = contentStr.replace(new RegExp(escapedOld, 'g'), newUrl);
    }
  }

  return JSON.parse(contentStr);
}

/**
 * Import backup data into Firebase, replacing existing user data.
 * Re-uploads images to Supabase and updates URLs.
 */
export async function importUserData(
  userId: string,
  backupData: BackupData,
  onProgress?: (message: string) => void
): Promise<boolean> {
  const userRef = doc(db, 'users', userId);

  try {
    let customContent = backupData.data.customContent;

    // Re-upload images if they exist in the backup
    if (customContent && backupData.data.images && Object.keys(backupData.data.images).length > 0) {
      customContent = await reuploadImages(customContent, backupData.data.images, onProgress);
    }

    onProgress?.('Saving data to cloud...');

    // Build the document data - replace everything
    const docData: any = {
      results: backupData.data.results || [],
      bookmarks: backupData.data.bookmarks || [],
      lastSynced: Date.now(),
    };

    if (customContent) {
      docData.customContent = customContent;
      docData.lastContentSync = Date.now();
    }

    await setDoc(userRef, docData, { merge: false });
    return true;
  } catch (error) {
    console.error('Failed to import user data:', error);
    return false;
  }
}

/**
 * Trigger a file download of the backup JSON
 */
export function downloadBackupFile(backupData: BackupData): void {
  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `exam-portal-backup-${date}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Read and parse a JSON file from a File input
 */
export function readBackupFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch {
        reject(new Error('Failed to parse file. Make sure it is a valid JSON backup file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}
