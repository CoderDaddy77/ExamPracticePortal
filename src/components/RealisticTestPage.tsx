import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Maximize2, Minimize2, Pause, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Test, TestPerformanceStats } from '../types';
import { evaluateTestPerformance } from '../utils/scoring';
import { ModalAlert } from './ModalAlert';
import { RichContent } from './RichContent';
import { MatchingQuestionDisplay } from './MatchingQuestionDisplay';

interface RealisticTestPageProps {
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
    performance?: TestPerformanceStats,
    markedForReview?: number[]
  ) => void;
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
  const [tempAnswer, setTempAnswer] = useState<number | null>(null); // Temp answer before Save & Next
  const [questionTime, setQuestionTime] = useState(0); // Time spent on current question in seconds

  // Timer: Default 30 minutes or 1 minute per question unless overridden per test
  const timeLimitMinutes = test.timeLimitMinutes ?? Math.max(30, test.questions.length);
  const totalTimeSeconds = timeLimitMinutes * 60;
  const [timeRemaining, setTimeRemaining] = useState(totalTimeSeconds);
  const [timeUp, setTimeUp] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Track visited questions and reset temp answer
  useEffect(() => {
    setVisited(prev => new Set([...prev, currentQuestion]));
    // Load existing answer as temp if it exists, otherwise reset
    setTempAnswer(answers[currentQuestion] ?? null);
    // Reset question time when changing question
    setQuestionTime(0);
  }, [currentQuestion]);

  // Question time counter
  useEffect(() => {
    if (showInstructions || showQuestionPaper || timeUp || isPaused) return;
    const interval = setInterval(() => {
      setQuestionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [showInstructions, showQuestionPaper, timeUp, isPaused, currentQuestion]);

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
        const performance = evaluateTestPerformance(answers, test.questions);
        onSubmit(answers, performance.correct, test.questions.length, totalTimeSeconds, performance, Array.from(markedForReview));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [timeUp, showInstructions, showQuestionPaper, answers, test.questions, onSubmit, markedForReview, totalTimeSeconds]);

  // Warn user if they try to refresh/close tab during test
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
      return e.returnValue;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Push a single dummy history state ONCE on mount
  useEffect(() => {
    window.history.pushState({ testActive: true }, '');
  }, []);

  // Block browser back button during test
  useEffect(() => {
    const handlePopState = () => {
      const answeredCount = answers.filter(a => a !== null).length;
      const msg =
        answeredCount > 0
          ? `You have answered ${answeredCount} out of ${test.questions.length} questions. Are you sure you want to exit? Your progress will be lost.`
          : 'Are you sure you want to exit the test? Your progress will be lost.';

      if (window.confirm(msg)) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
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

  // Inject scrollbar override into <head> for the entire lifetime of this component
  useEffect(() => {
    const style = document.createElement('style');
    style.setAttribute('data-realistic-scrollbar', '1');
    style.textContent = `
      .realistic-scrollbar { scrollbar-width: thin !important; }
      .realistic-scrollbar::-webkit-scrollbar { width: 8px !important; height: 8px !important; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // ── Block wheel/touch scroll on the entire test container (non-passive, the only way that works in React) ──
  const outerRef          = useRef<HTMLDivElement>(null);
  const questionContentRef = useRef<HTMLDivElement>(null);
  const paletteRef         = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showInstructions || showQuestionPaper) return;

    const blockScroll = (e: WheelEvent | TouchEvent) => e.preventDefault();
    const opts = { passive: false } as AddEventListenerOptions;

    // Block on the outer container — catches ALL wheel events inside the test
    const outer = outerRef.current;
    const qc    = questionContentRef.current;
    const pl    = paletteRef.current;

    outer?.addEventListener('wheel',     blockScroll, opts);
    outer?.addEventListener('touchmove', blockScroll, opts);
    qc?.addEventListener('wheel',        blockScroll, opts);
    qc?.addEventListener('touchmove',    blockScroll, opts);
    pl?.addEventListener('wheel',        blockScroll, opts);
    pl?.addEventListener('touchmove',    blockScroll, opts);

    return () => {
      outer?.removeEventListener('wheel',     blockScroll);
      outer?.removeEventListener('touchmove', blockScroll);
      qc?.removeEventListener('wheel',        blockScroll);
      qc?.removeEventListener('touchmove',    blockScroll);
      pl?.removeEventListener('wheel',        blockScroll);
      pl?.removeEventListener('touchmove',    blockScroll);
    };
  }, [showInstructions, showQuestionPaper]);

  // Disable body scroll only when on main test page (not instructions/question paper)
  useEffect(() => {
    if (!showInstructions && !showQuestionPaper) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showInstructions, showQuestionPaper]);

  const handleAnswerSelect = (optionIndex: number) => {
    setTempAnswer(optionIndex);
  };

  const handleSaveAndNext = () => {
    // Save the temp answer to actual answers
    if (tempAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = tempAnswer;
      setAnswers(newAnswers);
    }
    setTempAnswer(null);
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleMarkForReviewAndNext = () => {
    // Save temp answer if selected
    if (tempAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = tempAnswer;
      setAnswers(newAnswers);
    }
    setMarkedForReview(prev => new Set([...prev, currentQuestion]));
    setTempAnswer(null);
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleClearResponse = () => {
    setTempAnswer(null);
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
    // Don't save temp answer when clicking question palette (skip without saving)
    setTempAnswer(null);
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
      case 'not-visited': return 'bg-white border-2 border-gray-400 text-gray-700';
      case 'not-answered': return 'bg-red-500 border-2 border-red-600 text-white';
      case 'answered': return 'bg-green-500 border-2 border-green-600 text-white';
      case 'marked': return 'bg-purple-500 border-2 border-purple-600 text-white';
      case 'marked-answered': return 'bg-purple-500 border-2 border-purple-600 text-white';
      default: return 'bg-white border-2 border-gray-400 text-gray-700';
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

  // Instructions Page — always light/professional, no dark mode (real exam interfaces don't have it)
  if (showInstructions) {
    return (
      <div className="min-h-screen bg-[#f0f2f5]">
        {/* NTA-style top bar */}
        <div className="bg-[#1e3a8a] text-white">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-wide">EXAM PRACTICE PORTAL</h1>
              <p className="text-blue-200 text-xs mt-0.5">{categoryName} — {test.name}</p>
            </div>
            
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Info bar */}
          <div className="bg-[#1e3a8a] text-white rounded-t-lg px-6 py-3 flex items-center justify-between">
            <span className="font-semibold text-sm">General Instructions</span>
            <span className="text-blue-200 text-xs">Read carefully before proceeding</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-b-lg shadow-sm px-8 py-6">
            {/* Marking scheme */}
            <div className="flex gap-4 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-center px-4 py-2 bg-green-100 border border-green-300 rounded">
                <div className="text-2xl font-bold text-green-700">+5</div>
                <div className="text-xs text-green-600 font-medium">Correct Answer</div>
              </div>
              <div className="text-center px-4 py-2 bg-red-100 border border-red-300 rounded">
                <div className="text-2xl font-bold text-red-700">−1</div>
                <div className="text-xs text-red-600 font-medium">Wrong Answer</div>
              </div>
              <div className="text-center px-4 py-2 bg-gray-100 border border-gray-300 rounded">
                <div className="text-2xl font-bold text-gray-600">0</div>
                <div className="text-xs text-gray-500 font-medium">Unattempted</div>
              </div>
              <div className="flex-1 flex items-center pl-4 border-l border-blue-200">
                <p className="text-sm text-blue-800">
                  Total Questions: <strong>{test.questions.length}</strong> &nbsp;|&nbsp;
                  Time Allowed: <strong>{timeLimitMinutes} minutes</strong>
                </p>
              </div>
            </div>

            <ol className="space-y-5 text-sm text-gray-700 leading-relaxed list-decimal list-inside">
              <li>
                <strong className="text-gray-900">Timer:</strong> The countdown timer is shown at the top-right. The exam auto-submits when it reaches zero.
              </li>
              <li>
                <strong className="text-gray-900">Question Palette</strong> on the right shows status via colour codes:
                <div className="mt-3 ml-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { color: 'bg-white border-2 border-gray-400', label: 'NOT VISITED', desc: 'Not yet opened' },
                    { color: 'bg-red-500', label: 'NOT ANSWERED', desc: 'Opened but unanswered' },
                    { color: 'bg-green-500', label: 'ANSWERED', desc: 'Answer saved' },
                    { color: 'bg-purple-500', label: 'MARKED FOR REVIEW', desc: 'Flagged, no answer' },
                    { color: 'bg-purple-500', label: 'ANSWERED & MARKED', desc: 'Answered and flagged' },
                  ].map(({ color, label, desc }) => (
                    <div key={label} className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded">
                      <span className={`w-7 h-7 rounded flex-shrink-0 ${color}`} />
                      <div>
                        <p className="font-semibold text-gray-800 text-xs">{label}</p>
                        <p className="text-gray-500 text-xs">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 ml-4 text-xs font-semibold text-gray-600">Marked-for-review answers ARE evaluated.</p>
              </li>
              <li>
                <strong className="text-gray-900">Navigation:</strong> Use <strong>Save &amp; Next</strong> to save and move forward. Clicking a question number in the palette navigates without saving.
              </li>
              <li>
                <strong className="text-gray-900">Answering:</strong> Click the radio button to select an option. Use <strong>Clear Response</strong> to deselect.
              </li>
              <li>
                <strong className="text-gray-900">Submission:</strong> Click <strong>Submit Test</strong> when done. You will be asked to confirm before final submission.
              </li>
            </ol>

            <div className="mt-8 pt-5 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-500">Please ensure you have read all instructions before starting.</p>
              <button
                onClick={() => {
                  setShowInstructions(false);
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                    setIsFullscreen(true);
                  }
                }}
                className="px-10 py-3 bg-[#16a34a] text-white font-bold text-base hover:bg-[#15803d] transition-colors rounded"
              >
                I AM READY TO BEGIN
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
      <div className={`min-h-screen py-6 px-4 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f5]'
        }`}>
        <div className="max-w-6xl mx-auto">
          <div className=
            {`border-2 p-6 ${isDark ? 'bg-[#2a2a2a] border-[#404040]' : 'bg-white border-[#d1d5db]'
              }`}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-300 dark:border-gray-600">
              <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-[#1e3a8a]'
                }`}>
                QUESTION PAPER - {categoryName.toUpperCase()}
              </h1>
              <button
                onClick={() => setShowQuestionPaper(false)}
                className="px-8 py-2 bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8] transition-colors">
                BACK TO TEST
              </button>
            </div>
            <div className="space-y-6">
              {test.questions.map((question, idx) => (
                <div key={idx} className={`pb-6 border-b ${isDark ? 'border-slate-600' : 'border-gray-300'
                  }`}>
                  <div className="flex items-start gap-4 mb-4">
                    <span className={`font-bold text-lg min-w-[60px] ${isDark ? 'text-blue-400' : 'text-[#1e3a8a]'
                      }`}>Q{idx + 1}.</span>
                    <p className={`font-medium flex-1 ${isDark ? 'text-slate-200' : 'text-gray-800'
                      }`}><RichContent content={question.question} /></p>
                  </div>
                  <div className="ml-16 space-y-2">
                    {question.options.map((option, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-3">
                        <span className={`font-semibold w-8 ${isDark ? 'text-slate-400' : 'text-gray-600'
                          }`}>
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className={`${answers[idx] === optIdx
                          ? 'text-[#16a34a] font-bold'
                          : isDark
                            ? 'text-slate-300'
                            : 'text-gray-700'
                          }`}>
                          <RichContent content={option} />
                        </span>
                        {answers[idx] === optIdx && (
                          <CheckCircle2 className="text-[#16a34a]" size={18} />
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
      <div className={`min-h-screen py-8 px-4 flex items-center justify-center ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f5]'
        }`}>
        <div className={`max-w-2xl w-full border-4 border-red-600 p-10 text-center ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'
          }`}>
          <div className="text-7xl mb-6 text-red-600">⏰</div>
          <h2 className="text-4xl font-bold text-red-600 mb-4 tracking-wide">TIME IS OVER</h2>
          <div className={`text-xl font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
            Your examination time has ended
          </div>
          <p className={`text-lg mb-6 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
            The examination has been automatically submitted.
          </p>
          <div className={`inline-block px-6 py-2 border-2 ${isDark ? 'border-slate-500 text-slate-400' : 'border-gray-400 text-gray-600'
            }`}>
            Please wait while we process your responses...
          </div>
        </div>
      </div>
    );
  }


  const question = test.questions[currentQuestion];

  return (
    <div
      ref={outerRef}
      className="h-screen w-screen overflow-hidden flex flex-col bg-white"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
      onMouseUp={() => { if (window.getSelection()?.toString()) window.getSelection()?.removeAllRanges(); }}
    >
      {/* Testbook Header */}
      <div className="bg-[#00838F] text-white flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-[#00838F] font-bold text-sm">📚</span>
              </div>
              <span className="font-bold text-lg">ExamPortal</span>
            </div>
            <span className="text-sm opacity-90">{categoryName} - {test.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Time Left</span>
              <div className="bg-white/20 px-3 py-1 rounded">
                <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 border border-white/50 rounded text-sm hover:bg-white/10 transition-colors"
            >
              {isFullscreen ? 'Exit Full Screen' : 'Switch Full Screen'}
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1.5 border border-white/50 rounded text-sm hover:bg-white/10 transition-colors"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>
        {/* SECTIONS Tab */}
        <div className="bg-[#006970] px-4 py-1.5 flex items-center gap-4">
          <span className="text-sm">SECTIONS</span>
          <button className="bg-[#00B8D4] px-4 py-1 rounded text-sm font-medium">
            Test
          </button>
        </div>
      </div>

      {/* Main Content - Fixed Height */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Content Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Question Header Row */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 flex-shrink-0">
            <div className="font-semibold text-gray-800">
              Question No. {currentQuestion + 1}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Marks</span>
                <span className="bg-[#00B8D4] text-white px-2 py-0.5 rounded text-xs font-bold">+5</span>
                <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">-1</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <span>Time</span>
                <span className="font-mono">{Math.floor(questionTime / 60).toString().padStart(2, '0')}:{(questionTime % 60).toString().padStart(2, '0')}</span>
              </div>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option>English</option>
              </select>
              <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
                <AlertCircle size={14} />
                Report
              </button>
            </div>
          </div>

          {/* Question Content - Scrollable only via scrollbar drag */}
          <div
            ref={questionContentRef}
            className="flex-1 overflow-y-auto px-6 py-4 realistic-scrollbar"
          >
              <MatchingQuestionDisplay
                  questionText={question.question}
                  isDark={false}
                  className="text-gray-900 mb-6 leading-relaxed"
                />

            {/* Options - Simple Radio Buttons */}
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  className="flex items-center gap-3 p-2 rounded select-none cursor-pointer"
                >
                  <input
                    type="radio"
                    name="answer"
                    checked={tempAnswer === idx || (tempAnswer === null && answers[currentQuestion] === idx)}
                    onChange={() => handleAnswerSelect(idx)}
                    className="w-4 h-4 cursor-pointer accent-[#00B8D4] flex-shrink-0"
                    tabIndex={-1}
                  />
                  <span className="text-gray-900 pointer-events-none select-none"><RichContent content={option} /></span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Navigation Bar - Fixed at Bottom */}
          <div className="border-t border-gray-200 px-4 py-2 flex items-center justify-between bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkForReviewAndNext}
                className="px-4 py-2 bg-[#A9CFF4] text-gray-800 rounded text-sm font-medium hover:bg-[#89BFF4] transition-colors"
              >
                Mark for Review & Next
              </button>
              <button
                onClick={handleClearResponse}
                className="px-4 py-2 bg-[#A9CFF4] text-gray-800 rounded text-sm font-medium hover:bg-[#89BFF4] transition-colors"
              >
                Clear Response
              </button>
            </div>
            <button
              onClick={handleSaveAndNext}
              className="px-4 py-2 bg-[#00B8D4] text-white rounded text-sm font-medium hover:bg-[#00ACC1] transition-colors"
            >
              Save & Next
            </button>
          </div>
        </div>

        {/* Right Sidebar - Light Cyan */}
        <div className="w-72 bg-[#E0F7FA] flex flex-col overflow-hidden flex-shrink-0">
          {/* User Info */}
          <div className="p-4 flex flex-col items-center border-b border-[#B2EBF2]">
            <div className="w-16 h-16 rounded-full bg-[#00B8D4] flex items-center justify-center mb-2">
              <span className="text-white text-2xl">👤</span>
            </div>
            <span className="text-gray-800 font-medium">Mr</span>
          </div>

          {/* Status Legend */}
          <div className="p-3 text-xs flex flex-wrap gap-x-4 gap-y-1 border-b border-[#B2EBF2]">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-gray-700">Answered</span>
              <span className="font-bold ml-1">{answeredCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span className="text-gray-700">Marked</span>
              <span className="font-bold ml-1">{markedCount - markedAndAnsweredCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 border-2 border-gray-500 bg-white"></div>
              <span className="text-gray-700">Not Visited</span>
              <span className="font-bold ml-1">{notVisitedCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-purple-500 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <span className="text-gray-700">Marked and answered</span>
              <span className="font-bold ml-1">{markedAndAnsweredCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-gray-700">Not Answered</span>
              <span className="font-bold ml-1">{notAnsweredCount}</span>
            </div>
          </div>

          {/* Section Header */}
          <div className="px-3 py-2 border-b border-[#B2EBF2]">
            <span className="font-bold text-sm text-gray-800">SECTION : Test</span>
          </div>

          {/* Question Palette */}
          <div
            ref={paletteRef}
            className="flex-1 overflow-y-auto p-3 realistic-scrollbar"
          >
            <div className="grid grid-cols-5 gap-2">
              {test.questions.map((_, idx) => {
                const status = getQuestionStatus(idx);
                const isCurrent = idx === currentQuestion;
                return (
                  <button
                    key={idx}
                    onClick={() => handleQuestionClick(idx)}
                    className={`w-9 h-9 text-xs font-semibold rounded-lg transition-all relative ${isCurrent ? 'ring-2 ring-black ring-offset-1' : ''
                      } ${getStatusColor(status)}`}
                  >
                    {idx + 1}
                    {status === 'marked-answered' && (
                      <div className="absolute bottom-0 right-0 p-0.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Action Buttons */}
          <div className="p-3 border-t border-[#B2EBF2] space-y-2 flex-shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => setShowQuestionPaper(true)}
                className="flex-1 px-3 py-2.5 bg-[#A9CFF4] text-gray-800 rounded text-sm font-medium hover:bg-[#89BFF4] transition-colors"
              >
                Question Paper
              </button>
              <button
                onClick={() => setShowInstructions(true)}
                className="flex-1 px-3 py-2.5 bg-[#A9CFF4] text-gray-800 rounded text-sm font-medium hover:bg-[#89BFF4] transition-colors"
              >
                Instructions
              </button>
            </div>
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="px-6 py-2.5 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <ModalAlert
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        title="Submit Test?"
        message="Are you sure you want to submit the test? You won't be able to change your answers after submission."
        type="warning"
        isDark={isDark}
        onConfirm={() => {
          setShowSubmitConfirm(false);
          // Exit fullscreen if active
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          const performance = evaluateTestPerformance(answers, test.questions);
          const durationSeconds = totalTimeSeconds - timeRemaining;
          onSubmit(answers, performance.correct, test.questions.length, durationSeconds, performance, Array.from(markedForReview));
        }}
        confirmText="Submit"
        cancelText="Cancel"
      />
    </div>
  );
}
