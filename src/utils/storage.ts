import type { ExamCategory, TestResult, BookmarkedQuestion } from '../types';
import { examCategories as defaultCategories, DATA_VERSION } from '../data/mockData';

const STORAGE_KEYS = {
  CATEGORIES: 'exam_categories',
  RESULTS: 'test_results',
  BOOKMARKS: 'bookmarked_questions',
  DATA_VERSION: 'exam_categories_version'
};

const DEFAULT_CATEGORY_IDS = new Set(defaultCategories.map((cat) => cat.id));

export const storage = {
  getCategories: (): ExamCategory[] => {
    const storedVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);

    // If nothing stored yet, or bundled data version changed, refresh defaults
    if (!stored || storedVersion !== DATA_VERSION) {
      const storedCategories: ExamCategory[] = stored ? JSON.parse(stored) : [];
      const userCategories = storedCategories.filter(
        (sc: ExamCategory) => !DEFAULT_CATEGORY_IDS.has(sc.id)
      );
      const finalCategories = [...defaultCategories, ...userCategories];
      storage.saveCategories(finalCategories);
      localStorage.setItem(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);
      return finalCategories;
    }

    if (stored) {
      const storedCategories: ExamCategory[] = JSON.parse(stored);
      // Merge default categories with stored categories
      const mergedCategories = defaultCategories.map((defaultCat) => {
        const storedCat = storedCategories.find((sc: ExamCategory) => sc.id === defaultCat.id);
        
        if (storedCat) {
          // Check if category has subjects (new structure) or direct tests (old structure)
          if (defaultCat.subjects && defaultCat.subjects.length > 0) {
            // New structure: merge subjects
            const mergedSubjects = defaultCat.subjects.map((defaultSubject) => {
              const storedSubject = storedCat.subjects?.find((ss: any) => ss.id === defaultSubject.id);
              
              if (storedSubject) {
                // Subject exists in storage, merge tests
                const mergedTests = defaultSubject.tests.map((defaultTest) => {
                  const storedTest = storedSubject.tests.find((st: any) => st.id === defaultTest.id);
                  
                  if (storedTest) {
                    if (storedTest.questions.length > 0) {
                      return { ...storedTest, name: defaultTest.name };
                    } else {
                      return defaultTest;
                    }
                  }
                  return defaultTest;
                });
                
                const storedOnlyTests = storedSubject.tests.filter(
                  (st: any) => !defaultSubject.tests.find((dt) => dt.id === st.id)
                );
                
                return {
                  ...storedSubject,
                  tests: [...mergedTests, ...storedOnlyTests],
                  name: defaultSubject.name
                };
              }
              // New subject from default, add it
              return defaultSubject;
            });
            
            // Add any stored subjects that don't exist in default
            const storedOnlySubjects = (storedCat.subjects || []).filter(
              (ss: any) => !defaultCat.subjects!.find((ds) => ds.id === ss.id)
            );
            
            return {
              ...storedCat,
              subjects: [...mergedSubjects, ...storedOnlySubjects],
              pdfs: defaultCat.pdfs.length > 0 ? defaultCat.pdfs : storedCat.pdfs
            };
          } else if (defaultCat.tests && defaultCat.tests.length > 0) {
            // Old structure: merge tests directly
            const mergedTests = defaultCat.tests.map((defaultTest) => {
              const storedTest = storedCat.tests?.find((st: any) => st.id === defaultTest.id);
              
              if (storedTest) {
                if (storedTest.questions.length > 0) {
                  return { ...storedTest, name: defaultTest.name };
                } else {
                  return defaultTest;
                }
              }
              return defaultTest;
            });
            
            const storedOnlyTests = (storedCat.tests || []).filter(
              (st: any) => !defaultCat.tests!.find((dt) => dt.id === st.id)
            );
            
            return {
              ...storedCat,
              tests: [...mergedTests, ...storedOnlyTests],
              pdfs: defaultCat.pdfs.length > 0 ? defaultCat.pdfs : storedCat.pdfs
            };
          }
          
          return {
            ...storedCat,
            pdfs: defaultCat.pdfs.length > 0 ? defaultCat.pdfs : storedCat.pdfs
          };
        }
        // New category from default, add it
        return defaultCat;
      });
      
      // Add any stored categories that don't exist in default (user-created categories)
      const storedOnlyCategories = storedCategories.filter(
        (sc: ExamCategory) => !defaultCategories.find((dc) => dc.id === sc.id)
      );
      
      const finalCategories = [...mergedCategories, ...storedOnlyCategories];
      // Save merged data back to localStorage
      storage.saveCategories(finalCategories);
      localStorage.setItem(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);
      return finalCategories;
    }
    storage.saveCategories(defaultCategories);
    localStorage.setItem(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);
    return defaultCategories;
  },

  saveCategories: (categories: ExamCategory[]) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    localStorage.setItem(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);
  },

  getResults: (): TestResult[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return stored ? JSON.parse(stored) : [];
  },

  saveResult: (result: TestResult) => {
    const results = storage.getResults();
    results.push(result);
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  },

  getBookmarks: (): BookmarkedQuestion[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return stored ? JSON.parse(stored) : [];
  },

  saveBookmarks: (bookmarks: BookmarkedQuestion[]) => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  },

  addBookmark: (bookmark: BookmarkedQuestion) => {
    const bookmarks = storage.getBookmarks();
    if (!bookmarks.find((b) => b.id === bookmark.id)) {
      bookmarks.push(bookmark);
      storage.saveBookmarks(bookmarks);
    }
  },

  removeBookmark: (bookmarkId: string) => {
    const bookmarks = storage.getBookmarks().filter((b) => b.id !== bookmarkId);
    storage.saveBookmarks(bookmarks);
  },

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.RESULTS);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.DATA_VERSION);
  },
}