import type { ExamCategory, TestResult, BookmarkedQuestion } from '../types';
import { examCategories as defaultCategories } from '../data/mockData';

// Storage is now a stub - ALL data comes from Firebase
// These functions exist only for backwards compatibility during transition
export const storage = {
  // Categories come from defaults only - user content is in Firebase
  getCategories: (): ExamCategory[] => {
    return [...defaultCategories];
  },

  // No-op - categories stored in Firebase
  saveCategories: (_categories: ExamCategory[]) => {
    // No-op - Firebase only
  },

  // STUB - results come from Firebase only
  getResults: (): TestResult[] => {
    // Return empty - results must come from Firebase
    return [];
  },

  // No-op - results saved to Firebase
  saveResult: (_result: TestResult) => {
    // No-op - Firebase only
  },

  // STUB - bookmarks come from Firebase only
  getBookmarks: (): BookmarkedQuestion[] => {
    // Return empty - bookmarks must come from Firebase
    return [];
  },

  // No-op - bookmarks saved to Firebase
  saveBookmarks: (_bookmarks: BookmarkedQuestion[]) => {
    // No-op - Firebase only
  },

  addBookmark: (_bookmark: BookmarkedQuestion) => {
    // No-op - Firebase only
  },

  removeBookmark: (_bookmarkId: string) => {
    // No-op - Firebase only
  },

  // Clear old localStorage data (migration cleanup)
  clearAll: () => {
    localStorage.removeItem('test_results');
    localStorage.removeItem('bookmarked_questions');
    localStorage.removeItem('exam_categories');
    localStorage.removeItem('exam_categories_version');
  },
}