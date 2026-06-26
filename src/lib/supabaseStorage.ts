import { supabase, STORAGE_BUCKET } from './supabase';

/**
 * Upload an image file to Supabase Storage and return its public URL.
 * Files are stored under a unique timestamped path to prevent collisions.
 */
export async function uploadImageToSupabase(file: File): Promise<string> {
    // Generate a unique file path: images/timestamp-random.ext
    const ext = file.name.split('.').pop() || 'png';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const filePath = `images/${uniqueName}`;

    const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
    }

    // Get the public URL for the uploaded file
    const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

/**
 * Upload a base64 data URL image to Supabase Storage.
 * Converts the base64 string to a File object, then uploads it.
 * Returns the public URL.
 */
export async function uploadBase64ToSupabase(base64DataUrl: string): Promise<string> {
    // Extract the MIME type and base64 data
    const matches = base64DataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
        throw new Error('Invalid base64 data URL');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const ext = mimeType.split('/')[1] || 'png';

    // Convert base64 to Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Create a File from the Blob
    const file = new File([blob], `pasted-image.${ext}`, { type: mimeType });

    return uploadImageToSupabase(file);
}

/**
 * Extract the storage file path from a Supabase public URL.
 * E.g. "https://xxx.supabase.co/storage/v1/object/public/study-images/images/123.png"
 *   -> "images/123.png"
 */
export function extractFilePathFromUrl(url: string): string | null {
    const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return url.substring(idx + marker.length);
}

/**
 * Delete a list of files from Supabase Storage by their public URLs.
 * Extracts file paths from URLs and bulk-deletes them.
 */
export async function deleteImagesByUrls(urls: string[]): Promise<void> {
    const filePaths = urls
        .map(extractFilePathFromUrl)
        .filter((p): p is string => p !== null);

    if (filePaths.length === 0) return;

    // Supabase allows bulk delete in batches
    const batchSize = 20;
    for (let i = 0; i < filePaths.length; i += batchSize) {
        const batch = filePaths.slice(i, i + batchSize);
        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove(batch);

        if (error) {
            console.warn('Failed to delete some images:', error);
        }
    }
}

