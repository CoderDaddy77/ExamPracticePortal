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
  Bookmark
} from 'lucide-react';
import type { ExamCategory, TestResult, BookmarkedQuestion } from '../types';

interface HomePageProps {
  categories: ExamCategory[];
  results: TestResult[];
  bookmarks: BookmarkedQuestion[];
  isDark: boolean;
  onCategorySelect: (categoryId: string) => void;
  onAdminClick: () => void;
  onStartBookmarkedTest: () => void;
  onStartManageBookmarks: () => void;
  onTestSelectFromSearch: (categoryId: string, subjectId: string | undefined, testId: string) => void;
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
  onAdminClick,
  onStartBookmarkedTest,
  onStartManageBookmarks,
  onTestSelectFromSearch
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
      if (category.subjects?.some((s) => s.tests.some((t) => t.name.toLowerCase().includes(q)))) return true;
      return false;
    });
  }, [categories, searchQuery]);

  const matchingTests = useMemo(
    () => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return [] as {
        categoryId: string;
        subjectId?: string;
        testId: string;
        testName: string;
        categoryName: string;
      }[];

      const resultsList: {
        categoryId: string;
        subjectId?: string;
        testId: string;
        testName: string;
        categoryName: string;
      }[] = [];

      categories.forEach((category) => {
        const directTests = category.tests || [];
        directTests.forEach((test) => {
          if (test.name.toLowerCase().includes(q)) {
            resultsList.push({
              categoryId: category.id,
              testId: test.id,
              testName: test.name,
              categoryName: category.name
            });
          }
        });

        category.subjects?.forEach((subject) => {
          subject.tests.forEach((test) => {
            if (
              test.name.toLowerCase().includes(q) ||
              subject.name.toLowerCase().includes(q)
            ) {
              resultsList.push({
                categoryId: category.id,
                subjectId: subject.id,
                testId: test.id,
                testName: test.name,
                categoryName: category.name
              });
            }
          });
        });
      });

      return resultsList;
    },
    [categories, searchQuery]
  );

  const getCategoryTestCount = (category: ExamCategory) => {
    const direct = category.tests?.length || 0;
    const fromSubjects = category.subjects?.reduce((acc, s) => acc + s.tests.length, 0) || 0;
    return direct + fromSubjects;
  };

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  return (
    <div className={`max-w-6xl mx-auto px-4 py-8 ${
      isDark ? 'bg-[#18191D]' : ''
    }`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-bold mb-1 ${isDark ? 'text-slate-100' : ''}`}>
            Boost your exam preparation
          </h1>
          <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>
            Track your progress, revisit tough questions, and keep improving.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exams, tests, PDFs..."
              className={`w-full pl-9 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'border-slate-700 bg-[#212226] text-slate-100 placeholder-slate-400'
                  : 'border-gray-200 bg-white'
              }`}
            />
          </div>
          <button
            onClick={onAdminClick}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              isDark
                ? 'bg-[#212226] text-white hover:bg-slate-700'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <Settings size={20} />
            Manage Content
          </button>
        </div>
      </div>

      {/* Search test results */}
      {searchQuery.trim() && (
        <div className={`py-6 px-4 rounded-lg mb-6 ${
          isDark ? 'bg-[#212226]/50 border border-slate-700' : 'bg-gray-50 border border-gray-200'
        }`}>
          <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-200' : ''}`}>
            Search results for <span className="text-blue-500">"{searchQuery.trim()}"</span>
          </h2>
          {matchingTests.length === 0 ? (
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              No tests found. Try a different keyword.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {matchingTests.map((item) => (
                <button
                  key={`${item.categoryId}-${item.subjectId || 'root'}-${item.testId}`}
                  onClick={() => onTestSelectFromSearch(item.categoryId, item.subjectId, item.testId)}
                  className="px-3 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-xs text-blue-700 hover:bg-blue-100 hover:border-blue-200 transition-colors"
                >
                  <span className="font-semibold">{item.testName}</span>
                  <span className="text-[11px] text-blue-500 ml-2">({item.categoryName})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories grid - Available tests at top */}
      <div className="mb-10">
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-slate-200' : ''}`}>
          Available Exams & Tests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const Icon = iconMap[category.icon] || FileText;
            const testCount = getCategoryTestCount(category);
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 p-6 text-left group ${
                  isDark
                    ? 'bg-[#212226] border border-slate-700 hover:border-blue-500/60'
                    : 'bg-white border border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg transition-colors border ${
                    isDark
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

      {/* Stats + Bookmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Stats card */}
        <div className={`lg:col-span-2 rounded-xl shadow-md p-6 ${
          isDark ? 'bg-[#212226] border border-slate-700' : 'bg-white'
        }`}>
          <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${
            isDark ? 'text-slate-200' : 'text-gray-800'
          }`}>
            <BarChart2 size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            Study Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div
              className={`rounded-lg p-4 border ${
                isDark
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
              className={`rounded-lg p-4 border ${
                isDark
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
              className={`rounded-lg p-4 border ${
                isDark
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
                className={`rounded-xl border p-4 ${
                  isDark ? 'bg-[#18191D] border-slate-700' : 'bg-gradient-to-br from-white to-blue-50 border-gray-100'
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
        <div className={`rounded-xl shadow-md p-6 flex flex-col justify-between ${
          isDark ? 'bg-[#212226] border border-slate-700' : 'bg-white'
        }`}>
          <div>
            <h2 className={`flex items-center gap-2 text-lg font-semibold mb-2 ${
              isDark ? 'text-slate-200' : 'text-gray-800'
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
              className={`w-full px-4 py-2 border rounded-lg transition-colors text-sm font-semibold ${
                isDark
                  ? 'border-slate-600 text-slate-200 hover:bg-[#212226] disabled:bg-[#212226] disabled:text-slate-500 disabled:border-slate-700 disabled:cursor-not-allowed'
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
          <div className={`rounded-xl shadow-md p-4 overflow-x-auto ${
            isDark ? 'bg-[#212226] border border-slate-700' : 'bg-white'
          }`}>
            <table className="min-w-full text-sm">
              <thead>
                <tr className={`text-left border-b ${
                  isDark ? 'bg-[#18191D] border-slate-700 text-slate-400' : 'bg-gray-50 text-gray-600'
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
                  // Try to resolve test name
                  let testName = isBookmarkedResult ? 'Bookmarked Questions Practice' : r.testId;
                  let subjectId: string | undefined;
                  if (category) {
                    const allTests = [
                      ...(category.tests || []),
                      ...(category.subjects?.flatMap((s) => s.tests) || [])
                    ];
                    const testObj = allTests.find((t) => t.id === r.testId);
                    if (testObj) testName = testObj.name;

                    if (category.subjects) {
                      const subjectContaining = category.subjects.find((s) =>
                        s.tests.some((t) => t.id === r.testId)
                      );
                      if (subjectContaining) subjectId = subjectContaining.id;
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
                      onTestSelectFromSearch(r.categoryId, subjectId, r.testId);
                    }
                  };
                  return (
                    <tr key={`${r.categoryId}-${r.testId}-${r.timestamp}`} className={`border-b last:border-0 ${
                      isDark ? 'border-slate-700' : ''
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
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                            isDark
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
