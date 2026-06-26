import { useMemo, useState } from 'react';
import {
  BookOpen,
  Brain,
  FileText,
  GraduationCap,
  Mountain,
  Newspaper,
  Settings,
  Search,
  BarChart2,
  Clock3,
  CheckCircle2,
  Bookmark,
  Sparkles,
  TrendingDown,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import type { ExamCategory, TestResult, BookmarkedQuestion, Test } from '../types';
import { notesData } from '../data/notesData';

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const STOP_WORDS = new Set(['and', 'the', 'of', 'in', 'a', 'an', 'to', 'for', 'or', 'with', 'by', 'on', 'at', 'is', 'its', 'from']);

interface HomePageProps {
  categories: ExamCategory[];
  results: TestResult[];
  bookmarks: BookmarkedQuestion[];
  isDark: boolean;
  onCategorySelect: (categoryId: string) => void;
  onSubjectSelect?: (categoryId: string, subjectId: string) => void;
  onAdminClick: () => void;
  onStartBookmarkedTest: () => void;
  onStartManageBookmarks: () => void;
  onTestSelectFromSearch: (categoryId: string, subjectId: string | undefined, testId: string, chapterId?: string) => void;
  onOpenStudyLibrary: () => void;
  onStudySelect: (categoryId: string, subjectId: string | undefined, testId: string) => void;
  onWeakAreasClick: () => void;
  onQuickQuizClick: () => void;
  onNotesClick: () => void;
}

const iconMap: Record<string, any> = {
  FileText,
  GraduationCap,
  Mountain,
  BookOpen,
  Newspaper,
  Brain
};

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0 min';
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} min`;
}

export function HomePage({
  categories,
  results,
  bookmarks,
  isDark,
  onCategorySelect,
  onSubjectSelect,
  onAdminClick,
  onStartBookmarkedTest,
  onStartManageBookmarks,
  onTestSelectFromSearch,
  onOpenStudyLibrary,
  onStudySelect,
  onWeakAreasClick,
  onQuickQuizClick,
  onNotesClick,
}: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllResults, setShowAllResults] = useState(false);

  const { accuracy, totalSolved, totalTimeSeconds } = useMemo(() => {
    let solved = 0;
    let correct = 0;
    let timeSeconds = 0;
    results.forEach((r) => {
      solved += r.total;
      correct += r.score;
      if (r.durationSeconds) timeSeconds += r.durationSeconds;
    });
    const acc = solved > 0 ? (correct / solved) * 100 : 0;
    return {
      accuracy: acc,
      totalSolved: solved,
      totalTimeSeconds: timeSeconds
    };
  }, [results]);

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => b.timestamp - a.timestamp);
  }, [results]);

  const recentResults = useMemo(() => {
    if (showAllResults) return sortedResults;
    return sortedResults.slice(0, 5);
  }, [sortedResults, showAllResults]);

  const trendData = useMemo(() => {
    const sorted = [...results].sort((a, b) => a.timestamp - b.timestamp);
    const last = sorted.slice(-7);
    return last.map((r) => ({
      ts: r.timestamp,
      pct: r.total > 0 ? (r.score / r.total) * 100 : 0
    }));
  }, [results]);

  const accuracyChart = useMemo(() => {
    if (trendData.length === 0) return null;

    const width = 320;
    const height = 120;
    const values = trendData.map((item) => item.pct);
    const maxValue = Math.max(100, Math.max(...values));
    const minValue = Math.min(0, Math.min(...values));
    const range = maxValue - minValue || 1;

    const points = trendData.map((item, index) => {
      const x =
        trendData.length === 1 ? width / 2 : (index / (trendData.length - 1)) * width;
      const y = height - ((item.pct - minValue) / range) * height;
      return { ...item, x, y };
    });

    const linePath = points.map((point) => `${point.x},${point.y}`).join(' ');
    const areaPath = `0,${height} ${linePath} ${width},${height}`;

    return {
      width,
      height,
      minValue,
      maxValue,
      points,
      linePath,
      areaPath
    };
  }, [trendData]);

  const formatTrendLabel = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((category) => {
      if (category.name.toLowerCase().includes(q)) return true;
      if (category.pdfs.some((p) => p.name.toLowerCase().includes(q))) return true;
      const testsFromCategory = category.tests || [];
      if (testsFromCategory.some((t) => t.name.toLowerCase().includes(q))) return true;
      if (category.subjects?.some((s) =>
        s.name.toLowerCase().includes(q) ||
        s.tests.some((t) => t.name.toLowerCase().includes(q)) ||
        s.chapters?.some((ch) =>
          ch.name.toLowerCase().includes(q) ||
          ch.tests.some((t) => t.name.toLowerCase().includes(q))
        )
      )) return true;
      return false;
    });
  }, [categories, searchQuery]);

  const flattenedTests = useMemo(() => {
    const allTests: {
      categoryId: string;
      categoryName: string;
      subjectId?: string;
      subjectName?: string;
      chapterId?: string;
      chapterName?: string;
      testId: string;
      testName: string;
      testBlob: string;
      // Each element = one normalized section title (for per-section matching)
      studyTitles: string[];
    }[] = [];

    categories.forEach((category) => {
      const pushTest = (
        test: Test,
        subjectId?: string,
        subjectName?: string,
        chapterId?: string,
        chapterName?: string
      ) => {
        const studySections = test.studyMaterial?.sections || [];
        const coreText = [category.name, subjectName, chapterName, test.name]
          .filter(Boolean)
          .join(' ');
        // Store EACH section title separately so matching requires all tokens
        // to appear within a SINGLE section title (prevents false positives
        // where 'current' is in one section and 'electricity' in another)
        const studyTitles = studySections
          .map((s) => normalizeText(s.title || ''))
          .filter(Boolean);

        allTests.push({
          categoryId: category.id,
          categoryName: category.name,
          subjectId,
          subjectName,
          chapterId,
          chapterName,
          testId: test.id,
          testName: test.name,
          testBlob: normalizeText(coreText),
          studyTitles
        });
      };

      category.tests?.forEach((test) => pushTest(test));
      category.subjects?.forEach((subject) => {
        subject.tests.forEach((test) => pushTest(test, subject.id, subject.name));
        subject.chapters?.forEach((chapter) =>
          chapter.tests.forEach((test) =>
            pushTest(test, subject.id, subject.name, chapter.id, chapter.name)
          )
        );
      });
    });

    return allTests;
  }, [categories]);

  // Common words to ignore in search so "torque and" = "torque"
  const matchingTests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    // Remove stop words so "torque and" works same as "torque"
    const queryTokens = normalizeText(q)
      .split(' ')
      .filter(t => t.length > 0 && !STOP_WORDS.has(t));
    if (queryTokens.length === 0) return [];

    const resultsMap = new Map<string, {
      categoryId: string;
      subjectId?: string;
      chapterId?: string;
      testId: string;
      testName: string;
      categoryName: string;
      isStudyMatch: boolean;
      hasStudyMaterial: boolean;
      score: number;
    }>();

    flattenedTests.forEach((testItem) => {
      const { categoryId, categoryName, subjectId, chapterId, testId, testName, testBlob, studyTitles } = testItem;

      const matchesCore = queryTokens.every((token) => testBlob.includes(token));
      // True only if ALL tokens appear within ONE single section title
      const matchesStudy = studyTitles.some(title =>
        queryTokens.every(token => title.includes(token))
      );

      if (!matchesCore && !matchesStudy) return;

      if (matchesCore) {
        const key = `${categoryId}||${subjectId || ''}||${chapterId || ''}||${testId}||test`;
        resultsMap.set(key, { categoryId, subjectId, chapterId, testId, testName, categoryName, isStudyMatch: false, hasStudyMaterial: studyTitles.length > 0, score: matchesStudy ? 3 : 2 });
      }
      if (matchesStudy) {
        // Key by (categoryId + normalized testName) — not testId —
        // so the same test appearing in multiple chapters never creates duplicate Study cards
        const key = `${categoryId}||${normalizeText(testName)}||study`;
        if (!resultsMap.has(key)) {
          resultsMap.set(key, { categoryId, subjectId, chapterId, testId, testName, categoryName, isStudyMatch: true, hasStudyMaterial: true, score: 3 });
        }
      }

    });

    const sorted = Array.from(resultsMap.values())
      .sort((a, b) => {
        if (a.isStudyMatch !== b.isStudyMatch) return a.isStudyMatch ? -1 : 1;
        return b.score - a.score || a.testName.localeCompare(b.testName);
      });

    // Final dedup: same test name + same type → keep first occurrence
    const seen = new Set<string>();
    return sorted.filter(item => {
      const k = `${item.categoryId}||${item.testName}||${item.isStudyMatch}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

  }, [flattenedTests, searchQuery]);

  // ── PDF Notes search ──────────────────────────────────────────────────
  const matchingNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results: { examName: string; subjectName: string; noteTitle: string; driveUrl: string; icon?: string }[] = [];
    notesData.forEach(category => {
      category.subjects.forEach(subject => {
        subject.notes.forEach(note => {
          const blob = normalizeText([category.name, subject.name, note.title, note.description || ''].join(' '));
          if (normalizeText(q).split(' ').every(t => blob.includes(t))) {
            results.push({
              examName: category.name,
              subjectName: subject.name,
              noteTitle: note.title,
              driveUrl: note.driveUrl,
              icon: subject.icon,
            });
          }
        });
      });
    });
    return results.slice(0, 8);
  }, [searchQuery]);

  // ── Subject / Chapter search ──────────────────────────────────────────
  const matchingSubjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const hits: { categoryId: string; categoryName: string; subjectId: string; subjectName: string; testCount: number; }[] = [];
    categories.forEach(cat => {
      cat.subjects?.forEach(sub => {
        const blob = normalizeText([cat.name, sub.name].join(' '));
        if (normalizeText(q).split(' ').every(t => blob.includes(t))) {
          const tc = sub.tests.length + (sub.chapters?.reduce((a, c) => a + c.tests.length, 0) || 0);
          hits.push({ categoryId: cat.id, categoryName: cat.name, subjectId: sub.id, subjectName: sub.name, testCount: tc });
        }
      });
    });
    return hits.slice(0, 4);
  }, [categories, searchQuery]);

  const getCategoryTestCount = (category: ExamCategory) => {
    const direct = category.tests?.length || 0;
    const fromSubjects = category.subjects?.reduce((acc, s) => {
      const directSubjectTests = s.tests.length;
      const chapterTests = s.chapters?.reduce((cAcc, ch) => cAcc + ch.tests.length, 0) || 0;
      return acc + directSubjectTests + chapterTests;
    }, 0) || 0;
    return direct + fromSubjects;
  };

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  // Recommended tests: Featured CUET subjects + Most attempted tests
  const recommendedTests = useMemo(() => {
    interface RecommendedTest {
      categoryId: string;
      categoryName: string;
      subjectId?: string;
      subjectName?: string;
      testId: string;
      testName: string;
      questionCount: number;
      attemptCount: number;
      isFeatured: boolean;
    }

    const featured: RecommendedTest[] = [];
    const cuetCategory = categories.find((c) => c.id === 'cuet');

    // Add featured CUET subjects: Physics, Maths, English
    if (cuetCategory?.subjects) {
      const featuredSubjectIds = ['physics', 'mathematics', 'english'];
      featuredSubjectIds.forEach((subjectId) => {
        const subject = cuetCategory.subjects?.find((s) => s.id === subjectId);
        if (subject && subject.tests.length > 0) {
          const firstTest = subject.tests[0];
          featured.push({
            categoryId: cuetCategory.id,
            categoryName: cuetCategory.name,
            subjectId: subject.id,
            subjectName: subject.name,
            testId: firstTest.id,
            testName: firstTest.name,
            questionCount: firstTest.questions.length,
            attemptCount: 0,
            isFeatured: true
          });
        }
      });
    }

    // Count test attempts from results
    const attemptCounts = new Map<string, number>();
    results.forEach((r) => {
      if (r.categoryId !== 'bookmarked') {
        const key = `${r.categoryId}::${r.testId}`;
        attemptCounts.set(key, (attemptCounts.get(key) || 0) + 1);
      }
    });

    // Get most attempted tests (not already in featured)
    const featuredKeys = new Set(featured.map((f) => `${f.categoryId}::${f.testId}`));
    const popularTests: RecommendedTest[] = [];

    categories.forEach((category) => {
      const addTest = (test: Test, subjectId?: string, subjectName?: string) => {
        const key = `${category.id}::${test.id}`;
        if (featuredKeys.has(key)) return;
        const count = attemptCounts.get(key) || 0;
        if (count > 0) {
          popularTests.push({
            categoryId: category.id,
            categoryName: category.name,
            subjectId,
            subjectName,
            testId: test.id,
            testName: test.name,
            questionCount: test.questions.length,
            attemptCount: count,
            isFeatured: false
          });
        }
      };

      category.tests?.forEach((test) => addTest(test));
      category.subjects?.forEach((subject) => {
        subject.tests.forEach((test) => addTest(test, subject.id, subject.name));
      });
    });

    // Sort popular tests by attempt count and take top 3
    popularTests.sort((a, b) => b.attemptCount - a.attemptCount);
    const topPopular = popularTests.slice(0, 3);

    // Combine: Featured first, then popular (up to 6 total)
    return [...featured, ...topPopular].slice(0, 6);
  }, [categories, results]);

  const studyReadyItems = useMemo(() => {
    const list: {
      categoryId: string;
      categoryName: string;
      subjectId?: string;
      subjectName?: string;
      testId: string;
      testName: string;
      entryCount: number;
      lastUpdated: number;
    }[] = [];

    categories.forEach((category) => {
      const pushTest = (test: Test, subjectId?: string, subjectName?: string) => {
        if (test.studyMaterial?.sections?.length) {
          list.push({
            categoryId: category.id,
            categoryName: category.name,
            subjectId,
            subjectName,
            testId: test.id,
            testName: test.name,
            entryCount: test.studyMaterial.sections.length,
            lastUpdated: test.studyMaterial.lastUpdated
          });
        }
      };

      if (category.subjects?.length) {
        category.subjects.forEach((subject) => {
          subject.tests.forEach((test) => pushTest(test, subject.id, subject.name));
        });
      } else {
        category.tests?.forEach((test) => pushTest(test));
      }
    });

    return list.sort((a, b) => b.lastUpdated - a.lastUpdated).slice(0, 3);
  }, [categories]);

  return (
    <div className={`max-w-6xl mx-auto px-4 py-8 ${isDark ? 'bg-[#1F1F1E]' : ''
      }`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className={`text-4xl md:text-5xl font-semibold font-heading mb-3 ${isDark ? 'text-slate-100' : ''}`}>
            Boost your exam preparation
          </h1>
          <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>
            Add your own questions, build custom tests, and practice - not someone else's syllabus.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exams, tests, PDFs, study materials..."
              className={`w-full pl-9 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                ? 'border-slate-700 bg-[#1E1E1D] text-slate-100 placeholder-slate-400'
                : 'border-gray-200 bg-white'
                }`}
            />
          </div>
          <button
            onClick={onAdminClick}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${isDark
              ? 'bg-[#1E1E1D] text-white hover:bg-slate-700'
              : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
          >
            <Settings size={20} />
            Manage Content
          </button>
        </div>
      </div>

      {/* ── SEARCH RESULTS ── */}
      {searchQuery.trim() && (
        <div className={`rounded-xl border mb-8 overflow-hidden ${isDark ? 'border-slate-700 bg-[#1E1E1D]' : 'border-gray-200 bg-white'}`}>
          <div className={`px-5 py-3 border-b flex items-center gap-2 ${isDark ? 'border-slate-700 bg-[#1E1E1D]' : 'border-gray-100 bg-gray-50'}`}>
            <Search size={14} className={isDark ? 'text-slate-400' : 'text-gray-400'} />
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              Results for <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>"{searchQuery.trim()}"</span>
            </p>
          </div>

          {matchingSubjects.length === 0 && matchingTests.length === 0 && matchingNotes.length === 0 ? (
            <div className={`px-5 py-8 text-center text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              No results found. Try different keywords.
            </div>
          ) : (
            <>
              {matchingSubjects.length > 0 && (
                <div className={`p-4 border-b ${isDark ? 'border-slate-700/50' : 'border-gray-100'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Subjects</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {matchingSubjects.map(sub => (
                      <button key={`${sub.categoryId}-${sub.subjectId}`}
                        onClick={() => onSubjectSelect?.(sub.categoryId, sub.subjectId)}
                        className={`group text-left flex items-center gap-3 p-3 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`}>
                        <div className={`p-2 rounded-lg shrink-0 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                          <BookOpen size={15} className={isDark ? 'text-slate-300' : 'text-gray-500'} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>{sub.subjectName}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{sub.categoryName} · {sub.testCount} tests</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingTests.length > 0 && (
                <div className={`p-4 border-b ${isDark ? 'border-slate-700/50' : 'border-gray-100'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Tests & Study Material</p>
                  <div className="flex flex-col gap-0.5">
                    {matchingTests.slice(0, 6).map((item) => {
                      const cat = categories.find(c => c.id === item.categoryId);
                      const allT = cat ? [...(cat.tests || []), ...(cat.subjects?.flatMap(s => [...s.tests, ...(s.chapters?.flatMap(ch => ch.tests) || [])]) || [])] : [];
                      const qCount = allT.find(t => t.id === item.testId)?.questions.length || 0;
                      return (
                        <button key={`${item.categoryId}-${item.subjectId || ''}-${item.testId}`}
                          onClick={() => item.isStudyMatch ? onStudySelect(item.categoryId, item.subjectId, item.testId) : onTestSelectFromSearch(item.categoryId, item.subjectId, item.testId, item.chapterId)}
                          className={`group text-left flex items-center gap-3 p-3 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`}>
                          <div className={`p-2 rounded-lg shrink-0 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                            {item.isStudyMatch ? <BookOpen size={15} className={isDark ? 'text-amber-400' : 'text-amber-600'} /> : <FileText size={15} className={isDark ? 'text-slate-300' : 'text-gray-500'} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>{item.testName}</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{item.categoryName}{item.isStudyMatch ? ' · Study Material' : qCount > 0 ? ` · ${qCount} questions` : ''}</p>
                          </div>
                          <span className={`text-xs shrink-0 px-2 py-0.5 rounded-full font-medium ${item.isStudyMatch ? isDark ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-50 text-amber-700' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                            {item.isStudyMatch ? 'Study' : 'Test'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {matchingNotes.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>PDF Notes</p>
                    <button onClick={onNotesClick} className={`text-xs ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700'}`}>View all →</button>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {matchingNotes.map((note, idx) => {
                      const isReady = !note.driveUrl.includes('your-link-here');
                      return (
                        <a key={idx} href={isReady ? note.driveUrl : undefined} target="_blank" rel="noopener noreferrer"
                          className={`group flex items-center gap-3 p-3 rounded-lg transition-colors ${isReady ? isDark ? 'hover:bg-slate-700/50 cursor-pointer' : 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
                          <div className={`p-2 rounded-lg shrink-0 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                            <FileText size={15} className={isDark ? 'text-slate-300' : 'text-gray-500'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>{note.noteTitle}</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{note.examName} · {note.subjectName}</p>
                          </div>
                          {isReady ? <ExternalLink size={13} className={`shrink-0 opacity-0 group-hover:opacity-60 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} /> : <span className={`text-xs shrink-0 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Soon</span>}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}


      {/* Categories grid - Available tests at top */}
      <div className="mb-10">
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-slate-200' : ''}`}>
          Available Exams &amp; Tests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const Icon = iconMap[category.icon] || FileText;
            const testCount = getCategoryTestCount(category);
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 p-6 text-left group ${isDark
                  ? 'bg-[#1E1E1D] border border-slate-700 hover:border-blue-500/60'
                  : 'bg-white border border-gray-100 hover:border-blue-200'
                  }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg transition-colors border ${isDark
                    ? 'bg-blue-900/20 border-blue-800 group-hover:bg-blue-900/40'
                    : 'bg-blue-50 border-blue-100 group-hover:bg-blue-100'
                    }`}>
                    <Icon className={isDark ? 'text-blue-300' : 'text-blue-600'} size={28} />
                  </div>
                  <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                    {category.name}
                  </h2>
                </div>
                <div className={`flex gap-4 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  <span>{testCount} Practice Tests</span>
                  <span>•</span>
                  <span>{category.pdfs.length} PYQs</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended section — always visible (pinned quiz card + attempted tests) */}
      <div className="mb-10">
        <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-slate-200' : ''}`}>
          <span className="text-orange-500">🔥</span>
          Recommended for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* ── Pinned: Practice Portal's Quiz ── */}
          <button
            onClick={onQuickQuizClick}
            className={`rounded-xl p-5 text-left transition-all hover:shadow-xl group col-span-1 ${isDark
              ? 'bg-gradient-to-br from-violet-900/50 via-purple-900/30 to-indigo-900/40 border border-violet-600/50 hover:border-violet-400/70'
              : 'bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 border border-violet-300 hover:border-violet-500'
              }`}
          >
            <div className="mb-3">
              <p className={`text-xs uppercase tracking-wide font-semibold ${isDark ? 'text-violet-400' : 'text-violet-600'
                }`}>
                General Knowledge
              </p>
              <h3 className={`text-base font-bold mt-1 ${isDark ? 'text-slate-100' : 'text-gray-900'
                }`}>
                Practice Portal's Quiz
              </h3>
            </div>
            <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
              10 random GK questions · Instant feedback · No time pressure
            </p>
            <div className={`w-full py-2 rounded-lg text-xs font-semibold text-center transition-colors ${isDark
              ? 'bg-violet-600/30 text-violet-300 group-hover:bg-violet-600/50'
              : 'bg-violet-600 text-white group-hover:bg-violet-700'
              }`}>
              Start Quick Quiz →
            </div>
          </button>
          {recommendedTests.map((item) => (
            <button
              key={`${item.categoryId}-${item.subjectId || 'root'}-${item.testId}`}
              onClick={() => onTestSelectFromSearch(item.categoryId, item.subjectId, item.testId)}
              className={`rounded-xl p-5 text-left transition-all hover:shadow-lg group ${item.isFeatured
                ? isDark
                  ? 'bg-gradient-to-br from-orange-900/40 to-amber-900/20 border border-orange-700/50 hover:border-orange-500/70'
                  : 'bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 hover:border-orange-400'
                : isDark
                  ? 'bg-[#1E1E1D] border border-slate-700 hover:border-blue-500/60'
                  : 'bg-white border border-gray-100 hover:border-blue-200'
                }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className={`text-xs uppercase tracking-wide ${item.isFeatured
                    ? isDark ? 'text-orange-400' : 'text-orange-600'
                    : isDark ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                    {item.categoryName}{item.subjectName ? ` • ${item.subjectName}` : ''}
                  </p>
                  <h3 className={`text-base font-semibold mt-1 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                    {item.testName}
                  </h3>
                </div>
                {item.isFeatured && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700'
                    }`}>
                    Featured
                  </span>
                )}
              </div>
              <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                <span>{item.questionCount} questions</span>
                {item.attemptCount > 0 && (
                  <>
                    <span>•</span>
                    <span className={isDark ? 'text-green-400' : 'text-green-600'}>
                      {item.attemptCount} attempt{item.attemptCount > 1 ? 's' : ''}
                    </span>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Study mode grid */}
      <div className="mb-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : ''}`}>
              <Sparkles size={18} className="text-amber-500" />
              Study Mode Highlights
            </h2>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Read curated explanations before attempting a test.
            </p>
          </div>
          <button
            onClick={onOpenStudyLibrary}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${isDark
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/60'
              : 'border-amber-400 bg-amber-50/50 text-amber-700 hover:bg-amber-100 hover:border-amber-500'
              }`}
          >
            Open Study Library
          </button>
        </div>
        {studyReadyItems.length === 0 ? (
          <div
            className={`rounded-xl border p-6 text-sm ${isDark ? 'border-slate-700 text-slate-300' : 'border-gray-200 text-gray-600'
              }`}
          >
            No study material found yet. Enable Study Mode for any test inside the Admin Panel to see it here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyReadyItems.map((item) => (
              <div
                key={`${item.categoryId}-${item.subjectId || 'root'}-${item.testId}`}
                className={`rounded-xl p-5 shadow-md border flex flex-col justify-between ${isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white border-gray-100'
                  }`}
              >
                <div className="mb-4">
                  <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    {item.categoryName}
                    {item.subjectName ? ` • ${item.subjectName}` : ''}
                  </p>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                    {item.testName}
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    {item.entryCount} study note{item.entryCount > 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => onStudySelect(item.categoryId, item.subjectId, item.testId)}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 ${isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  <BookOpen size={16} />
                  Study this test
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weak Areas Analyzer Banner */}
      <div className="mb-10">
        <div
          className={`w-full rounded-2xl p-6 text-left transition-all hover:shadow-xl group border ${isDark
            ? 'bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-[#1E1E1D] border-indigo-700/50 hover:border-indigo-500/70'
            : 'bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border-indigo-200 hover:border-indigo-400'
            }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className={`p-4 rounded-2xl flex-shrink-0 self-start ${isDark ? 'bg-indigo-900/50 border border-indigo-700/50' : 'bg-indigo-100'
              }`}>
              <TrendingDown size={32} className={isDark ? 'text-indigo-400' : 'text-indigo-600'} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'
                  }`}>Weak Areas Analyzer</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isDark ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50' : 'bg-indigo-100 text-indigo-700'
                  }`}>Smart Analytics</span>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'
                }`}>
                Identify where you need the most work. See accuracy per subject & test, get retry suggestions, and track improvement over time.
              </p>
              <div className={`flex flex-wrap gap-4 mt-3 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'
                }`}>
                <span className="flex items-center gap-1"><AlertTriangle size={12} className="text-orange-500" /> Weak area detection</span>
                <span className="flex items-center gap-1"><BarChart2 size={12} className="text-indigo-500" /> Subject-wise breakdown</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> Retry suggestions</span>
              </div>
            </div>
            <button
              onClick={onWeakAreasClick}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors self-start sm:self-center ${isDark
                ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
            >
              Analyze Now →
            </button>
          </div>
        </div>
      </div>

      {/* Stats + Bookmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Stats card */}
        <div className={`lg:col-span-2 rounded-xl shadow-md p-6 ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'
          }`}>
          <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-gray-800'
            }`}>
            <BarChart2 size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            Study Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div
              className={`rounded-lg p-4 border ${isDark
                ? 'bg-gradient-to-br from-blue-900/60 to-blue-600/40 border-blue-800'
                : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-100'
                }`}
            >
              <div className={`text-xs mb-1 ${isDark ? 'text-blue-100/80' : 'text-blue-600/80'}`}>Accuracy</div>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-700'}`}>
                  {accuracy.toFixed(1)}%
                </span>
              </div>
            </div>
            <div
              className={`rounded-lg p-4 border ${isDark
                ? 'bg-gradient-to-br from-emerald-900/60 to-emerald-600/40 border-emerald-800'
                : 'bg-gradient-to-br from-green-50 to-green-100 border-green-100'
                }`}
            >
              <div className={`text-xs mb-1 ${isDark ? 'text-emerald-100/80' : 'text-green-600/80'}`}>
                Total Questions Solved
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={isDark ? 'text-white' : 'text-green-600'} size={18} />
                <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-green-700'}`}>{totalSolved}</span>
              </div>
            </div>
            <div
              className={`rounded-lg p-4 border ${isDark
                ? 'bg-gradient-to-br from-amber-900/60 to-amber-600/40 border-amber-800'
                : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-100'
                }`}
            >
              <div className={`text-xs mb-1 ${isDark ? 'text-amber-100/80' : 'text-amber-600/80'}`}>
                Time Spent Studying
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className={isDark ? 'text-white' : 'text-amber-600'} size={18} />
                <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-amber-700'}`}>
                  {formatDuration(totalTimeSeconds)}
                </span>
              </div>
            </div>
          </div>

          {/* Performance trend */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                Accuracy Trend (%)
              </span>
              <span className={`${isDark ? 'text-slate-400' : 'text-gray-500'} text-xs`}>
                Last {trendData.length} attempts
              </span>
            </div>
            {trendData.length === 0 || !accuracyChart ? (
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                No attempts yet. Take a test to see your performance graph.
              </p>
            ) : (
              <div
                className={`rounded-xl border p-4 ${isDark ? 'bg-[#1F1F1E] border-slate-700' : 'bg-gradient-to-br from-white to-blue-50 border-gray-100'
                  }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>
                    Max {Math.round(accuracyChart.maxValue)}%
                  </span>
                  <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>
                    Min {Math.round(accuracyChart.minValue)}%
                  </span>
                </div>
                <svg
                  viewBox={`0 0 ${accuracyChart.width} ${accuracyChart.height}`}
                  preserveAspectRatio="none"
                  className="w-full h-32"
                >
                  <defs>
                    <linearGradient id="accuracyLineFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={isDark ? '#60a5fa66' : '#93c5fd80'} />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={accuracyChart.areaPath}
                    fill="url(#accuracyLineFill)"
                    stroke="none"
                  />
                  <polyline
                    points={accuracyChart.linePath}
                    fill="none"
                    stroke={isDark ? '#60a5fa' : '#2563eb'}
                    strokeWidth={3}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {accuracyChart.points.map((point, idx) => (
                    <g key={`${point.ts}-${idx}`}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={4}
                        fill={isDark ? '#1d4ed8' : '#2563eb'}
                        stroke={isDark ? '#93c5fd' : '#bfdbfe'}
                        strokeWidth={2}
                      >
                        <title>{`${point.pct.toFixed(1)}% on ${new Date(point.ts).toLocaleDateString()}`}</title>
                      </circle>
                    </g>
                  ))}
                </svg>
                <div className="flex justify-between text-[10px] mt-2">
                  {trendData.map((item) => (
                    <span
                      key={item.ts}
                      className={isDark ? 'text-slate-400' : 'text-gray-500'}
                    >
                      {formatTrendLabel(item.ts)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bookmarks card */}
        <div className={`rounded-xl shadow-md p-6 flex flex-col justify-between ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'
          }`}>
          <div>
            <h2 className={`flex items-center gap-2 text-lg font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-gray-800'
              }`}>
              <Bookmark size={20} className="text-yellow-500" />
              Bookmarked Questions
            </h2>
            <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              Save tricky questions and practice them again in a dedicated test.
            </p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                {bookmarks.length}
              </span>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>saved</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={onStartBookmarkedTest}
              disabled={bookmarks.length === 0}
              className={`w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors text-sm font-semibold flex items-center justify-center gap-2 ${isDark ? 'disabled:bg-slate-700 disabled:text-slate-400' : ''}`}
            >
              <CheckCircle2 size={18} />
              Take Bookmarked Questions Test
            </button>
            <button
              onClick={onStartManageBookmarks}
              disabled={bookmarks.length === 0}
              className={`w-full px-4 py-2 border rounded-lg transition-colors text-sm font-semibold ${isDark
                ? 'border-slate-600 text-slate-200 hover:bg-[#1E1E1D] disabled:bg-[#1E1E1D] disabled:text-slate-500 disabled:border-slate-700 disabled:cursor-not-allowed'
                : 'border-gray-300 text-gray-800 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed'
                }`}
            >
              Manage Bookmarks
            </button>
          </div>
        </div>
      </div>

      {/* Past attempts */}
      <div className="mb-8">
        <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
          Recent Test Attempts
        </h2>
        {recentResults.length === 0 ? (
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            No attempts yet. Start a test to see your history here.
          </p>
        ) : (
          <div className={`rounded-xl shadow-md p-4 overflow-x-auto ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'
            }`}>
            <table className="min-w-full text-sm">
              <thead>
                <tr className={`text-left border-b ${isDark ? 'bg-[#1F1F1E] border-slate-700 text-slate-400' : 'bg-gray-50 text-gray-600'
                  }`}>
                  <th className="py-2 pr-4 font-semibold">Test</th>
                  <th className="py-2 pr-4 font-semibold">Category</th>
                  <th className="py-2 pr-4 font-semibold">Score</th>
                  <th className="py-2 pr-4 font-semibold">Accuracy</th>
                  <th className="py-2 pr-4 font-semibold">Time</th>
                  <th className="py-2 pr-4 font-semibold">Date</th>
                  <th className="py-2 pr-2 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentResults.map((r) => {
                  const isBookmarkedResult = r.categoryId === 'bookmarked';
                  const category = isBookmarkedResult ? undefined : getCategoryById(r.categoryId);
                  const categoryName = isBookmarkedResult
                    ? 'Bookmarked Questions'
                    : category?.name || r.categoryId;
                  // Try to resolve test name and logic
                  let testName = isBookmarkedResult ? 'Bookmarked Questions Practice' : r.testId;
                  let subjectId: string | undefined;
                  let chapterId: string | undefined;

                  if (category) {
                    // Check direct tests
                    let foundTest = category.tests?.find(t => t.id === r.testId);

                    // Check subjects
                    if (!foundTest && category.subjects) {
                      for (const sub of category.subjects) {
                        // Check direct subject tests
                        foundTest = sub.tests.find(t => t.id === r.testId);
                        if (foundTest) {
                          subjectId = sub.id;
                          break;
                        }

                        // Check chapter tests
                        if (sub.chapters) {
                          for (const chap of sub.chapters) {
                            foundTest = chap.tests.find(t => t.id === r.testId);
                            if (foundTest) {
                              subjectId = sub.id;
                              chapterId = chap.id;
                              break;
                            }
                          }
                        }
                        if (foundTest) break;
                      }
                    }

                    if (foundTest) {
                      testName = foundTest.name;
                    }
                  }

                  const pct = r.total > 0 ? (r.score / r.total) * 100 : 0;
                  const date = new Date(r.timestamp);
                  const duration = r.durationSeconds ?? 0;
                  const handleTestAgain = () => {
                    if (isBookmarkedResult) {
                      if (bookmarks.length === 0) {
                        alert('No bookmarked questions available right now.');
                        return;
                      }
                      onStartBookmarkedTest();
                    } else {
                      onTestSelectFromSearch(r.categoryId, subjectId, r.testId, chapterId);
                    }
                  };
                  return (
                    <tr key={`${r.categoryId}-${r.testId}-${r.timestamp}`} className={`border-b last:border-0 ${isDark ? 'border-slate-700' : ''
                      }`}>
                      <td className={`py-2 pr-4 font-medium ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                        {testName}
                      </td>
                      <td className={`py-2 pr-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        {categoryName}
                      </td>
                      <td className={`py-2 pr-4 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                        {r.score} / {r.total}
                      </td>
                      <td className={`py-2 pr-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        {pct.toFixed(1)}%
                      </td>
                      <td className={`py-2 pr-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        {formatDuration(duration)}
                      </td>
                      <td className={`py-2 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2 pr-2 text-right">
                        <button
                          onClick={handleTestAgain}
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${isDark
                            ? 'border-blue-800 text-blue-300 hover:bg-blue-900/30'
                            : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                            }`}
                        >
                          Test again
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {sortedResults.length > 5 && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => setShowAllResults((prev) => !prev)}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800"
                >
                  {showAllResults ? 'Show last 5' : 'View all'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
