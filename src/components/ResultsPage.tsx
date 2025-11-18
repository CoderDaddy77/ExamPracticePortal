import { ArrowLeft, Award, CheckCircle2, XCircle, Home, Bookmark, BookmarkCheck } from 'lucide-react';
import type { Test, Question, BookmarkedQuestion } from '../types';

interface ResultsPageProps {
  test: Test;
  categoryName: string;
  categoryId: string;
  answers: number[];
  score: number;
  total: number;
  bookmarks: BookmarkedQuestion[];
  isDark: boolean;
  onBack: () => void;
  onHome: () => void;
  onToggleBookmark: (questionId: string, isBookmarked: boolean) => void;
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
  onToggleBookmark
}: ResultsPageProps) {
  const percentage = ((score / total) * 100).toFixed(1);
  const incorrect = total - score;

  return (
    <div className={`min-h-screen py-8 px-4 ${
      isDark ? 'bg-[#18191D]' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
    }`}>
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 mb-6 px-4 py-2 text-sm rounded-lg border transition-colors ${
            isDark
              ? 'border-slate-700 bg-[#212226] text-slate-200 hover:bg-slate-700/80'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ArrowLeft size={20} />
          Back to {categoryName}
        </button>

        <div className={`rounded-xl shadow-lg p-8 mb-6 ${
          isDark ? 'bg-[#212226] border border-slate-700' : 'bg-white'
        }`}>
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
              <Award className="text-blue-600" size={48} />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-slate-100' : 'text-gray-800'
            }`}>
              Test Completed!
            </h1>
            <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>{test.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 rounded-lg p-6 text-center border-2 border-green-200">
              <CheckCircle2 className="text-green-600 mx-auto mb-2" size={32} />
              <div className="text-3xl font-bold text-green-600 mb-1">{score}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>

            <div className="bg-red-50 rounded-lg p-6 text-center border-2 border-red-200">
              <XCircle className="text-red-600 mx-auto mb-2" size={32} />
              <div className="text-3xl font-bold text-red-600 mb-1">{incorrect}</div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 text-center border-2 border-blue-200">
              <Award className="text-blue-600 mx-auto mb-2" size={32} />
              <div className="text-3xl font-bold text-blue-600 mb-1">{percentage}%</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onHome}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Go to Home
            </button>
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              More Tests
            </button>
          </div>
        </div>

        <div className={`rounded-xl shadow-lg p-8 ${
          isDark ? 'bg-[#212226] border border-slate-700' : 'bg-white'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-slate-100' : 'text-gray-800'
          }`}>
            Answer Review
          </h2>

          <div className="space-y-6">
            {test.questions.map((question: Question, idx: number) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === question.correctAnswer;
              const bookmarkId = `${categoryId}-${test.id}-${question.id}`;
              const isBookmarked = bookmarks.some((b) => b.id === bookmarkId);

              return (
                <div
                  key={idx}
                  className={`border-2 rounded-lg p-6 ${
                    isCorrect
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                        isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <p className={`font-medium flex-1 ${
                          isDark ? 'text-slate-200' : 'text-gray-800'
                        }`}>
                          {question.question}
                        </p>
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
                              className={`p-3 rounded-lg border-2 ${
                                isCorrectAnswer
                                  ? isDark
                                    ? 'border-green-500 bg-green-900/30'
                                    : 'border-green-500 bg-green-100'
                                  : isUserAnswer
                                  ? isDark
                                    ? 'border-red-500 bg-red-900/30'
                                    : 'border-red-500 bg-red-100'
                                  : isDark
                                  ? 'border-slate-600 bg-[#212226]'
                                  : 'border-gray-200 bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`font-semibold ${
                                  isDark ? 'text-slate-300' : 'text-gray-700'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span className={isDark ? 'text-slate-200' : 'text-gray-800'}>
                                  {option}
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
                      {question.explanation && (
                        <div className={`mt-4 p-3 border-l-4 border-blue-500 rounded ${
                          isDark ? 'bg-blue-900/20' : 'bg-blue-50'
                        }`}>
                          <p className={`text-sm font-semibold mb-1 ${
                            isDark ? 'text-blue-300' : 'text-blue-800'
                          }`}>
                            Explanation:
                          </p>
                          <p className={`text-sm ${
                            isDark ? 'text-blue-200' : 'text-blue-700'
                          }`}>
                            {question.explanation}
                          </p>
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
    </div>
  );
}
