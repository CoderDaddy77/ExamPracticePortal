import { useMemo } from 'react';
import { ArrowLeft, Bookmark, Trash2, BookOpen } from 'lucide-react';
import type { ExamCategory, Test, Question, BookmarkedQuestion } from '../types';
import { RichContent } from './RichContent';

interface ManageBookmarksPageProps {
  categories: ExamCategory[];
  bookmarks: BookmarkedQuestion[];
  isDark: boolean;
  onBack: () => void;
  onRemoveBookmark: (bookmarkId: string) => void;
}

interface ResolvedBookmark {
  bookmarkId: string;
  categoryName: string;
  testName: string;
  question: Question;
}

function getAllTests(category: ExamCategory): Test[] {
  return [
    ...(category.tests || []),
    ...(category.subjects?.flatMap((s) => [
      ...s.tests,
      ...(s.chapters?.flatMap((ch) => ch.tests) || [])
    ]) || [])
  ];
}

function findQuestion(test: Test, b: BookmarkedQuestion): Question | undefined {
  // Primary: match by ID
  const byId = test.questions.find((q) => q.id === b.questionId);
  if (byId) return byId;
  // Fallback: match by stored question text (survives admin ID regeneration)
  if (b.questionText) {
    return test.questions.find((q) => q.question === b.questionText);
  }
  return undefined;
}

function resolveBookmarks(
  bookmarks: BookmarkedQuestion[],
  categories: ExamCategory[]
): ResolvedBookmark[] {
  const resolved: ResolvedBookmark[] = [];

  bookmarks.forEach((b) => {
    const category = categories.find((c) => c.id === b.categoryId);
    if (!category) return;

    const allTests = getAllTests(category);

    // Primary: find the specific test
    let test = allTests.find((t) => t.id === b.testId);
    let question: Question | undefined;

    if (test) {
      question = findQuestion(test, b);
    }

    // If not found in specific test, search all tests (test may have been moved)
    if (!question) {
      for (const t of allTests) {
        question = findQuestion(t, b);
        if (question) { test = t; break; }
      }
    }

    if (!test || !question) return;

    resolved.push({
      bookmarkId: b.id,
      categoryName: category.name,
      testName: test.name,
      question
    });
  });

  return resolved;
}

export function ManageBookmarksPage({
  categories,
  bookmarks,
  isDark,
  onBack,
  onRemoveBookmark
}: ManageBookmarksPageProps) {
  const resolved = useMemo(
    () => resolveBookmarks(bookmarks, categories),
    [bookmarks, categories]
  );

  const hasBookmarks = bookmarks.length > 0 && resolved.length > 0;

  return (
    <div className={`min-h-screen py-8 px-4 ${
      isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'
    }`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          
          <div className="flex items-center gap-2">
            <Bookmark className="text-yellow-500" size={22} />
            <div>
              <h1 className={`text-xl font-semibold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>Manage Bookmarked Questions</h1>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                View and remove questions you have saved from your tests.
              </p>
            </div>
          </div>
        </div>

        {!hasBookmarks && (
          <div className={`rounded-xl shadow-md p-8 text-center ${
            isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white'
          }`}>
            <Bookmark size={32} className={`mx-auto mb-3 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
            <h2 className={`text-lg font-semibold mb-1 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>No bookmarked questions</h2>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Bookmark questions from your test results to see them listed here.
            </p>
            {bookmarks.length > 0 && resolved.length === 0 && (
              <p className={`text-xs mt-3 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                ⚠️ {bookmarks.length} bookmark{bookmarks.length > 1 ? 's' : ''} could not be resolved — the questions may have been removed from their tests.
              </p>
            )}
          </div>
        )}

        {hasBookmarks && (
          <div className={`rounded-xl shadow-md p-4 sm:p-6 ${
            isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                You have <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>{resolved.length}</span> active bookmark
                {resolved.length > 1 ? 's' : ''}.
              </p>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {resolved.map((item) => (
                <div
                  key={item.bookmarkId}
                  className={`border rounded-lg p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 ${
                    isDark ? 'bg-[#1E1E1D] border-slate-600' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className={`flex flex-wrap items-center gap-2 mb-2 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                        isDark
                          ? 'bg-blue-900/30 text-blue-400 border-blue-700'
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        <BookOpen size={12} />
                        {item.categoryName}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border ${
                        isDark
                          ? 'bg-[#1E1E1D] text-slate-300 border-slate-600'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {item.testName}
                      </span>
                    </div>
                    <p className={`text-sm whitespace-pre-line ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                      <RichContent content={item.question.question} />
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-end gap-2">
                    <button
                      onClick={() => onRemoveBookmark(item.bookmarkId)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        isDark
                          ? 'border-red-800 text-red-400 hover:bg-red-900/30'
                          : 'border-red-200 text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
