import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { HomePage } from './components/HomePage';
import { CategoryPage } from './components/CategoryPage';
import { SubjectPage } from './components/SubjectPage';
import { TestModeSelection } from './components/TestModeSelection';
import { TestPage } from './components/TestPage';
import { RealisticTestPage } from './components/RealisticTestPage';
import { ResultsPage } from './components/ResultsPage';
import { AdminPanel } from './components/AdminPanel';
import { BookmarkedTestPage } from './components/BookmarkedTestPage';
import { ManageBookmarksPage } from './components/ManageBookmarksPage';
import { AboutPage } from './components/AboutPage';
import logo from './logo.png';
import { storage } from './utils/storage';
import type { ExamCategory, TestResult, BookmarkedQuestion } from './types';

type View =
  | 'home'
  | 'category'
  | 'subject'
  | 'mode-selection'
  | 'test'
  | 'results'
  | 'admin'
  | 'bookmarked-test'
  | 'manage-bookmarks'
  | 'about';

function App() {
  const [view, setView] = useState<View>('home');
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [testMode, setTestMode] = useState<'normal' | 'realistic' | null>(null);
  const [testAnswers, setTestAnswers] = useState<number[]>([]);
  const [testScore, setTestScore] = useState<number>(0);
  const [testTotal, setTestTotal] = useState<number>(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>([]);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkTheme');
    return saved === 'true';
  });

  const navigateToView = (newView: View, categoryId?: string, subjectId?: string, testId?: string, pushState = true) => {
    setView(newView);
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
    if (newView === 'home' || newView === 'admin') {
      setTestMode(null);
    }
    
    if (pushState) {
      const state: { view: View; categoryId?: string; subjectId?: string; testId?: string } = { view: newView };
      if (categoryId) state.categoryId = categoryId;
      if (subjectId) state.subjectId = subjectId;
      if (testId) state.testId = testId;
      window.history.pushState(state, '', `#${newView}${categoryId ? `/${categoryId}` : ''}${subjectId ? `/${subjectId}` : ''}${testId ? `/${testId}` : ''}`);
    }

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loadedCategories = storage.getCategories();
    setCategories(loadedCategories);
    const loadedResults = storage.getResults();
    setResults(loadedResults);
    const loadedBookmarks = storage.getBookmarks();
    setBookmarks(loadedBookmarks);
    
    // Handle initial page load with hash
    const hash = window.location.hash;
    if (hash) {
      const parts = hash.slice(1).split('/');
      const viewFromHash = parts[0] as View;
      const categoryIdFromHash = parts[1];
      const allowedViews: View[] = [
        'home',
        'category',
        'subject',
        'mode-selection',
        'test',
        'results',
        'admin',
        'bookmarked-test',
        'manage-bookmarks',
        'about'
      ];

      if (viewFromHash && allowedViews.includes(viewFromHash)) {
        setView(viewFromHash);
        if (categoryIdFromHash) setSelectedCategoryId(categoryIdFromHash);
        if (viewFromHash === 'subject' && parts[2]) {
          setSelectedSubjectId(parts[2]);
        }
        if (viewFromHash === 'test' || viewFromHash === 'results') {
          if (parts[2] && parts[2] !== categoryIdFromHash) {
            // If part[2] is not the categoryId, it might be subjectId or testId
            const category = loadedCategories.find(c => c.id === categoryIdFromHash);
            if (category?.subjects?.find(s => s.id === parts[2])) {
              setSelectedSubjectId(parts[2]);
              if (parts[3]) setSelectedTestId(parts[3]);
            } else {
              setSelectedTestId(parts[2]);
            }
          } else if (parts[3]) {
            setSelectedTestId(parts[3]);
          }
        }
      }
    } else {
      // Initialize with home state
      window.history.replaceState({ view: 'home' }, '', '#home');
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state || { view: 'home' };
      navigateToView(state.view, state.categoryId, state.subjectId, state.testId, false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    navigateToView('category', categoryId);
  };

  const handleSubjectSelect = (subjectId: string) => {
    navigateToView('subject', selectedCategoryId, subjectId);
  };

  const handleTestSelect = (subjectId: string, testId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedTestId(testId);
    setTestMode(null); // Reset mode
    navigateToView('mode-selection', selectedCategoryId, subjectId, testId);
  };

  const handleTestSelectDirect = (testId: string) => {
    setSelectedTestId(testId);
    setTestMode(null); // Reset mode
    navigateToView('mode-selection', selectedCategoryId, undefined, testId);
  };

  const handleTestSelectFromHome = (
    categoryId: string,
    subjectId: string | undefined,
    testId: string
  ) => {
    setSelectedCategoryId(categoryId);
    if (subjectId) {
      setSelectedSubjectId(subjectId);
    } else {
      setSelectedSubjectId('');
    }
    setSelectedTestId(testId);
    setTestMode(null);
    navigateToView('mode-selection', categoryId, subjectId, testId);
  };

  const handleModeSelect = (mode: 'normal' | 'realistic') => {
    setTestMode(mode);
    navigateToView('test', selectedCategoryId, selectedSubjectId, selectedTestId);
  };

  const handleTestSubmit = (
    answers: number[],
    score: number,
    total: number,
    durationSeconds?: number,
    markedForReview?: number[]
  ) => {
    setTestAnswers(answers);
    setTestScore(score);
    setTestTotal(total);

    const result: TestResult = {
      testId: selectedTestId,
      categoryId: selectedCategoryId,
      answers,
      score,
      total,
      timestamp: Date.now(),
      mode: testMode || undefined,
      markedForReview: markedForReview || undefined,
      durationSeconds
    };

    storage.saveResult(result);
    setResults((prev) => [...prev, result]);

    navigateToView('results', selectedCategoryId, selectedSubjectId, selectedTestId);
  };

  const handleAdminSave = (updatedCategories: ExamCategory[]) => {
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
  };

  const handleToggleBookmark = (questionId: string, isBookmarked: boolean) => {
    if (!selectedCategoryId || !selectedTestId) return;
    const id = `${selectedCategoryId}-${selectedTestId}-${questionId}`;
    if (isBookmarked) {
      storage.removeBookmark(id);
    } else {
      storage.addBookmark({
        id,
        categoryId: selectedCategoryId,
        testId: selectedTestId,
        questionId,
        timestamp: Date.now()
      });
    }
    setBookmarks(storage.getBookmarks());
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    storage.removeBookmark(bookmarkId);
    setBookmarks(storage.getBookmarks());
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const selectedSubject = selectedCategory?.subjects?.find(s => s.id === selectedSubjectId);
  
  // Find test: either from subject (new structure) or directly from category (old structure)
  const selectedTest = selectedSubject?.tests.find(t => t.id === selectedTestId) ||
                       selectedCategory?.tests?.find(t => t.id === selectedTestId);

  const handleGoHome = () => navigateToView('home');

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? 'bg-[#18191D]' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'
      }`}
    >
      {view !== 'test' && view !== 'bookmarked-test' && (
        <header
          className={
            isDark
              ? 'bg-[rgba(24,25,29,0.8)] backdrop-blur-[12px] border-b border-[rgba(255,255,255,0.08)]'
              : 'bg-white/80 backdrop-blur border-b border-gray-200'
          }
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-lg border flex items-center justify-center overflow-hidden ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-100'
              }`}>
                <img src={logo} alt="Exam Practice Portal logo" className="h-7 w-auto object-contain" />
              </div>
              <span className={`text-lg font-bold ${isDark ? 'text-[#E2E8F0]' : 'text-blue-700'}`}>
                Exam Practice Portal
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                isDark 
                  ? 'bg-slate-800 text-blue-400 border-slate-700' 
                  : 'bg-blue-50 text-blue-600 border-blue-100'
              }`}>
                Study Dashboard
              </span>
            </div>
            <nav
              className={`flex items-center gap-3 text-sm ${
                isDark ? 'text-[#E2E8F0]' : 'text-gray-700'
              }`}
            >
              <button
                type="button"
                onClick={handleGoHome}
                className="hover:text-blue-500 transition-colors"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => navigateToView('about')}
                className="hover:text-blue-500 transition-colors"
              >
                About Us
              </button>
              <button
                type="button"
                onClick={() => {
                  const newValue = !isDark;
                  setIsDark(newValue);
                  localStorage.setItem('darkTheme', String(newValue));
                }}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors ${
                  isDark
                    ? 'border-slate-600 hover:bg-slate-800 text-slate-200'
                    : 'border-gray-300/70 hover:bg-gray-100/70 text-gray-700'
                }`}
              >
                {isDark ? (
                  <Sun size={14} className="text-yellow-400" />
                ) : (
                  <Moon size={14} className="text-slate-700" />
                )}
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
            </nav>
          </div>
        </header>
      )}

      <main className="flex-1">
        {view === 'home' && (
          <HomePage
            categories={categories}
            results={results}
            bookmarks={bookmarks}
            isDark={isDark}
            onCategorySelect={handleCategorySelect}
            onAdminClick={() => navigateToView('admin')}
            onStartBookmarkedTest={() => navigateToView('bookmarked-test')}
            onStartManageBookmarks={() => navigateToView('manage-bookmarks')}
            onTestSelectFromSearch={handleTestSelectFromHome}
          />
        )}

        {view === 'category' && selectedCategory && (
          <CategoryPage
            category={selectedCategory}
            isDark={isDark}
            onBack={() => navigateToView('home')}
            onSubjectSelect={selectedCategory.subjects ? handleSubjectSelect : undefined}
            onTestSelect={handleTestSelectDirect}
          />
        )}

        {view === 'subject' && selectedCategory && selectedSubject && (
          <SubjectPage
            subject={selectedSubject}
            categoryName={selectedCategory.name}
            isDark={isDark}
            onBack={() => navigateToView('category', selectedCategoryId)}
            onTestSelect={handleTestSelect}
          />
        )}

        {view === 'mode-selection' && selectedTest && selectedCategory && (
          <TestModeSelection
            test={selectedTest}
            categoryName={selectedCategory.name}
            isDark={isDark}
            onBack={() => {
              if (selectedSubjectId) {
                navigateToView('subject', selectedCategoryId, selectedSubjectId);
              } else {
                navigateToView('category', selectedCategoryId);
              }
            }}
            onModeSelect={handleModeSelect}
          />
        )}

        {view === 'test' && selectedTest && selectedCategory && testMode === 'normal' && (
          <TestPage
            test={selectedTest}
            categoryId={selectedCategoryId}
            categoryName={selectedCategory.name}
            isDark={isDark}
            onBack={() => {
              if (selectedSubjectId) {
                navigateToView('subject', selectedCategoryId, selectedSubjectId);
              } else {
                navigateToView('category', selectedCategoryId);
              }
            }}
            onSubmit={(answers, score, total, durationSeconds) =>
              handleTestSubmit(answers, score, total, durationSeconds)
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
              if (selectedSubjectId) {
                navigateToView('subject', selectedCategoryId, selectedSubjectId);
              } else {
                navigateToView('category', selectedCategoryId);
              }
            }}
            onSubmit={(answers, score, total, durationSeconds, markedForReview) =>
              handleTestSubmit(answers, score, total, durationSeconds, markedForReview)
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
            bookmarks={bookmarks}
            isDark={isDark}
            onBack={() => {
              if (selectedSubjectId) {
                navigateToView('subject', selectedCategoryId, selectedSubjectId);
              } else {
                navigateToView('category', selectedCategoryId);
              }
            }}
            onHome={handleGoHome}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {view === 'admin' && (
          <AdminPanel
            categories={categories}
            isDark={isDark}
            onSave={handleAdminSave}
            onBack={handleGoHome}
          />
        )}

        {view === 'bookmarked-test' && (
          <BookmarkedTestPage
            categories={categories}
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
      </main>

      <footer
        className={
          isDark
            ? 'bg-[#0F1012] text-[#E2E8F0] text-sm'
            : 'bg-gray-900 text-gray-300 text-sm'
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
    </div>
  );
}

export default App;
