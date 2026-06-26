import { useState } from 'react';
import { ArrowLeft, Award, CheckCircle2, XCircle, Home, Bookmark, BookmarkCheck, Download, RefreshCcw, Eye, EyeOff, Pencil, X } from 'lucide-react';
import type { Test, Question, BookmarkedQuestion, TestPerformanceStats } from '../types';
import { evaluateTestPerformance } from '../utils/scoring';
import { generateTestPdf } from '../utils/generateTestPdf';
import { RichContent } from './RichContent';
import { MatchingQuestionDisplay } from './MatchingQuestionDisplay';

interface ResultsPageProps {
  test: Test;
  categoryName: string;
  categoryId: string;
  answers: (number | null)[];
  score: number;
  total: number;
  bookmarks: BookmarkedQuestion[];
  isDark: boolean;
  onBack: () => void;
  onHome: () => void;
  onToggleBookmark: (questionId: string, isBookmarked: boolean) => void;
  onRetryWrong?: (wrongQuestions: Question[]) => void;
  onSaveExplanation?: (questionId: string, explanation: string) => void;
  performance?: TestPerformanceStats;
}

export function ResultsPage({
  test,
  categoryName,
  categoryId,
  answers,
  score,
  total,
  bookmarks,
  isDark,
  onBack,
  onHome,
  onToggleBookmark,
  onRetryWrong,
  onSaveExplanation,
  performance
}: ResultsPageProps) {
  const stats = performance ?? evaluateTestPerformance(answers, test.questions);
  const correct = stats.correct;
  const incorrect = stats.incorrect;
  const unattempted = stats.unattempted;
  const marksSummary = `${stats.marks} / ${stats.totalMarks}`;
  const percentage = total > 0 ? ((correct / total) * 100).toFixed(1) : '0.0';


  // Show only wrong toggle
  const [showOnlyWrong, setShowOnlyWrong] = useState(false);

  // Edit explanation modal state
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    questionId: string;
    questionText: string;
    value: string;
  }>({ isOpen: false, questionId: '', questionText: '', value: '' });

  // Local overrides for explanations (so edits show immediately without page reload)
  const [explanationOverrides, setExplanationOverrides] = useState<Record<string, string>>({});

  // Build wrong question list for retry
  const wrongQuestions: Question[] = test.questions.filter(
    (q, idx) => answers[idx] !== null && answers[idx] !== q.correctAnswer
  );
  const hasWrongQuestions = wrongQuestions.length > 0;

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

  // Filter questions based on toggle
  const displayedQuestions = showOnlyWrong
    ? test.questions.filter((q, idx) => answers[idx] !== null && answers[idx] !== q.correctAnswer)
    : test.questions;

  return (
    <div className={`h-[calc(100vh-52px)] overflow-y-auto py-8 px-4 ${isDark ? 'bg-[#1F1F1E] dark-scrollbar' : 'bg-[#F6F8F9] realistic-scrollbar'}`}>
      <div className="max-w-5xl mx-auto">

        <div className={`rounded-xl shadow-lg p-8 mb-6 ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'}`}>
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
              <Award className="text-blue-600" size={48} />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
              Test Completed!
            </h1>
            <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>{test.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-green-50 rounded-lg p-6 text-center border-2 border-green-200">
              <CheckCircle2 className="text-green-600 mx-auto mb-2" size={32} />
              <div className="text-3xl font-bold text-green-600 mb-1">{correct}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>

            <div className="bg-red-50 rounded-lg p-6 text-center border-2 border-red-200">
              <XCircle className="text-red-600 mx-auto mb-2" size={32} />
              <div className="text-3xl font-bold text-red-600 mb-1">{incorrect}</div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>

            <div className="bg-amber-50 rounded-lg p-6 text-center border-2 border-amber-200">
              <Award className="text-amber-600 mx-auto mb-2" size={32} />
              <div className="text-2xl font-bold text-amber-600 mb-1">{marksSummary}</div>
              <div className="text-sm text-gray-600">Marks (out of total)</div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 text-center border-2 border-blue-200">
              <Award className="text-blue-600 mx-auto mb-2" size={32} />
              <div className="text-3xl font-bold text-blue-600 mb-1">{percentage}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-6 text-sm">
            <span className="px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-700">
              Attempted: {correct + incorrect} / {total}
            </span>
            <span className="px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-700">
              Unattempted: {unattempted}
            </span>
            <span className="px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-700">
              Negative marks applied: -{incorrect}
            </span>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={onHome}
              className="flex-1 min-w-[140px] px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Go to Home
            </button>
            <button
              onClick={() => generateTestPdf(test, { testName: test.name, categoryName })}
              className="flex-1 min-w-[140px] px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Download PDF
            </button>
            {hasWrongQuestions && onRetryWrong && (
              <button
                onClick={() => onRetryWrong(wrongQuestions)}
                className="flex-1 min-w-[140px] px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCcw size={20} />
                Retry Wrong ({incorrect})
              </button>
            )}
            {hasWrongQuestions && (
              <button
                onClick={() => setShowOnlyWrong(prev => !prev)}
                className={`flex-1 min-w-[140px] px-6 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${
                  showOnlyWrong
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : isDark
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                {showOnlyWrong ? <EyeOff size={20} /> : <Eye size={20} />}
                {showOnlyWrong ? 'Show All' : 'Show Only Wrong'}
              </button>
            )}
          </div>
        </div>

        <div className={`rounded-xl shadow-lg p-8 ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
              Answer Review
            </h2>
            {showOnlyWrong && (
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700 border border-red-200">
                Showing {wrongQuestions.length} wrong answer{wrongQuestions.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="space-y-6">
            {displayedQuestions.map((question: Question, displayIdx: number) => {
              const originalIdx = test.questions.findIndex(q => q.id === question.id);
              const userAnswer = answers[originalIdx];
              const isCorrect = userAnswer === question.correctAnswer;
              const bookmarkId = `${categoryId}-${test.id}-${question.id}`;
              const isBookmarked = bookmarks.some((b) => b.id === bookmarkId);
              const explanation = explanationOverrides[question.id] ?? question.explanation;

              return (
                <div
                  key={question.id}
                  className={`border-2 rounded-lg p-6 ${isCorrect
                    ? isDark
                      ? 'border-green-700 bg-green-900/20'
                      : 'border-green-200 bg-green-50'
                    : isDark
                      ? 'border-red-700 bg-red-900/20'
                      : 'border-red-200 bg-red-50'
                    }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                    >
                      {originalIdx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <MatchingQuestionDisplay
                            questionText={question.question}
                            isDark={isDark}
                            className={`font-medium flex-1 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}
                          />
                        <button
                          type="button"
                          onClick={() => onToggleBookmark(question.id, isBookmarked)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${{
                            true: 'bg-yellow-100 border-yellow-300 text-yellow-800',
                            false: 'bg-gray-100 border-gray-200 text-gray-600'
                          }[String(isBookmarked) as 'true' | 'false']}`}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck size={14} />
                          ) : (
                            <Bookmark size={14} />
                          )}
                          <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {question.options.map((option: string, optIdx: number) => {
                          const isUserAnswer = userAnswer === optIdx;
                          const isCorrectAnswer = question.correctAnswer === optIdx;

                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-lg border-2 ${isCorrectAnswer
                                ? isDark
                                  ? 'border-green-500 bg-green-900/30'
                                  : 'border-green-500 bg-green-100'
                                : isUserAnswer
                                  ? isDark
                                    ? 'border-red-500 bg-red-900/30'
                                    : 'border-red-500 bg-red-100'
                                  : isDark
                                    ? 'border-slate-600 bg-[#1E1E1D]'
                                    : 'border-gray-200 bg-white'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span className={isDark ? 'text-slate-200' : 'text-gray-800'}>
                                  <RichContent content={option} />
                                </span>
                                {isCorrectAnswer && (
                                  <CheckCircle2 className="text-green-600 ml-auto" size={20} />
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <XCircle className="text-red-600 ml-auto" size={20} />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
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
                        <div className={`mt-4`}>
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
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditModal(m => ({ ...m, isOpen: false }))}
          />

          {/* Modal Panel */}
          <div
            className={`relative w-full max-w-lg rounded-2xl shadow-2xl p-6 ${
              isDark ? 'bg-[#1E1F23] border border-slate-700' : 'bg-white'
            }`}
            style={{ animation: 'scaleIn 0.2s ease-out' }}
          >
            {/* Close */}
            <button
              onClick={() => setEditModal(m => ({ ...m, isOpen: false }))}
              className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${
                isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              <X size={20} />
            </button>

            {/* Header */}
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

            {/* Textarea */}
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

            {/* Actions */}
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
