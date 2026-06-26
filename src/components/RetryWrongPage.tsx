import { useState } from 'react';
import { AlertCircle, RefreshCcw, RotateCcw, CheckCircle2, XCircle, Home, Bookmark, BookmarkCheck, Download, Pencil, X } from 'lucide-react';
import type { Question, Test, BookmarkedQuestion, TestPerformanceStats } from '../types';
import { TestPage } from './TestPage';
import { evaluateTestPerformance } from '../utils/scoring';
import { RichContent } from './RichContent';
import { generateTestPdf } from '../utils/generateTestPdf';
import { MatchingQuestionDisplay } from './MatchingQuestionDisplay';

interface RetryWrongPageProps {
  wrongQuestions: Question[];
  originalTestName: string;
  categoryName: string;
  categoryId: string;
  testId?: string; // original test ID for bookmark ID matching
  bookmarks: BookmarkedQuestion[];
  isDark: boolean;
  onBack: () => void;   // go back to original results
  onHome: () => void;
  onToggleBookmark: (questionId: string, isBookmarked: boolean) => void;
  onSaveExplanation?: (questionId: string, explanation: string) => void;
}

type RetryView = 'test' | 'results';

export function RetryWrongPage({
  wrongQuestions,
  originalTestName,
  categoryName,
  categoryId,
  testId,
  bookmarks,
  isDark,
  onBack,
  onHome,
  onToggleBookmark,
  onSaveExplanation,
}: RetryWrongPageProps) {
  const [retryView, setRetryView] = useState<RetryView>('test');
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [performance, setPerformance] = useState<TestPerformanceStats | null>(null);

  // Edit explanation modal state
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    questionId: string;
    questionText: string;
    value: string;
  }>({ isOpen: false, questionId: '', questionText: '', value: '' });

  // Local overrides for explanations
  const [explanationOverrides, setExplanationOverrides] = useState<Record<string, string>>({});

  const openEditModal = (question: Question) => {
    const currentExplanation = explanationOverrides[question.id] ?? question.explanation ?? '';
    setEditModal({
      isOpen: true,
      questionId: question.id,
      questionText: question.question,
      value: currentExplanation
    });
  };

  const handleSaveExplanation = () => {
    const { questionId, value } = editModal;
    setExplanationOverrides(prev => ({ ...prev, [questionId]: value }));
    if (onSaveExplanation) {
      onSaveExplanation(questionId, value);
    }
    setEditModal(m => ({ ...m, isOpen: false }));
  };

  // Guard: no wrong questions (shouldn't happen, but safety net)
  if (!wrongQuestions || wrongQuestions.length === 0) {
    return (
      <div className={`min-h-screen py-8 px-4 ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'}`}>
        <div className={`max-w-xl mx-auto rounded-xl shadow-lg p-8 text-center ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'}`}>
          <CheckCircle2 className="mx-auto mb-4 text-green-500" size={48} />
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
            No Wrong Questions!
          </h2>
          <p className={`mb-6 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            You got everything right — nothing to retry here.
          </p>
          
        </div>
      </div>
    );
  }

  // Synthetic test built from wrong questions only
  const syntheticTest: Test = {
    id: 'retry-wrong',
    name: `Retry: ${originalTestName}`,
    questions: wrongQuestions,
  };

  const handleSubmit = (
    submittedAnswers: (number | null)[],
    _score: number,
    _total: number,
    _durationSeconds?: number,
    perf?: TestPerformanceStats
  ) => {
    const resolvedPerf = perf ?? evaluateTestPerformance(submittedAnswers, wrongQuestions);
    setAnswers(submittedAnswers);
    setPerformance(resolvedPerf);
    setRetryView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetryAgain = () => {
    setAnswers([]);
    setPerformance(null);
    setRetryView('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (retryView === 'test') {
    return (
      <TestPage
        test={syntheticTest}
        categoryId={categoryId}
        categoryName={categoryName}
        isDark={isDark}
        onBack={onBack}
        onSubmit={handleSubmit}
      />
    );
  }

  // ── Results view ───────────────────────────────────────────────────
  const correct = performance?.correct ?? 0;
  const incorrect = performance?.incorrect ?? 0;
  const unattempted = performance?.unattempted ?? 0;
  const total = wrongQuestions.length;
  const percentage = total > 0 ? ((correct / total) * 100).toFixed(1) : '0.0';

  return (
    <div className={`min-h-screen py-8 px-4 ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'}`}>
      <div className="max-w-5xl mx-auto">

        {/* Back button */}
        

        {/* Score card */}
        <div className={`rounded-xl shadow-lg p-8 mb-6 ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'}`}>

          {/* Header banner */}
          <div className={`flex items-center gap-3 mb-6 px-4 py-3 rounded-lg ${isDark ? 'bg-orange-900/30 border border-orange-700/50' : 'bg-orange-50 border border-orange-200'}`}>
            <RefreshCcw className="text-orange-500 flex-shrink-0" size={22} />
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                Retry Session
              </p>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                {syntheticTest.name}
              </p>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 text-3xl font-black ${
              correct === total
                ? 'bg-green-100 text-green-600'
                : correct > total / 2
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-red-100 text-red-600'
            }`}>
              {percentage}%
            </div>
            <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
              {correct === total
                ? '🎉 Perfect! All correct!'
                : correct > total / 2
                  ? '📈 Good improvement!'
                  : '💪 Keep practising!'}
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              You were retrying <strong>{total}</strong> previously-wrong question{total !== 1 ? 's' : ''} from <em>{originalTestName}</em>
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 rounded-lg p-5 text-center border-2 border-green-200">
              <CheckCircle2 className="text-green-600 mx-auto mb-2" size={28} />
              <div className="text-3xl font-bold text-green-600 mb-1">{correct}</div>
              <div className="text-xs text-gray-600">Now Correct</div>
            </div>
            <div className="bg-red-50 rounded-lg p-5 text-center border-2 border-red-200">
              <XCircle className="text-red-600 mx-auto mb-2" size={28} />
              <div className="text-3xl font-bold text-red-600 mb-1">{incorrect}</div>
              <div className="text-xs text-gray-600">Still Wrong</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-5 text-center border-2 border-amber-200">
              <AlertCircle className="text-amber-600 mx-auto mb-2" size={28} />
              <div className="text-3xl font-bold text-amber-600 mb-1">{unattempted}</div>
              <div className="text-xs text-gray-600">Skipped</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onHome}
              className="flex-1 min-w-[130px] px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Home
            </button>
            <button
              onClick={() => generateTestPdf(syntheticTest, { testName: syntheticTest.name, categoryName })}
              className="flex-1 min-w-[130px] px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Download PDF
            </button>
            <button
              onClick={handleRetryAgain}
              className="flex-1 min-w-[130px] px-5 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Retry Again
            </button>
          </div>
        </div>

        {/* Answer review */}
        <div className={`rounded-xl shadow-lg p-8 ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'}`}>
          <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
            Answer Review
          </h2>

          <div className="space-y-6">
            {wrongQuestions.map((question, idx) => {
              const userAnswer = answers[idx] ?? null;
              const isCorrect = userAnswer === question.correctAnswer;
              // Use original testId for bookmark ID to match App.tsx handleToggleBookmark format
              const effectiveTestId = testId || 'retry-wrong';
              const bookmarkId = `${categoryId}-${effectiveTestId}-${question.id}`;
              const isBookmarked = bookmarks.some((b) => b.id === bookmarkId);
              const explanation = explanationOverrides[question.id] ?? question.explanation;

              return (
                <div
                  key={question.id}
                  className={`border-2 rounded-lg p-6 ${
                    isCorrect
                      ? isDark ? 'border-green-700 bg-green-900/20' : 'border-green-200 bg-green-50'
                      : isDark ? 'border-red-700 bg-red-900/20' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm ${isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <MatchingQuestionDisplay questionText={question.question} isDark={isDark} className={`font-medium flex-1 ${isDark ? 'text-slate-200' : 'text-gray-800'}`} />
                        <button
                          type="button"
                          onClick={() => onToggleBookmark(question.id, isBookmarked)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-colors flex-shrink-0 ${
                            isBookmarked
                              ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                              : isDark
                                ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-yellow-900/30 hover:border-yellow-600 hover:text-yellow-400'
                                : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700'
                          }`}
                        >
                          {isBookmarked ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                          <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => {
                          const isUserAnswer = userAnswer === optIdx;
                          const isCorrectAnswer = question.correctAnswer === optIdx;

                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-lg border-2 ${
                                isCorrectAnswer
                                  ? isDark ? 'border-green-500 bg-green-900/30' : 'border-green-500 bg-green-100'
                                  : isUserAnswer
                                    ? isDark ? 'border-red-500 bg-red-900/30' : 'border-red-500 bg-red-100'
                                    : isDark ? 'border-slate-600 bg-[#1E1E1D]' : 'border-gray-200 bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span className={isDark ? 'text-slate-200' : 'text-gray-800'}>
                                  <RichContent content={option} />
                                </span>
                                {isCorrectAnswer && <CheckCircle2 className="text-green-600 ml-auto flex-shrink-0" size={18} />}
                                {isUserAnswer && !isCorrectAnswer && <XCircle className="text-red-600 ml-auto flex-shrink-0" size={18} />}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {explanation ? (
                        <div className={`mt-4 p-3 border-l-4 border-blue-500 rounded ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                          <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                            Explanation:
                          </p>
                          <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                            <RichContent content={explanation} />
                          </p>
                          <button
                            onClick={() => openEditModal(question)}
                            className={`mt-2 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
                              isDark
                                ? 'text-blue-300 hover:bg-blue-800/40 border border-blue-700'
                                : 'text-blue-700 hover:bg-blue-100 border border-blue-300'
                            }`}
                          >
                            <Pencil size={12} />
                            Edit Explanation
                          </button>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <button
                            onClick={() => openEditModal(question)}
                            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
                              isDark
                                ? 'text-slate-400 hover:bg-slate-700 border border-slate-600'
                                : 'text-gray-500 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            <Pencil size={12} />
                            Add Explanation
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit Explanation Modal */}
      {editModal.isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditModal(m => ({ ...m, isOpen: false }))}
          />
          <div
            className={`relative w-full max-w-lg rounded-2xl shadow-2xl p-6 ${
              isDark ? 'bg-[#1E1F23] border border-slate-700' : 'bg-white'
            }`}
            style={{ animation: 'scaleIn 0.2s ease-out' }}
          >
            <button
              onClick={() => setEditModal(m => ({ ...m, isOpen: false }))}
              className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${
                isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Pencil className="text-blue-600" size={18} />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Edit Explanation
                </h3>
                <p className={`text-xs truncate max-w-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  {editModal.questionText.replace(/<[^>]+>/g, '').slice(0, 60)}…
                </p>
              </div>
            </div>
            <textarea
              value={editModal.value}
              onChange={e => setEditModal(m => ({ ...m, value: e.target.value }))}
              rows={5}
              placeholder="Write the explanation here..."
              className={`w-full rounded-xl border px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                isDark
                  ? 'bg-[#16171A] border-slate-600 text-slate-200 placeholder-slate-500'
                  : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'
              }`}
              autoFocus
            />
            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => setEditModal(m => ({ ...m, isOpen: false }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExplanation}
                className="px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
          `}</style>
        </div>
      )}
    </div>
  );
}
