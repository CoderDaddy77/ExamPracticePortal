import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Clock, LayoutGrid, X } from 'lucide-react';
import type { Test, TestPerformanceStats } from '../types';
import { evaluateTestPerformance } from '../utils/scoring';
import { RichContent } from './RichContent';
import { MatchingQuestionDisplay } from './MatchingQuestionDisplay';

interface TestPageProps {
  test: Test;
  categoryId: string;
  categoryName: string;
  isDark: boolean;
  onBack: () => void;
  onSubmit: (
    answers: (number | null)[],
    score: number,
    total: number,
    durationSeconds?: number,
    performance?: TestPerformanceStats
  ) => void;
}

export function TestPage({ test, categoryId: _categoryId, categoryName, isDark, onBack, onSubmit }: TestPageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(test.questions.length).fill(null));
  const [showReview, setShowReview] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Timer: Default 30 minutes or 1 minute per question unless overridden per test
  const timeLimitMinutes = test.timeLimitMinutes ?? Math.max(30, test.questions.length);
  const totalTimeSeconds = timeLimitMinutes * 60;
  const [timeRemaining, setTimeRemaining] = useState(totalTimeSeconds); // in seconds
  const [timeUp, setTimeUp] = useState(false);

  const handleExitTest = () => {
    const answeredCount = answers.filter(a => a !== null).length;
    if (answeredCount > 0) {
      const confirmExit = window.confirm(
        `You have answered ${answeredCount} out of ${test.questions.length} questions. Are you sure you want to exit? Your progress will be lost.`
      );
      if (!confirmExit) return;
    }
    onBack();
  };

  // Timer countdown
  useEffect(() => {
    if (showReview || timeUp) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showReview, timeUp]);

  // Auto-submit when time is up
  useEffect(() => {
    if (timeUp && !showReview) {
      // Small delay to show the "Time's Up" message
      const timer = setTimeout(() => {
        const performance = evaluateTestPerformance(answers, test.questions);
        onSubmit(answers, performance.correct, test.questions.length, totalTimeSeconds, performance);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [timeUp, showReview, answers, test.questions, onSubmit, totalTimeSeconds]);

  // Warn user if they try to leave during test (page refresh / tab close)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Push a single dummy history state ONCE on mount so the back button
  // can be intercepted. Must be separate from the listener effect so
  // it doesn't re-fire (and stack up dummy states) on every answer change.
  useEffect(() => {
    window.history.pushState({ testActive: true }, '');
  }, []); // ← empty deps: only runs once

  // Block browser back button during test
  useEffect(() => {
    const handlePopState = () => {
      const answeredCount = answers.filter(a => a !== null).length;
      const msg =
        answeredCount > 0
          ? `You have answered ${answeredCount} out of ${test.questions.length} questions. Are you sure you want to exit? Your progress will be lost.`
          : 'Are you sure you want to exit the test? Your progress will be lost.';

      if (window.confirm(msg)) {
        // Remove listener FIRST before navigating away
        window.removeEventListener('popstate', handlePopState);
        onBack();
      } else {
        // Re-push the dummy state so the back button is blocked again
        window.history.pushState({ testActive: true }, '');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [answers, test.questions.length, onBack]);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitTest = () => {
    setShowReview(true);
  };

  const handleFinalSubmit = () => {
    const performance = evaluateTestPerformance(answers, test.questions);
    const durationSeconds = totalTimeSeconds - timeRemaining;
    onSubmit(answers, performance.correct, test.questions.length, durationSeconds, performance);
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const progress = (answeredCount / test.questions.length) * 100;

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeLow = timeRemaining <= 300; // Less than 5 minutes

  if (timeUp && !showReview) {
    return (
      <div className={`min-h-screen py-8 px-4 flex items-center justify-center ${isDark ? 'bg-[#1F1F1E]' : 'bg-gradient-to-br from-red-50 to-orange-50'
        }`}>
        <div className={`max-w-2xl mx-auto rounded-xl shadow-lg p-8 text-center ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'
          }`}>
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-3xl font-bold text-red-500 mb-4">Time's Up!</h2>
          <p className={isDark ? 'text-slate-300' : 'text-gray-700'}>
            Your test has been automatically submitted.
          </p>
          <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Redirecting to results...</p>
        </div>
      </div>
    );
  }

  if (showReview) {
    return (
      <div className={`min-h-screen py-8 px-4 ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'
        }`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-xl shadow-lg p-8 ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'
            }`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-slate-100' : 'text-gray-800'
              }`}>
              Review Your Answers
            </h2>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-8">
              {test.questions.map((_: unknown, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setShowReview(false);
                    setCurrentQuestion(idx);
                  }}
                  className={`w-12 h-12 rounded-lg font-semibold transition-colors ${answers[idx] !== null
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className={`rounded-lg p-6 mb-6 ${isDark ? 'bg-[#1E1E1D]' : 'bg-blue-50'
              }`}>
              <div className="flex justify-between items-center mb-2">
                <span className={isDark ? 'text-slate-200' : 'text-gray-700'}>Questions Answered:</span>
                <span className="font-bold text-blue-500">{answeredCount} / {test.questions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDark ? 'text-slate-200' : 'text-gray-700'}>Questions Skipped:</span>
                <span className="font-bold text-orange-500">{test.questions.length - answeredCount}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowReview(false)}
                className={`flex-1 px-6 py-3 rounded-lg transition-colors font-semibold ${isDark
                  ? 'bg-[#1E1E1D] text-slate-200 hover:bg-slate-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Continue Test
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = test.questions[currentQuestion];

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'}`}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      onMouseUp={() => { if (window.getSelection()?.toString()) window.getSelection()?.removeAllRanges(); }}
    >
      <div className={`shadow-md ${isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white'}`}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleExitTest}
              className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${isDark
                ? 'border-slate-700 bg-[#1E1E1D] text-slate-200 hover:bg-slate-700/80'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Exit Test</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMobileNav(true)}
                className={`lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${isDark
                  ? 'border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <LayoutGrid size={14} />
                <span>{answeredCount}/{test.questions.length}</span>
              </button>
              <span className={`hidden sm:block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{categoryName}</span>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm ${timeUp
                ? 'bg-red-600 text-white'
                : isTimeLow
                  ? 'bg-orange-500 text-white animate-pulse'
                  : 'bg-blue-600 text-white'
                }`}>
                <Clock size={16} />
                <span>{timeUp ? 'Time Up!' : formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>

          <div className="mb-1">
            <div className={`flex justify-between text-sm mb-1.5 ${isDark ? 'text-slate-400' : 'text-gray-600'
              }`}>
              <span>Question {currentQuestion + 1} of {test.questions.length}</span>
              <span>{answeredCount} Answered</span>
            </div>
            <div className={`w-full rounded-full h-2 ${isDark ? 'bg-[#1E1E1D]' : 'bg-gray-200'
              }`}>
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Question card */}
          <div className="flex-1 min-w-0">
            <div className={`rounded-xl shadow-lg p-4 sm:p-6 mb-5 ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'
              }`}>
              <div className="mb-6">
                <div className={`text-base sm:text-xl font-semibold mb-5 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                  <MatchingQuestionDisplay
                    questionText={question.question}
                    isDark={isDark}
                  />
                </div>

                <div className="space-y-3">
                  {question.options.map((option: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all select-none ${answers[currentQuestion] === idx
                        ? isDark
                          ? 'border-blue-500 bg-blue-900/30'
                          : 'border-blue-600 bg-blue-50'
                        : isDark
                          ? 'border-slate-700 hover:border-blue-500 bg-[#1E1E1D]'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm flex-shrink-0 ${answers[currentQuestion] === idx
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : isDark
                              ? 'border-slate-500 text-slate-300'
                              : 'border-gray-300 text-gray-600'
                            }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`text-sm sm:text-base ${isDark ? 'text-slate-200' : 'text-gray-800'}`}><RichContent content={option} /></span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>



            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-4 sm:px-6 py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Previous
              </button>

              {currentQuestion === test.questions.length - 1 ? (
                <button
                  onClick={handleSubmitTest}
                  className="flex-1 px-4 sm:px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={20} />
                  Review & Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Next
                </button>
              )}
            </div>
          </div>

          {/* Desktop sidebar navigator */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className={`rounded-lg shadow p-4 sticky top-4 max-h-[420px] overflow-y-auto ${isDark ? 'bg-[#1E1E1D] border border-slate-700 dark-scrollbar' : 'bg-white realistic-scrollbar'
              }`}>
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-gray-700'
                }`}>
                Question Navigator
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {test.questions.map((_: unknown, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${idx === currentQuestion
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : answers[idx] !== null
                        ? 'bg-green-500 text-white'
                        : isDark
                          ? 'bg-[#2e2e2e] text-[#9ca3af] hover:bg-[#4b4b4b]'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigator Drawer */}
      {showMobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileNav(false)} />
          <div className={`absolute right-0 top-0 bottom-0 w-72 flex flex-col shadow-2xl ${isDark ? 'bg-[#1E1E1D]' : 'bg-white'}`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b flex-shrink-0 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <h3 className={`font-semibold text-sm ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>Question Navigator</h3>
              <button onClick={() => setShowMobileNav(false)} className={`p-1.5 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 realistic-scrollbar">
              <div className={`flex flex-wrap gap-3 text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Current</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Answered</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {test.questions.map((_: unknown, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentQuestion(idx);
                      setShowMobileNav(false);
                    }}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${idx === currentQuestion
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : answers[idx] !== null
                        ? 'bg-green-500 text-white'
                        : isDark
                          ? 'bg-[#2e2e2e] text-[#9ca3af] hover:bg-[#4b4b4b]'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className={`px-4 py-3 border-t text-xs flex-shrink-0 ${isDark ? 'border-slate-700 text-slate-400' : 'border-gray-200 text-gray-500'}`}>
              {answeredCount} of {test.questions.length} answered
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
