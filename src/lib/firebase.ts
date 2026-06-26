import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    type User
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
    onSnapshot,
    arrayUnion,
    updateDoc
} from 'firebase/firestore';
import type { TestResult, BookmarkedQuestion } from '../types';
import { deleteImagesByUrls } from './supabaseStorage';

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
// Force account selection every time (don't auto-login)
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export const logout = () => signOut(auth);

// Delete user account and all their data from Firestore + Supabase images
export const deleteUserAccount = async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    try {
        // First, fetch user data to find Supabase image URLs
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            const customContent = data.customContent;
            if (customContent) {
                // Find all Supabase image URLs in user content
                const jsonStr = JSON.stringify(customContent);
                const supabaseUrlPattern = /https:\/\/mcavmkqvshgpzsfzhvud\.supabase\.co\/storage\/v1\/object\/public\/study-images\/[^\s"'<>)\\]+/g;
                const matches = jsonStr.match(supabaseUrlPattern);
                if (matches && matches.length > 0) {
                    const uniqueUrls = [...new Set(matches.map(u => u.replace(/\\"/g, '').replace(/\\'/g, '')))];
                    console.log(`[Delete Account] Cleaning up ${uniqueUrls.length} Supabase images...`);
                    await deleteImagesByUrls(uniqueUrls);
                    console.log('[Delete Account] Supabase images deleted.');
                }
            }
        }

        // Then delete the Firestore document
        await deleteDoc(userRef);
        await signOut(auth);
        return true;
    } catch (error) {
        console.error("Failed to delete user account:", error);
        throw error;
    }
};

// Database persistence helpers
export const syncUserData = async (
    user: User,
    localResults: TestResult[],
    localBookmarks: BookmarkedQuestion[]
) => {
    if (!user) return null;

    const userRef = doc(db, 'users', user.uid);

    try {
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            // User exists, merge cloud data with local
            const cloudData = userSnap.data();
            return {
                results: (cloudData.results || []) as TestResult[],
                bookmarks: (cloudData.bookmarks || []) as BookmarkedQuestion[]
            };
        } else {
            // New user, save local existing data to cloud
            await setDoc(userRef, {
                email: user.email,
                results: localResults,
                bookmarks: localBookmarks,
                lastSynced: Date.now()
            });
            return { results: localResults, bookmarks: localBookmarks };
        }
    } catch (error) {
        console.error("Sync failed:", error);
        return null;
    }
};

// Helper to remove undefined fields which Firestore doesn't like
const sanitizeData = (data: any): any => {
    return JSON.parse(JSON.stringify(data));
};

export const saveUserResult = async (userId: string, result: TestResult) => {
    const userRef = doc(db, 'users', userId);
    try {
        const cleanResult = sanitizeData(result);
        await setDoc(userRef, {
            results: arrayUnion(cleanResult)
        }, { merge: true });
    } catch (error) {
        console.error("Error saving result:", error);
    }
};

export const saveUserBookmark = async (userId: string, bookmark: BookmarkedQuestion) => {
    const userRef = doc(db, 'users', userId);
    try {
        const cleanBookmark = sanitizeData(bookmark);
        await setDoc(userRef, {
            bookmarks: arrayUnion(cleanBookmark)
        }, { merge: true });
    } catch (error) {
        console.error("Error saving bookmark:", error);
    }
};

export const removeUserBookmark = async (userId: string, bookmarkId: string) => {
    const userRef = doc(db, 'users', userId);
    try {
        // We need the full object to remove it with arrayRemove, but since we only have ID,
        // we have to read, filter, and write back. 
        // OR better: we can't use arrayRemove properly with just ID if objects vary.
        // But for consistency let's stick to the read-filter-write pattern for REMOVAL 
        // to be safe, OR just use the previous logic but robustify it.
        // Actually, let's keep the read-modify-write for REMOVAL as it's complex to use arrayRemove with partial data.
        // BUT we must ensure the document exists.

        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const currentBookmarks = userSnap.data().bookmarks || [];
            const updatedBookmarks = currentBookmarks.filter((b: BookmarkedQuestion) => b.id !== bookmarkId);
            await setDoc(userRef, {
                bookmarks: updatedBookmarks
            }, { merge: true });
        }
    } catch (error) {
        console.error("Error removing bookmark:", error);
    }
};

// User-created content (questions/tests) persistence
export interface UserCustomContent {
    categories: {
        [categoryId: string]: {
            tests: {
                [testId: string]: {
                    name: string;
                    questions: any[];
                    studyMaterial?: any;
                    timeLimitMinutes?: number;
                    subjectId?: string; // For categories with subjects
                    chapterId?: string; // For tests inside chapters
                    isModification?: boolean; // True if this modifies a default test
                };
            };
            chapters?: {
                [chapterId: string]: {
                    name: string;
                    subjectId: string;
                    notes?: any; // Chapter-level study notes
                };
            };
        };
    };
}

export const saveUserContent = async (userId: string, customContent: UserCustomContent) => {
    const userRef = doc(db, 'users', userId);
    try {
        const cleanContent = sanitizeData(customContent);
        // Use updateDoc to replace the entire customContent map field.
        // This prevents Firestore setDoc with { merge: true } from recursively merging 
        // and preserving deleted chapters or tests.
        await updateDoc(userRef, {
            customContent: cleanContent,
            lastContentSync: Date.now()
        });
        return true;
    } catch (error: any) {
        // If the document doesn't exist yet, fall back to setDoc
        if (error && (error.code === 'not-found' || error.message?.includes('not found') || error.message?.includes('No document to update'))) {
            try {
                await setDoc(userRef, {
                    customContent: sanitizeData(customContent),
                    lastContentSync: Date.now()
                }, { merge: true });
                return true;
            } catch (innerError) {
                console.error("Failed to save user content with fallback setDoc:", innerError);
                return false;
            }
        }
        console.error("Failed to save user content:", error);
        return false;
    }
};

export const getUserContent = async (userId: string): Promise<UserCustomContent | null> => {
    const userRef = doc(db, 'users', userId);
    try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return (userSnap.data().customContent as UserCustomContent) || null;
        }
        return null;
    } catch (error) {
        console.error("Failed to get user content:", error);
        return null;
    }
};

// Real-time listener for user content changes
export const subscribeToUserContent = (
    userId: string,
    onContentChange: (content: UserCustomContent | null) => void
): (() => void) => {
    const userRef = doc(db, 'users', userId);
    return onSnapshot(userRef, (snapshot) => {
        if (snapshot.exists()) {
            const content = (snapshot.data().customContent as UserCustomContent) || null;
            onContentChange(content);
        } else {
            onContentChange(null);
        }
    }, (error) => {
        console.error("Error listening to user content:", error);
    });
};
