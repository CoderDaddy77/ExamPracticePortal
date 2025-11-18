import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Maximize2, Minimize2, Pause, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Test } from '../types';

interface RealisticTestPageProps {
  test: Test;
  categoryId: string;
  categoryName: string;
  isDark: boolean;
  onBack: () => void;
  onSubmit: (answers: number[], score: number, total: number, durationSeconds?: number, markedForReview?: number[]) => void;
}

type QuestionStatus = 'not-visited' | 'not-answered' | 'answered' | 'marked' | 'marked-answered';

export function RealisticTestPage({ test, categoryId: _categoryId, categoryName, isDark, onBack, onSubmit }: RealisticTestPageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(test.questions.length).fill(null));
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [showInstructions, setShowInstructions] = useState(true);
  const [showQuestionPaper, setShowQuestionPaper] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Timer: Default 30 minutes or 1 minute per question, whichever is higher
  const defaultTimeMinutes = Math.max(30, test.questions.length);
  const [timeRemaining, setTimeRemaining] = useState(defaultTimeMinutes * 60);
  const [timeUp, setTimeUp] = useState(false);

  // Track visited questions
  useEffect(() => {
    setVisited(prev => new Set([...prev, currentQuestion]));
  }, [currentQuestion]);

  // Timer countdown
  useEffect(() => {
    if (showInstructions || showQuestionPaper || timeUp || isPaused) return;

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
  }, [showInstructions, showQuestionPaper, timeUp, isPaused]);

  // Auto-submit when time is up
  useEffect(() => {
    if (timeUp && !showInstructions && !showQuestionPaper) {
      const timer = setTimeout(() => {
        const finalAnswers = answers as number[];
        const score = finalAnswers.filter(
          (answer, idx) => answer === test.questions[idx].correctAnswer
        ).length;
        const durationSeconds = defaultTimeMinutes * 60;
        onSubmit(finalAnswers, score, test.questions.length, durationSeconds, Array.from(markedForReview));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [timeUp, showInstructions, showQuestionPaper, answers, test.questions, onSubmit, markedForReview, defaultTimeMinutes]);

  // Fullscreen handling
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSaveAndNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleMarkForReviewAndNext = () => {
    setMarkedForReview(prev => new Set([...prev, currentQuestion]));
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleClearResponse = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = null;
    setAnswers(newAnswers);
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      newSet.delete(currentQuestion);
      return newSet;
    });
  };

  const handleQuestionClick = (idx: number) => {
    setCurrentQuestion(idx);
    setShowQuestionPaper(false);
  };

  const getQuestionStatus = (idx: number): QuestionStatus => {
    const isMarked = markedForReview.has(idx);
    const isAnswered = answers[idx] !== null;
    
    if (isMarked && isAnswered) return 'marked-answered';
    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    if (visited.has(idx)) return 'not-answered';
    return 'not-visited';
  };

  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case 'not-visited': return isDark ? 'bg-[#212226] text-slate-300' : 'bg-gray-200 text-gray-600';
      case 'not-answered': return 'bg-red-500 text-white';
      case 'answered': return 'bg-green-500 text-white';
      case 'marked': return 'bg-purple-500 text-white';
      case 'marked-answered': return 'bg-purple-500 text-white';
      default: return isDark ? 'bg-[#212226] text-slate-300' : 'bg-gray-200 text-gray-600';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const markedCount = markedForReview.size;
  const notVisitedCount = test.questions.length - visited.size;
  const notAnsweredCount = visited.size - answeredCount;
  const markedAndAnsweredCount = Array.from(markedForReview).filter(idx => answers[idx] !== null).length;

  // Instructions Page
  if (showInstructions) {
    return (
      <div className={`min-h-screen py-8 px-4 ${
        isDark ? 'bg-[#18191D]' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className={`rounded-xl shadow-lg p-8 ${
            isDark ? 'bg-[#212226] border border-slate-700' : 'bg-white'
          }`}>
            <h1 className={`text-3xl font-bold mb-6 ${
              isDark ? 'text-slate-100' : 'text-gray-800'
            }`}>
              General Instructions
            </h1>
            
            <div className={`space-y-6 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              <div>
                <h2 className={`text-xl font-bold mb-3 ${
                  isDark ? 'text-slate-100' : 'text-gray-800'
                }`}>1. Timer</h2>
                <p>The exam clock is set at the top-right corner. A countdown timer will show the remaining time. The exam will automatically end when the timer reaches zero. You do not need to manually terminate or submit the exam.</p>
              </div>

              <div>
                <h2 className={`text-xl font-bold mb-3 ${
                  isDark ? 'text-slate-100' : 'text-gray-800'
                }`}>2. Question Palette</h2>
                <p>The Question Palette on the right side of the screen shows the status of each question:</p>
                <ul className="list-disc list-inside space-y-2 mt-2 ml-4">
                  <li><span className="inline-block w-4 h-4 bg-gray-200 rounded mr-2"></span> <strong>Gray:</strong> You have not visited the question yet.</li>
                  <li><span className="inline-block w-4 h-4 bg-red-500 rounded mr-2"></span> <strong>Red:</strong> You have not answered the question.</li>
                  <li><span className="inline-block w-4 h-4 bg-green-500 rounded mr-2"></span> <strong>Green:</strong> You have answered the question.</li>
                  <li><span className="inline-block w-4 h-4 bg-purple-500 rounded mr-2"></span> <strong>Purple:</strong> You have marked the question for review (not answered).</li>
                  <li><span className="inline-block w-4 h-4 bg-purple-500 rounded mr-2 relative">
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    </span>
                  </span> <strong>Purple with Green dot:</strong> You have answered and marked for review.</li>
                </ul>
                <p className="mt-3">Mark For Review indicates that you want to revisit the question. If a question is answered and marked for review, the answer will be considered for evaluation unless modified.</p>
              </div>

              <div>
                <h2 className={`text-xl font-bold mb-3 ${
                  isDark ? 'text-slate-100' : 'text-gray-800'
                }`}>3. Navigating to a Question</h2>
                <p>To navigate between questions, you can:</p>
                <ul className="list-disc list-inside space-y-2 mt-2 ml-4">
                  <li>Click on a question number in the Question Palette (this does NOT save your current answer).</li>
                  <li>Click <strong>"Save & Next"</strong> to save your current answer and move to the next question.</li>
                  <li>Click <strong>"Mark for Review & Next"</strong> to save your answer, mark it for review, and move to the next question.</li>
                </ul>
                <p className="mt-3 text-red-600 font-semibold">⚠️ Note: Your answer will NOT be saved if you navigate directly without using "Save & Next" or "Mark for Review & Next".</p>
              </div>

              <div>
                <h2 className={`text-xl font-bold mb-3 ${
                  isDark ? 'text-slate-100' : 'text-gray-800'
                }`}>4. Answering Questions</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Click on the option you want to select as your answer.</li>
                  <li>Use <strong>"Clear Response"</strong> to remove your selected answer.</li>
                  <li>You can change your answer anytime before submitting the test.</li>
                </ul>
              </div>

              <div>
                <h2 className={`text-xl font-bold mb-3 ${
                  isDark ? 'text-slate-100' : 'text-gray-800'
                }`}>5. Question Paper</h2>
                <p className="text-red-600 font-semibold">You can view all questions at once by clicking the "Question Paper" button. This feature allows you to see the entire question paper at a glance.</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowInstructions(false)}
                className={`px-8 py-3 rounded-lg transition-colors font-semibold ${
                  isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Question Paper View
  if (showQuestionPaper) {
    return (
      <div className={`min-h-screen py-8 px-4 ${
        isDark ? 'bg-[#18191D]' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className={`rounded-xl shadow-lg p-8 ${
            isDark ? 'bg-[#212226] border border-slate-700' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h1 className={`text-3xl font-bold ${
                isDark ? 'text-slate-100' : 'text-gray-800'
              }`}>
                Question Paper
              </h1>
              <button
                onClick={() => setShowQuestionPaper(false)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                Back to Test
              </button>
            </div>
            <div className="space-y-8">
              {test.questions.map((question, idx) => (
                <div key={idx} className={`pb-6 border-b-2 ${
                  isDark ? 'border-slate-600' : 'border-gray-200'
                }`}>
                  <div className="flex items-start gap-4 mb-4">
                    <span className={`font-bold text-lg ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}>Q{idx + 1}.</span>
                    <p className={`font-medium flex-1 ${
                      isDark ? 'text-slate-200' : 'text-gray-800'
                    }`}>{question.question}</p>
                  </div>
                  <div className="ml-8 space-y-2">
                    {question.options.map((option, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-3">
                        <span className={`font-semibold w-6 ${
                          isDark ? 'text-slate-400' : 'text-gray-600'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className={`${
                          answers[idx] === optIdx 
                            ? 'text-blue-600 font-semibold' 
                            : isDark 
                              ? 'text-slate-300' 
                              : 'text-gray-700'
                        }`}>
                          {option}
                        </span>
                        {answers[idx] === optIdx && (
                          <CheckCircle2 className={isDark ? 'text-blue-400' : 'text-blue-600'} size={18} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Time's Up Screen
  if (timeUp) {
    return (
      <div className={`min-h-screen py-8 px-4 flex items-center justify-center ${
        isDark ? 'bg-[#18191D]' : 'bg-gradient-to-br from-red-50 to-orange-50'
      }`}>
        <div className={`max-w-2xl mx-auto rounded-xl shadow-lg p-8 text-center ${
          isDark ? 'bg-[#212226] border border-slate-700' : 'bg-white'
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

  const question = test.questions[currentQuestion];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#18191D]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`shadow-md border-b ${
        isDark ? 'bg-[#212226] border-slate-700' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-colors ${
                  isDark
                    ? 'border-slate-700 bg-[#212226] text-slate-200 hover:bg-slate-700/80'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Go to Tests</span>
              </button>
              <div className={`hidden md:block font-semibold ${
                isDark ? 'text-slate-200' : 'text-gray-800'
              }`}>
                {categoryName} - {test.name}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                }`}>
                <Clock size={18} />
                <span className={`font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>Time Left: {formatTime(timeRemaining)}</span>
              </div>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDark ? 'bg-[#212226] hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
              </button>
              <button
                onClick={toggleFullscreen}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDark ? 'bg-[#212226] hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content Area (70%) */}
        <div className={`flex-1 overflow-y-auto ${isDark ? 'bg-[#212226]' : 'bg-white'}`}>
          <div className="max-w-4xl mx-auto p-6">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${
                  isDark ? 'text-slate-100' : 'text-gray-800'
                }`}>
                  Question No. {currentQuestion + 1}
                </h2>
                <div className={`flex items-center gap-4 mt-2 text-sm ${
                  isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  <span>Marks: <span className="text-green-500 font-semibold">+5</span> <span className="text-red-500">-1</span></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select className={`px-3 py-2 border rounded-lg text-sm ${
                  isDark ? 'bg-[#212226] border-slate-600 text-slate-200' : 'bg-white border-gray-300 text-gray-700'
                }`}>
                  <option>English</option>
                </select>
                <button
                  className={`px-3 py-2 border rounded-lg text-sm transition-colors ${
                    isDark ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <AlertCircle size={16} />
                </button>
              </div>
            </div>

            {/* Question */}
            <div className={`rounded-lg p-6 mb-6 ${
              isDark ? 'bg-[#212226]' : 'bg-gray-50'
            }`}>
              <p className={`text-lg leading-relaxed ${
                isDark ? 'text-slate-200' : 'text-gray-800'
              }`}>
                {question.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    answers[currentQuestion] === idx
                      ? isDark
                        ? 'border-blue-500 bg-blue-900/30'
                        : 'border-blue-600 bg-blue-50'
                      : isDark
                      ? 'border-slate-600 hover:border-blue-500 bg-[#212226]'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                        answers[currentQuestion] === idx
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : isDark
                          ? 'border-slate-500 text-slate-300'
                          : 'border-gray-300 text-gray-600'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={`flex-1 ${
                      isDark ? 'text-slate-200' : 'text-gray-800'
                    }`}>
                      {option}
                    </span>
                    {answers[currentQuestion] === idx && (
                      <CheckCircle2 className={isDark ? 'text-blue-400' : 'text-blue-600'} size={20} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleClearResponse}
                className={`px-6 py-3 rounded-lg transition-colors font-semibold ${
                  isDark ? 'bg-[#212226] text-slate-200 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Clear Response
              </button>
              <div className="flex gap-3">
                {currentQuestion > 0 && (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                    className={`px-6 py-3 rounded-lg transition-colors font-semibold ${
                      isDark ? 'bg-[#212226] text-slate-200 hover:bg-slate-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                )}
                {currentQuestion < test.questions.length - 1 ? (
                  <>
                    <button
                      onClick={handleMarkForReviewAndNext}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                      Mark for Review & Next
                    </button>
                    <button
                      onClick={handleSaveAndNext}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Save & Next
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      const finalAnswers = answers as number[];
                      const score = finalAnswers.filter(
                        (answer, idx) => answer === test.questions[idx].correctAnswer
                      ).length;
                      const durationSeconds = defaultTimeMinutes * 60 - timeRemaining;
                      onSubmit(finalAnswers, score, test.questions.length, durationSeconds, Array.from(markedForReview));
                    }}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
                  >
                    <CheckCircle2 size={20} />
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (30%) */}
        <div className={`w-80 border-l overflow-y-auto ${
          isDark ? 'bg-[#212226] border-slate-600' : 'bg-gray-50'
        }`}>
          <div className="p-4">
            {/* User Info */}
            <div className={`rounded-lg p-4 mb-4 text-center ${
              isDark ? 'bg-[#212226]' : 'bg-white'
            }`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
                isDark ? 'bg-[#212226]' : 'bg-blue-100'
              }`}>
                <span className="text-2xl">👤</span>
              </div>
              <p className={`font-semibold ${
                isDark ? 'text-slate-200' : 'text-gray-800'
              }`}>
                User
              </p>
            </div>

            {/* Status Summary */}
            <div className={`rounded-lg p-4 mb-4 ${
              isDark ? 'bg-[#212226]' : 'bg-white'
            }`}>
              <h3 className={`font-semibold mb-3 ${
                isDark ? 'text-slate-200' : 'text-gray-700'
              }`}>
                Question Status
              </h3>
              <div className={`space-y-2 text-sm ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <span className={`font-semibold ${
                    isDark ? 'text-slate-200' : 'text-gray-800'
                  }`}>{answeredCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span>Marked</span>
                  </div>
                  <span className={`font-semibold ${
                    isDark ? 'text-slate-200' : 'text-gray-800'
                  }`}>{markedCount - markedAndAnsweredCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span>Not Visited</span>
                  </div>
                  <span className={`font-semibold ${
                    isDark ? 'text-slate-200' : 'text-gray-800'
                  }`}>{notVisitedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    <div className="w-4 h-4 bg-purple-500 rounded relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <span>Marked & Answered</span>
                  </div>
                  <span className={`font-semibold ${
                    isDark ? 'text-slate-200' : 'text-gray-800'
                  }`}>{markedAndAnsweredCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Not Answered</span>
                  </div>
                  <span className={`font-semibold ${
                    isDark ? 'text-slate-200' : 'text-gray-800'
                  }`}>{notAnsweredCount}</span>
                </div>
              </div>
            </div>

            {/* Question Palette */}
            <div className={`rounded-lg p-4 mb-4 ${
              isDark ? 'bg-[#212226]' : 'bg-white'
            }`}>
              <h3 className={`font-semibold mb-3 ${
                isDark ? 'text-slate-200' : 'text-gray-700'
              }`}>
                SECTION: Test
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {test.questions.map((_, idx) => {
                  const status = getQuestionStatus(idx);
                  const isCurrent = idx === currentQuestion;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuestionClick(idx)}
                      className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                        isCurrent
                          ? isDark 
                            ? 'ring-2 ring-blue-400 ring-offset-slate-800' 
                            : 'ring-2 ring-blue-500 ring-offset-2'
                          : ''
                      } ${getStatusColor(status)}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setShowQuestionPaper(true)}
                className={`w-full px-4 py-2 rounded-lg transition-colors font-semibold text-sm ${
                  isDark ? 'bg-[#212226] text-blue-400 hover:bg-slate-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Question Paper
              </button>
              <button
                onClick={() => setShowInstructions(true)}
                className={`w-full px-4 py-2 rounded-lg transition-colors font-semibold text-sm ${
                  isDark ? 'bg-[#212226] text-blue-400 hover:bg-slate-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Instructions
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to submit the test?')) {
                    const finalAnswers = answers as number[];
                    const score = finalAnswers.filter(
                      (answer, idx) => answer === test.questions[idx].correctAnswer
                    ).length;
                    const durationSeconds = defaultTimeMinutes * 60 - timeRemaining;
                    onSubmit(finalAnswers, score, test.questions.length, durationSeconds, Array.from(markedForReview));
                  }
                }}
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

