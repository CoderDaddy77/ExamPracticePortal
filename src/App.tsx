import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { HomePage } from './components/HomePage';
import { CategoryPage } from './components/CategoryPage';
import { SubjectPage } from './components/SubjectPage';
import { ChapterPage } from './components/ChapterPage';
import { TestModeSelection } from './components/TestModeSelection';
import { TestPage } from './components/TestPage';
import { RealisticTestPage } from './components/RealisticTestPage';
import { ResultsPage } from './components/ResultsPage';
import { RetryWrongPage } from './components/RetryWrongPage';
import { AdminPanel } from './components/AdminPanel';
import { BookmarkedTestPage } from './components/BookmarkedTestPage';
import { ManageBookmarksPage } from './components/ManageBookmarksPage';
import { AboutPage } from './components/AboutPage';
import { StudyModePage } from './components/StudyModePage';
import { StudyMaterialPage } from './components/StudyMaterialPage';
import { WeakAreasAnalyzer } from './components/WeakAreasAnalyzer';
import { QuickQuizPage } from './components/QuickQuizPage';
import { NotesPage } from './components/NotesPage';
import { AuthButton } from './components/AuthButton';
import { SEOHead, buildTitle, buildDescription } from './components/SEOHead';
import logo from './logo.png';
import { storage } from './utils/storage';
import { evaluateTestPerformance } from './utils/scoring';
import { syncUserData, saveUserResult, saveUserBookmark, removeUserBookmark, getUserContent, saveUserContent, loginWithGoogle, subscribeToUserContent } from './lib/firebase';
import type { UserCustomContent } from './lib/firebase';
import { examCategories as defaultCategories } from './data/mockData';
import type { User } from 'firebase/auth';
import type { ExamCategory, Question, TestResult, BookmarkedQuestion, TestPerformanceStats, Test } from './types';
import { exportUserData, importUserData, downloadBackupFile } from './utils/dataPortability';
import type { BackupData } from './utils/dataPortability';
import { isDefaultTest } from './utils/defaultTestCheck';

// Build default test to question count map for detecting modifications
const defaultTestIds = new Set<string>();
const defaultTestQuestionCounts = new Map<string, number>();

defaultCategories.forEach(cat => {
  if (cat.subjects) {
    cat.subjects.forEach(sub => {
      // Direct tests in subject
      sub.tests.forEach(t => {
        defaultTestIds.add(t.id);
        defaultTestQuestionCounts.set(t.id, t.questions.length);
      });
      // Tests in chapters
      sub.chapters?.forEach(ch => {
        ch.tests.forEach(t => {
          defaultTestIds.add(t.id);
          defaultTestQuestionCounts.set(t.id, t.questions.length);
        });
      });
    });
  }
  cat.tests?.forEach(t => {
    defaultTestIds.add(t.id);
    defaultTestQuestionCounts.set(t.id, t.questions.length);
  });
});

// Helper: Extract user-created and user-modified content for Firebase storage
function extractUserContent(categories: ExamCategory[]): UserCustomContent {
  const userContent: UserCustomContent = { categories: {} };

  categories.forEach(cat => {
    const catUserTests: UserCustomContent['categories'][string]['tests'] = {};
    const catUserChapters: UserCustomContent['categories'][string]['chapters'] = {};

    const processTest = (test: any, subjectId?: string, chapterId?: string) => {
      const isDefault = defaultTestIds.has(test.id);
      const defaultQuestionCount = defaultTestQuestionCounts.get(test.id) || 0;
      const hasNewQuestions = isDefault && test.questions.length > defaultQuestionCount;

      // Save if: new test OR default test with added questions
      if (!isDefault || hasNewQuestions) {
        const testData: UserCustomContent['categories'][string]['tests'][string] = {
          name: test.name,
          questions: test.questions
        };
        if (subjectId) testData.subjectId = subjectId;
        if (chapterId) testData.chapterId = chapterId;
        if (test.studyMaterial) testData.studyMaterial = test.studyMaterial;
        if (test.timeLimitMinutes) testData.timeLimitMinutes = test.timeLimitMinutes;
        if (hasNewQuestions) testData.isModification = true;
        catUserTests[test.id] = testData;
      }
    };

    if (cat.subjects) {
      cat.subjects.forEach(sub => {
        // Process direct tests
        sub.tests.forEach(test => processTest(test, sub.id));

        // Process chapter tests and user-created chapters
        sub.chapters?.forEach(chapter => {
          if (chapter.id.startsWith('ch-')) {
            // User-created chapter - save it
            catUserChapters[chapter.id] = {
              name: chapter.name,
              subjectId: sub.id,
              ...(chapter.notes ? { notes: chapter.notes } : {})
            };
          } else if (chapter.notes) {
            // Built-in chapter with user-added notes - save notes under its id
            catUserChapters[chapter.id] = {
              name: chapter.name,
              subjectId: sub.id,
              notes: chapter.notes
            };
          }
          // Process tests inside chapter
          chapter.tests.forEach(test => processTest(test, sub.id, chapter.id));
        });
      });
    }

    cat.tests?.forEach(test => processTest(test));

    const hasTests = Object.keys(catUserTests).length > 0;
    const hasChapters = Object.keys(catUserChapters).length > 0;

    if (hasTests || hasChapters) {
      userContent.categories[cat.id] = {
        tests: catUserTests,
        ...(hasChapters && { chapters: catUserChapters })
      };
    }
  });

  return userContent;
}

// Helper: Merge user content from Firebase into categories
function mergeUserContent(categories: ExamCategory[], userContent: UserCustomContent): ExamCategory[] {
  return categories.map(cat => {
    const userCatData = userContent.categories[cat.id];
    if (!userCatData) return cat;

    const mergedCat = { ...cat };

    // First, merge user-created chapters
    if (userCatData.chapters && mergedCat.subjects) {
      Object.entries(userCatData.chapters).forEach(([chapterId, chapterData]) => {
        mergedCat.subjects = mergedCat.subjects!.map(sub => {
          if (sub.id === chapterData.subjectId) {
            // Check if chapter already exists (built-in or previously created)
            const existingChapter = sub.chapters?.find(ch => ch.id === chapterId);
            if (!existingChapter) {
              // Add new user-created chapter
              return {
                ...sub,
                chapters: [...(sub.chapters || []), {
                  id: chapterId,
                  name: chapterData.name,
                  tests: [],
                  ...(chapterData.notes ? { notes: chapterData.notes } : {})
                }]
              };
            } else if (chapterData.notes) {
              // Existing chapter - restore its notes
              return {
                ...sub,
                chapters: sub.chapters!.map(ch =>
                  ch.id === chapterId ? { ...ch, notes: chapterData.notes } : ch
                )
              };
            }
          }
          return sub;
        });
      });
    }

    // Then, merge tests
    Object.entries(userCatData.tests).forEach(([testId, testData]) => {
      const userTest: Test = {
        id: testId,
        name: testData.name,
        questions: testData.questions,
        studyMaterial: testData.studyMaterial,
        timeLimitMinutes: testData.timeLimitMinutes
      };

      if (testData.subjectId && mergedCat.subjects) {
        mergedCat.subjects = mergedCat.subjects.map(sub => {
          if (sub.id === testData.subjectId) {
            // If test belongs to a chapter, add it there
            if (testData.chapterId && sub.chapters) {
              const updatedChapters = sub.chapters.map(ch => {
                if (ch.id === testData.chapterId) {
                  const existingIndex = ch.tests.findIndex(t => t.id === testId);
                  if (existingIndex < 0) {
                    return { ...ch, tests: [...ch.tests, userTest] };
                  } else if (testData.isModification) {
                    const newTests = [...ch.tests];
                    newTests[existingIndex] = userTest;
                    return { ...ch, tests: newTests };
                  }
                }
                return ch;
              });
              return { ...sub, chapters: updatedChapters };
            }

            // Otherwise, add to direct tests
            const existingIndex = sub.tests.findIndex(t => t.id === testId);
            if (existingIndex >= 0 && testData.isModification) {
              const newTests = [...sub.tests];
              newTests[existingIndex] = userTest;
              return { ...sub, tests: newTests };
            } else if (existingIndex < 0) {
              return { ...sub, tests: [...sub.tests, userTest] };
            }
          }
          return sub;
        });
      } else if (mergedCat.tests) {
        const existingIndex = mergedCat.tests.findIndex(t => t.id === testId);
        if (existingIndex >= 0 && testData.isModification) {
          const newTests = [...mergedCat.tests];
          newTests[existingIndex] = userTest;
          mergedCat.tests = newTests;
        } else if (existingIndex < 0) {
          mergedCat.tests = [...mergedCat.tests, userTest];
        }
      }
    });

    return mergedCat;
  });
}

type View =
  | 'home'
  | 'category'
  | 'subject'
  | 'chapter'
  | 'mode-selection'
  | 'test'
  | 'results'
  | 'retry-wrong'
  | 'admin'
  | 'bookmarked-test'
  | 'manage-bookmarks'
  | 'about'
  | 'study-library'
  | 'study-detail'
  | 'weak-areas'
  | 'quick-quiz'
  | 'notes';

// Build a URL path from view + IDs
function buildPath(view: View, categoryId?: string, subjectId?: string, testId?: string): string {
  switch (view) {
    case 'home': return '/';
    case 'about': return '/about';
    case 'admin': return '/admin';
    case 'weak-areas': return '/weak-areas';
    case 'quick-quiz': return '/quick-quiz';
    case 'notes': return '/notes';
    case 'bookmarked-test': return '/bookmarks/test';
    case 'manage-bookmarks': return '/bookmarks/manage';
    case 'study-library': return '/study';
    case 'category': return categoryId ? `/exam/${categoryId}` : '/';
    case 'subject': return categoryId && subjectId ? `/exam/${categoryId}/${subjectId}` : '/';
    case 'chapter': return categoryId && subjectId && testId ? `/exam/${categoryId}/${subjectId}/chapter/${testId}` : (categoryId && subjectId ? `/exam/${categoryId}/${subjectId}/chapter` : '/');
    case 'mode-selection':
      if (categoryId && subjectId && testId) return `/exam/${categoryId}/${subjectId}/${testId}`;
      if (categoryId && testId) return `/exam/${categoryId}/test/${testId}`;
      return '/';
    case 'test':
      if (categoryId && subjectId && testId) return `/exam/${categoryId}/${subjectId}/${testId}/start`;
      if (categoryId && testId) return `/exam/${categoryId}/test/${testId}/start`;
      return '/';
    case 'results':
      if (categoryId && subjectId && testId) return `/exam/${categoryId}/${subjectId}/${testId}/results`;
      if (categoryId && testId) return `/exam/${categoryId}/test/${testId}/results`;
      return '/';
    case 'study-detail':
      if (categoryId && subjectId && testId) return `/study/${categoryId}/${subjectId}/${testId}`;
      if (categoryId && testId) return `/study/${categoryId}/test/${testId}`;
      return '/study';
    default: return '/';
  }
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState<ExamCategory[]>(() => {
    // Synchronous init — runs before any useEffect so URL-derived view has data immediately
    try {
      return storage.getCategories();
    } catch {
      return [...defaultCategories];
    }
  });
  const [categoriesLoaded, setCategoriesLoaded] = useState(true);
  const [authResolved, setAuthResolved] = useState(false); // true once Firebase auth state is known
  const [contentSyncing, setContentSyncing] = useState(false); // true while fetching user custom content from cloud
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  // Persist testMode in sessionStorage so reload during test restores correctly
  const [testMode, setTestModeState] = useState<'normal' | 'realistic' | null>(() => {
    const saved = sessionStorage.getItem('testMode');
    return (saved === 'normal' || saved === 'realistic') ? saved : null;
  });
  const setTestMode = (mode: 'normal' | 'realistic' | null) => {
    setTestModeState(mode);
    if (mode) sessionStorage.setItem('testMode', mode);
    else sessionStorage.removeItem('testMode');
  };
  const [testAnswers, setTestAnswers] = useState<(number | null)[]>([]);
  const [testScore, setTestScore] = useState<number>(0);
  const [testTotal, setTestTotal] = useState<number>(0);
  const [testPerformance, setTestPerformance] = useState<TestPerformanceStats | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>([]);
  const [retryWrongQuestions, setRetryWrongQuestions] = useState<Question[]>([]);
  const [retryWrongContext, setRetryWrongContext] = useState<{ testName: string; categoryName: string; categoryId: string }>({ testName: '', categoryName: '', categoryId: '' });
  const [retryWrongReturnView, setRetryWrongReturnView] = useState<'results' | 'weak-areas'>('results');
  const [weakAreasReturnPath, setWeakAreasReturnPath] = useState<string>('/');
  const [quickQuizPool, setQuickQuizPool] = useState<Question[]>([]);
  const [quickQuizContextLabel, setQuickQuizContextLabel] = useState<string>('General Knowledge');
  const [quickQuizReturnPath, setQuickQuizReturnPath] = useState<string>('/');
  const [navFromHome, setNavFromHome] = useState(false); // true when test launched from home recommended
  const [studyReturnState, setStudyReturnState] = useState<{
    view: View;
    categoryId?: string;
    subjectId?: string;
    testId?: string;
  }>({ view: 'home' });
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkTheme');
    return saved === 'true';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const unsubscribeContentRef = useRef<(() => void) | null>(null);
  const currentUserRef = useRef<User | null>(null);
  // When navigating back to chapter, we go to the subject URL but want to show chapter view
  const restoreChapterRef = useRef(false);

  // Determine current view from URL path
  const [view, setView] = useState<View>('home');

  // Parse route into view + IDs on every location change
  useEffect(() => {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);

    if (parts.length === 0) {
      setView('home');
      return;
    }

    if (parts[0] === 'about') {
      setView('about');
      return;
    }
    if (parts[0] === 'admin') {
      setView('admin');
      return;
    }
    if (parts[0] === 'weak-areas') {
      setView('weak-areas');
      return;
    }
    if (parts[0] === 'quick-quiz') {
      setView('quick-quiz');
      return;
    }
    if (parts[0] === 'notes') {
      setView('notes');
      return;
    }
    if (parts[0] === 'retry-wrong-questions') {
      setView('retry-wrong');
      return;
    }
    if (parts[0] === 'bookmarks') {
      if (parts[1] === 'test') setView('bookmarked-test');
      else if (parts[1] === 'manage') setView('manage-bookmarks');
      else setView('home');
      return;
    }

    // Study routes: /study, /study/:catId/:subjectId/:testId, /study/:catId/test/:testId
    if (parts[0] === 'study') {
      if (parts.length === 1) {
        setView('study-library');
        return;
      }
      // /study/:catId/test/:testId or /study/:catId/:subjectId/:testId
      const catId = parts[1];
      setSelectedCategoryId(catId);
      if (parts[2] === 'test' && parts[3]) {
        setSelectedSubjectId('');
        setSelectedTestId(parts[3]);
      } else if (parts[2] && parts[3]) {
        setSelectedSubjectId(parts[2]);
        setSelectedTestId(parts[3]);
      }
      setView('study-detail');
      return;
    }

    // Exam routes: /exam/:catId/...
    if (parts[0] === 'exam') {
      const catId = parts[1];
      if (!catId) { setView('home'); return; }
      setSelectedCategoryId(catId);

      // /exam/:catId
      if (parts.length === 2) {
        setView('category');
        return;
      }

      // /exam/:catId/test/:testId/start, /exam/:catId/test/:testId/results, /exam/:catId/test/:testId
      if (parts[2] === 'test') {
        const testId = parts[3];
        if (testId) {
          setSelectedSubjectId('');
          setSelectedTestId(testId);
          if (parts[4] === 'start') setView('test');
          else if (parts[4] === 'results') setView('results');
          else setView('mode-selection');
        }
        return;
      }

      // /exam/:catId/:subjectId
      const subjectId = parts[2];
      setSelectedSubjectId(subjectId);

      if (parts.length === 3) {
        setView('subject');
        return;
      }

      // /exam/:catId/:subjectId/chapter/:chapterId
      if (parts[3] === 'chapter') {
        if (parts[4]) {
          setSelectedChapterId(parts[4]);
        }
        setView('chapter');
        return;
      }

      // /exam/:catId/:subjectId/:testId
      const testId = parts[3];
      setSelectedTestId(testId);

      if (parts.length === 4) {
        setView('mode-selection');
        return;
      }

      if (parts[4] === 'start') setView('test');
      else if (parts[4] === 'results') setView('results');
      else setView('mode-selection');
      return;
    }

    // Fallback
    setView('home');
  }, [location.pathname]);

  // Helper function to setup Firebase listener
  const setupRealtimeListener = useCallback((user: User) => {
    console.log('[Firebase Realtime] Setting up listener for:', user.uid);
    unsubscribeContentRef.current = subscribeToUserContent(user.uid, (userContent) => {
      console.log('[Firebase Realtime] Content changed:', userContent);
      if (userContent) {
        const currentCategories = storage.getCategories();
        const mergedCategories = mergeUserContent(currentCategories, userContent);
        setCategories(mergedCategories);
      }
    });
  }, []);

  const handleAuthChange = useCallback(async (user: User | null) => {
    setCurrentUser(user);
    currentUserRef.current = user;

    // Cleanup previous listener if exists
    if (unsubscribeContentRef.current) {
      unsubscribeContentRef.current();
      unsubscribeContentRef.current = null;
    }

    // Resolve auth immediately — UI unblocks, no more blank/loading page
    setAuthResolved(true);

    if (user) {
      // Show syncing shimmer while we fetch user's cloud data
      setContentSyncing(true);
      try {
        // Load data from cloud only - no localStorage
        const cloudData = await syncUserData(user, [], []);
        if (cloudData) {
          setResults(cloudData.results);
          setBookmarks(cloudData.bookmarks);
        }

        // Set up real-time listener
        setupRealtimeListener(user);

        // Also do initial fetch
        const userContent = await getUserContent(user.uid);
        if (userContent) {
          const currentCategories = storage.getCategories();
          const mergedCategories = mergeUserContent(currentCategories, userContent);
          setCategories(mergedCategories);
        }
      } finally {
        setContentSyncing(false);
      }
    } else {
      // User logged out - reset to default categories only
      console.log('[Logout] Resetting to default categories');
      setCategories([...defaultCategories]);
      setContentSyncing(false);
    }
  }, [setupRealtimeListener]);

  const navigateToView = (newView: View, categoryId?: string, subjectId?: string, testId?: string, replace?: boolean) => {
    if (categoryId !== undefined) {
      setSelectedCategoryId(categoryId);
    } else if (newView === 'home' || newView === 'admin') {
      setSelectedCategoryId('');
    }
    if (subjectId !== undefined) {
      setSelectedSubjectId(subjectId);
    } else if (newView === 'home' || newView === 'admin' || newView === 'category') {
      setSelectedSubjectId('');
    }
    if (testId !== undefined) {
      setSelectedTestId(testId);
    } else if (newView === 'home' || newView === 'admin' || newView === 'category' || newView === 'subject') {
      setSelectedTestId('');
    }
    if (newView === 'home' || newView === 'admin' || newView === 'mode-selection' || newView === 'results') {
      setTestMode(null);
    }

    const path = buildPath(newView, categoryId ?? selectedCategoryId, subjectId ?? selectedSubjectId, testId ?? selectedTestId);
    navigate(path, replace ? { replace: true } : undefined);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Scroll to top immediately on page load/reload
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    // Clear any old localStorage data (migration cleanup)
    storage.clearAll();
    // Categories already initialized synchronously above; just mark loaded
    // Results and bookmarks start empty - will be loaded from Firebase after login
    setResults([]);
    setBookmarks([]);
    setCategoriesLoaded(true);

    // Safety: if Firebase auth doesn't call handleAuthChange within 3s (offline/slow),
    // resolve anyway so the UI doesn't hang on a loading spinner forever
    const timeout = setTimeout(() => { setAuthResolved(true); setContentSyncing(false); }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    navigateToView('category', categoryId);
  };

  const handleSubjectSelect = (subjectId: string) => {
    navigateToView('subject', selectedCategoryId, subjectId);
  };

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    // Navigate directly to avoid navigateToView corrupting selectedTestId
    const path = `/exam/${selectedCategoryId}/${selectedSubjectId}/chapter/${chapterId}`;
    navigate(path);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleTestSelect = (subjectId: string, testId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedTestId(testId);
    setSelectedChapterId('');
    setTestMode(null);
    setNavFromHome(false);
    navigateToView('mode-selection', selectedCategoryId, subjectId, testId);
  };

  const handleTestSelectFromChapter = (testId: string) => {
    setSelectedTestId(testId);
    setTestMode(null);
    setNavFromHome(false);
    navigateToView('mode-selection', selectedCategoryId, selectedSubjectId, testId);
  };

  const handleStudyNotesSelect = (chapterId: string) => {
    const notesTestId = `__chapterNotes__${chapterId}`;
    openStudyMaterial(selectedCategoryId, selectedSubjectId || undefined, notesTestId, {
      view: 'chapter',
      categoryId: selectedCategoryId,
      subjectId: selectedSubjectId || undefined,
      testId: chapterId
    });
  };

  const handleTestSelectDirect = (testId: string) => {
    setSelectedTestId(testId);
    setTestMode(null);
    setNavFromHome(false);
    navigateToView('mode-selection', selectedCategoryId, undefined, testId);
  };

  const handleTestSelectFromHome = (
    categoryId: string,
    subjectId: string | undefined,
    testId: string,
    chapterId?: string
  ) => {
    setSelectedCategoryId(categoryId);
    if (subjectId) {
      setSelectedSubjectId(subjectId);
    } else {
      setSelectedSubjectId('');
    }

    if (chapterId) {
      setSelectedChapterId(chapterId);
    } else {
      setSelectedChapterId('');
    }

    setSelectedTestId(testId);
    setTestMode(null);
    setNavFromHome(true); // remember we came from home
    navigateToView('mode-selection', categoryId, subjectId, testId);
  };

  const openStudyMaterial = (
    categoryId: string,
    subjectId: string | undefined,
    testId: string,
    returnState: { view: View; categoryId?: string; subjectId?: string; testId?: string }
  ) => {
    setStudyReturnState(returnState);
    setSelectedCategoryId(categoryId);
    if (subjectId) {
      setSelectedSubjectId(subjectId);
    } else {
      setSelectedSubjectId('');
    }
    setSelectedTestId(testId);
    navigateToView('study-detail', categoryId, subjectId, testId);
  };

  const handleStudySelectFromHome = (
    categoryId: string,
    subjectId: string | undefined,
    testId: string
  ) => openStudyMaterial(categoryId, subjectId, testId, { view: 'home' });

  const handleStudySelectFromLibrary = (
    categoryId: string,
    subjectId: string | undefined,
    testId: string
  ) => openStudyMaterial(categoryId, subjectId, testId, { view: 'study-library' });

  const handleStudyFromModeSelection = () => {
    if (!selectedCategoryId || !selectedTestId) return;
    openStudyMaterial(selectedCategoryId, selectedSubjectId || undefined, selectedTestId, {
      view: 'mode-selection',
      categoryId: selectedCategoryId,
      subjectId: selectedSubjectId || undefined,
      testId: selectedTestId
    });
  };

  const handleOpenStudyLibrary = () => {
    setStudyReturnState({ view: 'home' });
    navigateToView('study-library');
  };

  const handleStudyBack = () => {
    const target = studyReturnState;
    if (target.view === 'chapter') {
      setSelectedTestId('');
      setSelectedChapterId(target.testId || '');
      navigate(`/exam/${target.categoryId}/${target.subjectId}/chapter/${target.testId}`);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      navigateToView(target.view, target.categoryId, target.subjectId, target.testId);
    }
  };

  const handleModeSelect = (mode: 'normal' | 'realistic') => {
    setTestMode(mode);
    navigateToView('test', selectedCategoryId, selectedSubjectId, selectedTestId);
  };

  const handleTestSubmit = (
    answers: (number | null)[],
    score: number,
    total: number,
    durationSeconds?: number,
    performance?: TestPerformanceStats,
    markedForReview?: number[]
  ) => {
    setTestAnswers(answers);
    setTestScore(score);
    setTestTotal(total);
    const resolvedPerformance =
      performance ||
      (selectedTest
        ? evaluateTestPerformance(answers, selectedTest.questions)
        : {
          correct: score,
          incorrect: Math.max(0, total - score),
          unattempted: 0,
          marks: score * 5 - Math.max(0, total - score),
          totalMarks: total * 5
        });
    setTestPerformance(resolvedPerformance);

    const result: TestResult = {
      testId: selectedTestId,
      categoryId: selectedCategoryId,
      answers,
      score,
      total,
      timestamp: Date.now(),
      mode: testMode || undefined,
      markedForReview: markedForReview || undefined,
      durationSeconds,
      marks: resolvedPerformance.marks,
      totalMarks: resolvedPerformance.totalMarks,
      incorrectCount: resolvedPerformance.incorrect,
      unattemptedCount: resolvedPerformance.unattempted
    };

    storage.saveResult(result);
    setResults((prev) => [...prev, result]);

    // Sync to cloud if logged in
    if (currentUser) {
      saveUserResult(currentUser.uid, result).catch(console.error);
    }

    navigateToView('results', selectedCategoryId, selectedSubjectId, selectedTestId);
  };

  const handleAdminSave = async (updatedCategories: ExamCategory[]) => {
    setCategories(updatedCategories);

    // If user is logged in, save to Firebase with proper listener management
    if (currentUserRef.current) {
      const user = currentUserRef.current;

      // Step 1: Unsubscribe from listener to prevent conflicts
      console.log('[Firebase Sync] Unsubscribing listener before save');
      if (unsubscribeContentRef.current) {
        unsubscribeContentRef.current();
        unsubscribeContentRef.current = null;
      }

      // Step 2: Save to Firebase
      const userContent = extractUserContent(updatedCategories);
      console.log('[Firebase Sync] Saving user content:', userContent);
      console.log('[Firebase Sync] Categories count:', Object.keys(userContent.categories).length);

      if (Object.keys(userContent.categories).length > 0) {
        const success = await saveUserContent(user.uid, userContent);
        console.log('[Firebase Sync] Save result:', success ? 'SUCCESS' : 'FAILED');
      } else {
        // Even if no user content, save empty to clear Firebase
        await saveUserContent(user.uid, { categories: {} });
        console.log('[Firebase Sync] Saved empty content to clear Firebase');
      }

      // Step 3: Resubscribe to listener after save completes
      console.log('[Firebase Sync] Resubscribing listener after save');
      setupRealtimeListener(user);
    } else {
      console.log('[Firebase Sync] User not logged in, skipping cloud sync');
    }
  };

  // Save edited explanation directly from Results page
  const handleSaveExplanation = async (questionId: string, explanation: string) => {
    const updatedCategories = categories.map(cat => ({
      ...cat,
      subjects: cat.subjects?.map(sub => ({
        ...sub,
        tests: sub.tests.map(t => ({
          ...t,
          questions: t.questions.map(q =>
            q.id === questionId ? { ...q, explanation } : q
          )
        })),
        chapters: sub.chapters?.map(ch => ({
          ...ch,
          tests: ch.tests.map(t => ({
            ...t,
            questions: t.questions.map(q =>
              q.id === questionId ? { ...q, explanation } : q
            )
          }))
        }))
      })),
      tests: cat.tests?.map(t => ({
        ...t,
        questions: t.questions.map(q =>
          q.id === questionId ? { ...q, explanation } : q
        )
      }))
    }));
    await handleAdminSave(updatedCategories);
  };

  const handleToggleBookmark = (questionId: string, isBookmarked: boolean) => {
    if (!selectedCategoryId || !selectedTestId) return;
    const id = `${selectedCategoryId}-${selectedTestId}-${questionId}`;
    if (isBookmarked) {
      // Remove from in-memory state
      setBookmarks(prev => prev.filter(b => b.id !== id));
      // Sync to cloud if logged in
      if (currentUser) {
        removeUserBookmark(currentUser.uid, id).catch(console.error);
      }
    } else {
      // Look up the question text for resilient fallback resolution
      const questionText = selectedTest?.questions.find(q => q.id === questionId)?.question;
      const bookmark: BookmarkedQuestion = {
        id,
        categoryId: selectedCategoryId,
        testId: selectedTestId,
        questionId,
        ...(questionText && { questionText }),
        timestamp: Date.now()
      };
      // Add to in-memory state
      setBookmarks(prev => [...prev, bookmark]);
      // Sync to cloud if logged in
      if (currentUser) {
        saveUserBookmark(currentUser.uid, bookmark).catch(console.error);
      }
    }
  };


  const handleRemoveBookmark = (bookmarkId: string) => {
    // Remove from in-memory state
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    // Sync to cloud if logged in
    if (currentUser) {
      removeUserBookmark(currentUser.uid, bookmarkId).catch(console.error);
    }
  };

  // Export user data as JSON file
  const handleExportData = async () => {
    if (!currentUser) return;
    const backupData = await exportUserData(currentUser.uid);
    downloadBackupFile(backupData);
  };

  // Import user data from JSON backup file
  const handleImportData = async (backupData: BackupData): Promise<boolean> => {
    if (!currentUser) return false;

    // Unsubscribe listener during import
    if (unsubscribeContentRef.current) {
      unsubscribeContentRef.current();
      unsubscribeContentRef.current = null;
    }

    const success = await importUserData(currentUser.uid, backupData);

    if (success) {
      // Update local state with imported data
      setResults(backupData.data.results || []);
      setBookmarks(backupData.data.bookmarks || []);

      // Merge custom content into categories
      if (backupData.data.customContent) {
        const baseCategories = storage.getCategories();
        const mergedCategories = mergeUserContent(baseCategories, backupData.data.customContent);
        setCategories(mergedCategories);
      }

      // Resubscribe listener
      setupRealtimeListener(currentUser);
    }

    return success;
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const selectedSubject = selectedCategory?.subjects?.find(s => s.id === selectedSubjectId);
  const selectedChapter = selectedSubject?.chapters?.find(ch => ch.id === selectedChapterId);

  // Find test: from chapter, subject, or directly from category
  // If no chapter is selected, search through ALL chapters in the subject
  let selectedTest =
    selectedChapter?.tests.find(t => t.id === selectedTestId) ||
    selectedSubject?.tests.find(t => t.id === selectedTestId) ||
    selectedCategory?.tests?.find(t => t.id === selectedTestId);

  // If test not found and we have a subject, search all chapters
  if (!selectedTest && selectedSubject?.chapters) {
    for (const chapter of selectedSubject.chapters) {
      const foundTest = chapter.tests.find(t => t.id === selectedTestId);
      if (foundTest) {
        selectedTest = foundTest;
        break;
      }
    }
  }

  // Handle chapter notes viewed as study material (ID prefix: __chapterNotes__)
  if (!selectedTest && selectedTestId.startsWith('__chapterNotes__')) {
    const chapterId = selectedTestId.replace('__chapterNotes__', '');
    const chapter = selectedSubject?.chapters?.find(ch => ch.id === chapterId)
      ?? selectedCategory?.subjects?.flatMap(s => s.chapters ?? []).find(ch => ch.id === chapterId);
    if (chapter?.notes) {
      selectedTest = {
        id: selectedTestId,
        name: chapter.name,
        questions: [],
        studyMaterial: chapter.notes,
      };
    }
  }


  const handleGoHome = () => navigateToView('home');

  // Build SEO title/description based on current view
  const seoTitle = (() => {
    switch (view) {
      case 'home': return undefined; // Uses default
      case 'about': return buildTitle('About Us');
      case 'admin': return buildTitle('Admin Panel');
      case 'weak-areas': return buildTitle('Weak Areas Analyzer', 'Performance Analytics');
      case 'notes': return buildTitle('PDF Notes', 'Study Material');
      case 'study-library': return buildTitle('Study Library', 'Free Study Material');
      case 'bookmarked-test': return buildTitle('Bookmarked Questions Test');
      case 'manage-bookmarks': return buildTitle('Manage Bookmarks');
      case 'category': return selectedCategory ? buildTitle(selectedCategory.name, 'Mock Tests & Study Material') : undefined;
      case 'subject': return selectedCategory && selectedSubject ? buildTitle(selectedSubject.name, selectedCategory.name) : undefined;
      case 'chapter': return selectedCategory && selectedSubject && selectedChapter ? buildTitle(selectedChapter.name, selectedSubject.name, selectedCategory.name) : undefined;
      case 'mode-selection': return selectedTest && selectedCategory ? buildTitle(selectedTest.name, selectedCategory.name) : undefined;
      case 'test': return selectedTest ? buildTitle(selectedTest.name, 'Test') : undefined;
      case 'results': return selectedTest ? buildTitle(selectedTest.name, 'Results') : undefined;
      case 'study-detail': return selectedTest && selectedCategory ? buildTitle(selectedTest.name, 'Study Material', selectedCategory.name) : undefined;
      default: return undefined;
    }
  })();

  const seoDescription = (() => {
    switch (view) {
      case 'about': return 'Learn about Exam Practice Portal — our mission, features, and team.';
      case 'notes': return 'Download topic-wise free PDF study notes and materials.';
      case 'study-library': return 'Browse free study material for CUET, SSC CHSL, GK, Current Affairs, and more. Study notes with curated explanations.';
      case 'category': return selectedCategory ? buildDescription(selectedCategory.name, undefined, `practice tests, mock exams, and study notes for ${selectedCategory.name} preparation`) : undefined;
      case 'subject': return selectedCategory && selectedSubject ? buildDescription(selectedCategory.name, selectedSubject.name, `practice tests and chapter-wise study material for ${selectedSubject.name}`) : undefined;
      case 'mode-selection': return selectedTest ? `Start ${selectedTest.name} - ${selectedTest.questions.length} questions mock test with detailed explanations.` : undefined;
      case 'study-detail': return selectedTest ? `Study material for ${selectedTest.name}. Read curated notes and explanations before attempting the test.` : undefined;
      default: return undefined;
    }
  })();

  // Fullscreen views — hide both header AND footer
  const isTestView = view === 'test' || view === 'bookmarked-test' || view === 'quick-quiz';
  // Views with internal scroll containers — hide only footer to prevent float-up bug
  const hideFooter = isTestView || view === 'study-detail' || view === 'results';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9] text-gray-900'
        }`}
    >
      <SEOHead title={seoTitle} description={seoDescription} />

      {!isTestView && (
        <header
          className={
            isDark
              ? 'bg-[rgba(31,31,30,0.85)] backdrop-blur-[12px] border-b border-[rgba(255,255,255,0.06)]'
              : 'bg-white/80 backdrop-blur border-b border-gray-200'
          }
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Logo + syncing indicator */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGoHome}
                className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-lg"
              >
                <div className={`h-8 w-8 rounded-lg border flex items-center justify-center overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-100'
                  }`}>
                  <img src={logo} alt="Exam Practice Portal logo" className="h-7 w-auto object-contain" />
                </div>
                <span className={`text-lg font-bold font-display ${isDark ? 'text-[#E2E8F0]' : 'text-blue-700'}`}>
                  Exam Practice Portal
                </span>
              </button>
              {/* Syncing indicator — right of logo, visible on all pages */}
              {contentSyncing && (
                <span
                  title="Syncing your account data…"
                  className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium animate-pulse select-none ${isDark
                    ? 'bg-blue-900/40 text-blue-300 border border-blue-700/40'
                    : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`} />
                  Syncing…
                </span>
              )}
            </div>

            {/* Desktop Nav */}
            <nav
              className={`hidden md:flex items-center gap-4 text-m ${isDark ? 'text-[#E2E8F0]' : 'text-gray-700'}`}
            >
              <a href="/" onClick={(e) => { e.preventDefault(); handleGoHome(); }} className="font-heading hover:text-blue-500 transition-colors cursor-pointer">Home</a>
              <a href="/study" onClick={(e) => { e.preventDefault(); handleOpenStudyLibrary(); }} className="font-heading hover:text-blue-500 transition-colors cursor-pointer">Study Mode</a>
              <a href="/notes" onClick={(e) => { e.preventDefault(); navigateToView('notes'); }} className="font-heading hover:text-blue-500 transition-colors cursor-pointer">PDF Notes</a>
              <a href="/weak-areas" onClick={(e) => { e.preventDefault(); setWeakAreasReturnPath(location.pathname); navigateToView('weak-areas'); }} className="font-heading hover:text-blue-500 transition-colors cursor-pointer">Weak Areas</a>
              <a href="/about" onClick={(e) => { e.preventDefault(); navigateToView('about'); }} className="font-heading hover:text-blue-500 transition-colors cursor-pointer">About Us</a>
              <a href="/admin" onClick={(e) => { e.preventDefault(); navigateToView('admin'); }} className="font-heading hover:text-blue-500 transition-colors cursor-pointer">Admin</a>
              <button
                type="button"
                onClick={() => {
                  const newValue = !isDark;
                  setIsDark(newValue);
                  localStorage.setItem('darkTheme', String(newValue));
                }}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors ${isDark
                  ? 'border-slate-600 hover:bg-slate-800 text-slate-200'
                  : 'border-gray-300/70 hover:bg-gray-100/70 text-gray-700'
                  }`}
              >
                {isDark ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} className="text-slate-700" />}
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
              <AuthButton isDark={isDark} onAuthChange={handleAuthChange} onExportData={handleExportData} onImportData={handleImportData} />
            </nav>

            {/* Mobile: theme toggle + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const newValue = !isDark;
                  setIsDark(newValue);
                  localStorage.setItem('darkTheme', String(newValue));
                }}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors ${isDark
                  ? 'border-slate-600 hover:bg-slate-800 text-slate-200'
                  : 'border-gray-300/70 hover:bg-gray-100/70 text-gray-700'
                  }`}
              >
                {isDark ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} className="text-slate-700" />}
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className={`md:hidden border-t px-4 py-3 flex flex-col gap-1 ${isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white border-gray-200'
              }`}>
              {([
                { label: 'Home', href: '/', action: handleGoHome },
                { label: 'Study Mode', href: '/study', action: handleOpenStudyLibrary },
                { label: 'PDF Notes', href: '/notes', action: () => navigateToView('notes') },
                { label: 'Weak Areas', href: '/weak-areas', action: () => { setWeakAreasReturnPath(location.pathname); navigateToView('weak-areas'); } },
                { label: 'About Us', href: '/about', action: () => navigateToView('about') },
                { label: 'Admin', href: '/admin', action: () => navigateToView('admin') },
              ] as { label: string; href: string; action: () => void }[]).map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); item.action(); setMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-2 border-t mt-1 ${isDark ? 'border-slate-700' : 'border-gray-200'}">
                <AuthButton isDark={isDark} onAuthChange={handleAuthChange} onExportData={handleExportData} onImportData={handleImportData} />
              </div>
            </div>
          )}
        </header>
      )}

      <main className="flex-1">
        {/* Skeleton: show while auth pending OR content syncing for all content-dependent views */}
        {(!authResolved || contentSyncing) && ['home', 'category', 'subject', 'chapter', 'mode-selection', 'study-library', 'study-detail', 'weak-areas', 'manage-bookmarks', 'admin'].includes(view) && (
          <div className={`max-w-6xl mx-auto px-4 py-8 animate-pulse`}>
            {/* Hero skeleton */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex-1">
                <div className={`h-10 w-2/3 rounded-xl mb-3 ${isDark ? 'bg-slate-700/60' : 'bg-gray-200'}`} />
                <div className={`h-4 w-1/2 rounded-lg ${isDark ? 'bg-slate-700/40' : 'bg-gray-100'}`} />
              </div>
              <div className={`h-10 w-48 rounded-lg ${isDark ? 'bg-slate-700/60' : 'bg-gray-200'}`} />
            </div>
            {/* Stats row skeleton */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-20 rounded-xl ${isDark ? 'bg-slate-700/40' : 'bg-gray-100'}`} />
              ))}
            </div>
            {/* Section label */}
            <div className={`h-5 w-40 rounded-lg mb-4 ${isDark ? 'bg-slate-700/40' : 'bg-gray-100'}`} />
            {/* Category cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`h-32 rounded-xl ${isDark ? 'bg-slate-700/40' : 'bg-gray-200'}`} />
              ))}
            </div>
            {/* Recommended section skeleton */}
            <div className={`h-5 w-48 rounded-lg mb-4 ${isDark ? 'bg-slate-700/40' : 'bg-gray-100'}`} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-24 rounded-xl ${isDark ? 'bg-slate-700/40' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
        )}

        {view === 'home' && authResolved && !contentSyncing && (
          <HomePage
            categories={categories}
            results={results}
            bookmarks={bookmarks}
            isDark={isDark}
            onCategorySelect={handleCategorySelect}
            onSubjectSelect={(categoryId, subjectId) => navigateToView('subject', categoryId, subjectId)}
            onAdminClick={() => navigateToView('admin')}
            onStartBookmarkedTest={() => navigateToView('bookmarked-test')}
            onStartManageBookmarks={() => navigateToView('manage-bookmarks')}
            onTestSelectFromSearch={handleTestSelectFromHome}
            onOpenStudyLibrary={handleOpenStudyLibrary}
            onStudySelect={handleStudySelectFromHome}
            onWeakAreasClick={() => { setWeakAreasReturnPath(location.pathname); navigateToView('weak-areas'); }}
            onNotesClick={() => navigateToView('notes')}
            onQuickQuizClick={() => {
              setQuickQuizPool([]);
              setQuickQuizContextLabel('General Knowledge');
              setQuickQuizReturnPath(location.pathname);
              navigateToView('quick-quiz');
            }}
          />
        )}

        {view === 'category' && selectedCategory && authResolved && !contentSyncing && (
          <CategoryPage
            category={selectedCategory}
            isDark={isDark}
            onBack={() => navigateToView('home')}
            onSubjectSelect={selectedCategory.subjects ? handleSubjectSelect : undefined}
            onTestSelect={handleTestSelectDirect}
            onNotesClick={() => navigateToView('notes')}
            onQuickQuiz={() => {
              // Collect every question in the whole category
              const pool: Question[] = [];
              selectedCategory.tests?.forEach(t => pool.push(...t.questions));
              selectedCategory.subjects?.forEach(sub => {
                sub.tests.forEach(t => pool.push(...t.questions));
                sub.chapters?.forEach(ch => ch.tests.forEach(t => pool.push(...t.questions)));
              });
              setQuickQuizPool(pool);
              setQuickQuizContextLabel(selectedCategory.name);
              setQuickQuizReturnPath(location.pathname);
              navigate('/quick-quiz');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {view === 'subject' && selectedCategory && selectedSubject && authResolved && !contentSyncing && (
          <SubjectPage
            subject={selectedSubject}
            categoryName={selectedCategory.name}
            isDark={isDark}
            onBack={() => navigateToView('category', selectedCategoryId)}
            onTestSelect={handleTestSelect}
            onChapterSelect={handleChapterSelect}
            onQuickQuiz={() => {
              // Collect every question in this subject (direct + all chapters)
              const pool: Question[] = [];
              selectedSubject.tests.forEach(t => pool.push(...t.questions));
              selectedSubject.chapters?.forEach(ch => ch.tests.forEach(t => pool.push(...t.questions)));
              setQuickQuizPool(pool);
              setQuickQuizContextLabel(`${selectedCategory.name} · ${selectedSubject.name}`);
              setQuickQuizReturnPath(location.pathname);
              navigate('/quick-quiz');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddQuestions={currentUser ? () => {
              navigate(`/admin?category=${selectedCategoryId}&subject=${selectedSubjectId}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } : undefined}
          />
        )}

        {view === 'chapter' && selectedCategory && selectedSubject && selectedChapter && authResolved && !contentSyncing && (
          <ChapterPage
            chapter={selectedChapter}
            subjectName={selectedSubject.name}
            categoryName={selectedCategory.name}
            isDark={isDark}
            onBack={() => {
              setSelectedChapterId('');
              navigateToView('subject', selectedCategoryId, selectedSubjectId);
            }}
            onTestSelect={handleTestSelectFromChapter}
            onStudyNotesSelect={() => handleStudyNotesSelect(selectedChapter.id)}
            onQuickQuiz={() => {
              // Gather all questions from this chapter's tests
              const pool: Question[] = [];
              selectedChapter.tests.forEach(t => pool.push(...t.questions));
              setQuickQuizPool(pool);
              setQuickQuizContextLabel(`${selectedSubject.name} · ${selectedChapter.name}`);
              setQuickQuizReturnPath(location.pathname);
              navigate('/quick-quiz');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddQuestions={currentUser ? () => {
              navigate(`/admin?category=${selectedCategoryId}&subject=${selectedSubjectId}&chapter=${selectedChapterId}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } : undefined}
          />
        )}

        {view === 'mode-selection' && selectedTest && selectedCategory && authResolved && !contentSyncing && (
          <TestModeSelection
            test={selectedTest}
            categoryName={selectedCategory.name}
            isDark={isDark}
            hasAttempted={results.some(r => r.testId === selectedTestId && r.categoryId === selectedCategoryId)}
            onBack={() => {
              if (navFromHome) {
                handleGoHome();
              } else if (selectedChapterId) {
                setSelectedTestId('');
                navigate(`/exam/${selectedCategoryId}/${selectedSubjectId}/chapter/${selectedChapterId}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (selectedSubjectId) {
                navigateToView('subject', selectedCategoryId, selectedSubjectId);
              } else {
                navigateToView('category', selectedCategoryId);
              }
            }}
            onModeSelect={handleModeSelect}
            onViewStudyMaterial={selectedTest.studyMaterial ? handleStudyFromModeSelection : undefined}
          />
        )}

        {view === 'test' && selectedTest && selectedCategory && testMode === 'normal' && (
          <TestPage
            test={selectedTest}
            categoryId={selectedCategoryId}
            categoryName={selectedCategory.name}
            isDark={isDark}
            onBack={() => {
              if (navFromHome) {
                handleGoHome();
              } else if (selectedChapterId) {
                setSelectedTestId('');
                // Pass chapterId as testId arg so buildPath includes it
                navigateToView('chapter', selectedCategoryId, selectedSubjectId, selectedChapterId, true);
              } else if (selectedSubjectId) {
                navigateToView('subject', selectedCategoryId, selectedSubjectId, undefined, true);
              } else {
                navigateToView('category', selectedCategoryId, undefined, undefined, true);
              }
            }}
            onSubmit={(answers, score, total, durationSeconds, performance) =>
              handleTestSubmit(answers, score, total, durationSeconds, performance)
            }
          />
        )}

        {view === 'test' && selectedTest && selectedCategory && testMode === 'realistic' && (
          <RealisticTestPage
            test={selectedTest}
            categoryId={selectedCategoryId}
            categoryName={selectedCategory.name}
            isDark={isDark}
            onBack={() => {
              if (navFromHome) {
                handleGoHome();
              } else if (selectedChapterId) {
                setSelectedTestId('');
                navigateToView('chapter', selectedCategoryId, selectedSubjectId, selectedChapterId, true);
              } else if (selectedSubjectId) {
                navigateToView('subject', selectedCategoryId, selectedSubjectId, undefined, true);
              } else {
                navigateToView('category', selectedCategoryId, undefined, undefined, true);
              }
            }}
            onSubmit={(answers, score, total, durationSeconds, performance, markedForReview) =>
              handleTestSubmit(answers, score, total, durationSeconds, performance, markedForReview)
            }
          />
        )}

        {view === 'results' && selectedTest && selectedCategory && (
          <ResultsPage
            test={selectedTest}
            categoryName={selectedCategory.name}
            categoryId={selectedCategoryId}
            answers={testAnswers}
            score={testScore}
            total={testTotal}
            performance={testPerformance ?? undefined}
            bookmarks={bookmarks}
            isDark={isDark}
            onBack={() => {
              if (navFromHome) {
                handleGoHome();
              } else if (selectedChapterId) {
                setSelectedTestId('');
                navigateToView('chapter', selectedCategoryId, selectedSubjectId);
              } else if (selectedSubjectId) {
                navigateToView('subject', selectedCategoryId, selectedSubjectId);
              } else {
                navigateToView('category', selectedCategoryId);
              }
            }}
            onHome={handleGoHome}
            onToggleBookmark={handleToggleBookmark}
            onSaveExplanation={handleSaveExplanation}
            onRetryWrong={(wrong) => {
              setRetryWrongQuestions(wrong);
              setRetryWrongContext({
                testName: selectedTest?.name || 'Test',
                categoryName: selectedCategory?.name || '',
                categoryId: selectedCategoryId,
              });
              setRetryWrongReturnView('results');
              navigate('/retry-wrong-questions');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {view === 'retry-wrong' && retryWrongQuestions.length > 0 && (
          <RetryWrongPage
            wrongQuestions={retryWrongQuestions}
            originalTestName={retryWrongContext.testName || selectedTest?.name || 'Test'}
            categoryName={retryWrongContext.categoryName || selectedCategory?.name || ''}
            categoryId={retryWrongContext.categoryId || selectedCategoryId}
            testId={selectedTestId}
            bookmarks={bookmarks}
            isDark={isDark}
            onBack={() => {
              if (retryWrongReturnView === 'weak-areas') {
                navigate('/weak-areas');
              } else {
                navigate(-1);
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onHome={handleGoHome}
            onToggleBookmark={handleToggleBookmark}
            onSaveExplanation={handleSaveExplanation}
          />
        )}

        {view === 'admin' && authResolved && !currentUser && (
          <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'}`}>
            <div className={`max-w-md w-full rounded-2xl shadow-xl p-8 text-center ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'}`}>
              <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <svg className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Login Required</h2>
              <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Please login with your Google account to access the Admin Panel and create questions.
              </p>
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Login with Google
              </button>
              <button
                onClick={handleGoHome}
                className={`mt-3 text-sm underline ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                ← Back to Home
              </button>
            </div>
          </div>
        )}

        {view === 'admin' && authResolved && currentUser && (
          <AdminPanel
            categories={categories}
            isDark={isDark}
            onSave={handleAdminSave}
            onBack={handleGoHome}
            currentUser={currentUser}
          />
        )}

        {view === 'bookmarked-test' && (
          <BookmarkedTestPage
            categories={categories}
            bookmarks={bookmarks}
            isDark={isDark}
            onBack={handleGoHome}
            onResultSaved={() => setResults(storage.getResults())}
          />
        )}

        {view === 'manage-bookmarks' && (
          <ManageBookmarksPage
            categories={categories}
            bookmarks={bookmarks}
            isDark={isDark}
            onBack={handleGoHome}
            onRemoveBookmark={handleRemoveBookmark}
          />
        )}

        {view === 'about' && (
          <AboutPage onBack={handleGoHome} isDark={isDark} />
        )}

        {view === 'weak-areas' && (
          <WeakAreasAnalyzer
            categories={categories}
            results={results}
            isDark={isDark}
            onBack={() => {
              if (weakAreasReturnPath && weakAreasReturnPath !== '/weak-areas') {
                navigate(weakAreasReturnPath);
              } else {
                handleGoHome();
              }
            }}
            onRetryTest={(categoryId, subjectId, testId) => {
              handleTestSelectFromHome(categoryId, subjectId, testId);
            }}
            onRetryWrongQuestions={(wrongQs, testName) => {
              setRetryWrongQuestions(wrongQs);
              setRetryWrongContext({ testName, categoryName: 'Weak Areas Practice', categoryId: '' });
              setRetryWrongReturnView('weak-areas');
              navigate('/retry-wrong-questions');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {view === 'quick-quiz' && (
          <QuickQuizPage
            categories={quickQuizPool.length === 0 ? categories : undefined}
            questionPool={quickQuizPool.length > 0 ? quickQuizPool : undefined}
            contextLabel={quickQuizContextLabel}
            isDark={isDark}
            onBack={() => {
              if (quickQuizReturnPath && quickQuizReturnPath !== '/quick-quiz') {
                navigate(quickQuizReturnPath);
              } else {
                handleGoHome();
              }
            }}
            onHome={handleGoHome}
          />
        )}

        {view === 'study-library' && (
          <StudyModePage
            categories={categories}
            isDark={isDark}
            onBack={handleGoHome}
            onStudySelect={handleStudySelectFromLibrary}
          />
        )}

        {view === 'notes' && (
          <NotesPage
            isDark={isDark}
            onBack={handleGoHome}
          />
        )}

        {view === 'study-detail' && selectedTest && selectedCategory && (
          <StudyMaterialPage
            test={selectedTest}
            categoryName={selectedCategory.name}
            subjectName={selectedSubject?.name}
            isDark={isDark}
            onBack={handleStudyBack}
            onStartTest={selectedTestId.startsWith('__chapterNotes__') ? undefined : () =>
              navigateToView('mode-selection', selectedCategoryId, selectedSubjectId || undefined, selectedTestId)
            }
            isDefaultTest={selectedTestId.startsWith('__chapterNotes__') ? false : isDefaultTest(selectedCategoryId, selectedSubjectId || undefined, selectedTestId)}
            onEditTest={currentUser ? (() => {
              if (selectedTestId.startsWith('__chapterNotes__')) {
                // Chapter notes → go to admin with category + subject + chapter pre-selected
                const chapterId = selectedTestId.replace('__chapterNotes__', '');
                const params = new URLSearchParams({ category: selectedCategoryId });
                if (selectedSubjectId) params.set('subject', selectedSubjectId);
                params.set('chapter', chapterId);
                navigate(`/admin?${params.toString()}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (!isDefaultTest(selectedCategoryId, selectedSubjectId || undefined, selectedTestId)) {
                // Normal test → pre-select category + subject + chapter + test
                const params = new URLSearchParams({ category: selectedCategoryId });
                if (selectedSubjectId) params.set('subject', selectedSubjectId);
                const chapterWithTest = selectedSubject?.chapters?.find(ch =>
                  ch.tests.some(t => t.id === selectedTestId)
                );
                if (chapterWithTest) params.set('chapter', chapterWithTest.id);
                params.set('test', selectedTestId);
                navigate(`/admin?${params.toString()}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }) : undefined}
          />
        )}

        {/* Fallback: loading while Firebase resolves, then 404 if data truly missing */}
        {categoriesLoaded && (() => {
          const needsCategory = ['category', 'subject', 'chapter', 'mode-selection', 'test', 'results', 'study-detail'].includes(view);
          const needsTest = ['mode-selection', 'test', 'results', 'study-detail'].includes(view);
          const missingCategory = needsCategory && !selectedCategory;
          const missingTest = needsTest && selectedCategory && !selectedTest;
          if (!missingCategory && !missingTest) return null;

          // Still waiting for Firebase auth + categories to load
          if (!authResolved) {
            return (
              <div className={`min-h-[70vh] flex items-center justify-center px-4 ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'}`}>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Loading content…</p>
                </div>
              </div>
            );
          }

          // Auth resolved but data still not found — genuine 404
          return (
            <div className={`min-h-[60vh] flex items-center justify-center px-4 ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'}`}>
              <div className={`max-w-sm w-full rounded-2xl p-8 text-center shadow-xl ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'}`}>
                <div className="text-5xl mb-4">🔍</div>
                <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>Page not found</h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  This page doesn't exist or the content may have been removed.
                </p>
                <button
                  onClick={handleGoHome}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  ← Go Home
                </button>
              </div>
            </div>
          );
        })()}
      </main>

      {!hideFooter && (
        <footer
          className={
            isDark
              ? 'bg-[#1E1E1D] text-[#E2E8F0] text-sm border-t border-[rgba(255,255,255,0.05)]'
              : 'bg-white text-gray-700 border-t border-gray-200 text-sm'
          }
        >
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              © {new Date().getFullYear()} Exam Practice Portal. All rights reserved.
            </span>
            <span className="text-xs sm:text-sm opacity-80">
              Practice tests with an exam-like feel, track progress, and revise smarter.
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
