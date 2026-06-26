import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ArrowLeft, CheckCircle2, XCircle, ChevronRight,
  Zap, Trophy, RotateCcw, Home, Shuffle, Clock, Timer
} from 'lucide-react';
import type { ExamCategory, Question } from '../types';
import { RichContent } from './RichContent';

interface QuickQuizPageProps {
  categories?: ExamCategory[];        // for GK home mode
  questionPool?: Question[];          // for chapter/subject mode (direct pool)
  contextLabel?: string;              // e.g. "Physics · Kinematics" or "General Knowledge"
  isDark: boolean;
  onBack: () => void;
  onHome: () => void;
}

interface QuizQuestion extends Question {
  sourceName?: string;
}

const GK_CATEGORY_IDS = ['general-knowledge', 'gk', 'general_knowledge', 'generalknowledge'];

function isGKCategory(cat: { id: string; name: string }): boolean {
  const idLower = cat.id.toLowerCase();
  const nameLower = cat.name.toLowerCase();
  return (
    GK_CATEGORY_IDS.some((k) => idLower.includes(k)) ||
    nameLower.includes('general knowledge') ||
    nameLower.includes('general gk') ||
    nameLower === 'gk'
  );
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUIZ_SIZE = 10;

/** Build the complete pool of questions from all sources (no slicing). */
function buildFullPool(
  categories: ExamCategory[] | undefined,
  questionPool: Question[] | undefined,
): QuizQuestion[] {
  if (questionPool && questionPool.length > 0) return questionPool.map((q) => ({ ...q }));
  if (!categories) return [];
  const pool: QuizQuestion[] = [];
  categories.forEach((cat) => {
    if (!isGKCategory(cat)) return;
    const addTest = (questions: Question[], sourceName: string) =>
      questions.forEach((q) => pool.push({ ...q, sourceName }));
    cat.tests?.forEach((t) => addTest(t.questions, t.name));
    cat.subjects?.forEach((sub) => {
      sub.tests.forEach((t) => addTest(t.questions, t.name));
      sub.chapters?.forEach((ch) => ch.tests.forEach((t) => addTest(t.questions, t.name)));
    });
  });
  return pool;
}

// ── localStorage helpers ──────────────────────────────────────────────────────

function lsKey(prefix: string, label: string) {
  return `qqz_${prefix}__${label.replace(/\s+/g, '_')}`;
}

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveSet(key: string, ids: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...ids]));
  } catch { /* storage full – ignore */ }
}

/**
 * Persist the outcome of a completed (or abandoned) quiz.
 *   - Correctly answered → added to seenCorrect, removed from incorrect.
 *   - Incorrectly answered → added to incorrect, removed from seenCorrect.
 *   - Unanswered (null)   → left unchanged.
 */
function saveQuizResults(
  label: string,
  questions: QuizQuestion[],
  answers: (number | null)[],
) {
  const correctKey   = lsKey('correct',   label);
  const incorrectKey = lsKey('incorrect', label);
  const seenCorrect  = loadSet(correctKey);
  const incorrect    = loadSet(incorrectKey);

  questions.forEach((q, i) => {
    const ans = answers[i];
    if (ans === null) return; // unanswered – leave as-is
    if (ans === q.correctAnswer) {
      seenCorrect.add(q.id);
      incorrect.delete(q.id);
    } else {
      incorrect.add(q.id);
      seenCorrect.delete(q.id);
    }
  });

  saveSet(correctKey,   seenCorrect);
  saveSet(incorrectKey, incorrect);
}

/**
 * Pick `count` questions using a smart no-repeat + incorrect-priority strategy:
 *   1. Eligible pool = fullPool minus seenCorrect  (incorrect ones stay eligible).
 *   2. If eligible < count the seenCorrect cycle resets (NOT the incorrect set).
 *   3. Within eligible: incorrect questions are shuffled to the FRONT so the
 *      user sees their weak spots before brand-new questions.
 */
function pickNoRepeat(
  fullPool: QuizQuestion[],
  contextLabel: string,
  count: number,
): QuizQuestion[] {
  if (fullPool.length === 0) return [];
  count = Math.min(count, fullPool.length);

  const correctKey   = lsKey('correct',   contextLabel);
  const incorrectKey = lsKey('incorrect', contextLabel);
  let seenCorrect    = loadSet(correctKey);
  const incorrect    = loadSet(incorrectKey);

  // Eligible = not yet answered correctly this cycle
  let eligible = fullPool.filter((q) => !seenCorrect.has(q.id));

  // Cycle exhausted? Reset seenCorrect but KEEP the incorrect set intact
  if (eligible.length < count) {
    seenCorrect = new Set();
    saveSet(correctKey, seenCorrect);
    eligible = [...fullPool];
  }

  // Split eligible: previously-wrong ones first, then unseen/new ones
  const prioritized = shuffleArray(eligible.filter((q) =>  incorrect.has(q.id)));
  const fresh       = shuffleArray(eligible.filter((q) => !incorrect.has(q.id)));

  return [...prioritized, ...fresh].slice(0, count);
}

export function QuickQuizPage({
  categories,
  questionPool,
  contextLabel = 'General Knowledge',
  isDark,
  onBack,
  onHome,
}: QuickQuizPageProps) {
  // Build the full pool once (stable reference across renders)
  const fullPool = useCallback(
    () => buildFullPool(categories, questionPool),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const buildQuestions = useCallback(
    () => pickNoRepeat(fullPool(), contextLabel, QUIZ_SIZE),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [questions, setQuestions] = useState<QuizQuestion[]>(() => buildQuestions());
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ_SIZE).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const [timerMode, setTimerMode] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const noQuestions = questions.length === 0;

  const score = answers.filter((a, i) => a !== null && a === questions[i]?.correctAnswer).length;

  const revealedSectionRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef   = useRef<HTMLDivElement>(null);

  // Scroll so the restart button has breathing room below it
  useEffect(() => {
    if (revealed && bottomAnchorRef.current) {
      bottomAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [revealed]);

  const handleTimeout = useCallback(() => {
    if (revealed) return;
    setSelected(null);
    setRevealed(true);
  }, [revealed]);

  useEffect(() => {
    if (timerMode !== null && quizStarted && !revealed) {
      setTimeLeft(timerMode);
    }
  }, [current, timerMode, quizStarted, revealed]);

  useEffect(() => {
    if (!quizStarted || revealed || timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, revealed, timeLeft, handleTimeout]);

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (current + 1 >= questions.length) {
      // Quiz complete – persist results before showing the result screen
      saveQuizResults(contextLabel, questions, answers);
      setShowResult(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const handleRestart = () => {
    // Save any results from the current session (handles mid-quiz restarts too)
    saveQuizResults(contextLabel, questions, answers);
    const newQs = buildQuestions();
    setQuestions(newQs);
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(QUIZ_SIZE).fill(null));
    setShowResult(false);
    setRevealed(false);
    setQuizStarted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bg = isDark ? 'bg-[#1F1F1E]' : 'bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-50';
  const card = isDark
    ? 'bg-[#1E1E1D] border border-slate-700'
    : 'bg-white border border-gray-100 shadow-lg';
  const text = isDark ? 'text-slate-100' : 'text-gray-900';
  const sub = isDark ? 'text-slate-400' : 'text-gray-500';

  // ── No questions found ─────────────────────────────────────────────────────
  if (noQuestions) {
    return (
      <div className={`min-h-screen ${bg} py-10 px-4`}>
        <div className="max-w-xl mx-auto">
          
          <div className={`rounded-2xl p-10 text-center ${card}`}>
            <div className="text-5xl mb-4">📚</div>
            <h2 className={`text-xl font-bold mb-3 ${text}`}>No Questions Found</h2>
            <p className={`text-sm ${sub}`}>
              Add some questions to this section via the Admin Panel to start the quiz.
            </p>
            <button onClick={onHome} className="mt-6 px-6 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors">
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Start screen ───────────────────────────────────────────────────────────
  if (!quizStarted) {
    return (
      <div className={`min-h-screen ${bg} py-10 px-4 flex flex-col items-center justify-center`}>
        <div className="max-w-xl w-full">
          
          <div className={`rounded-2xl p-10 text-center ${card}`}>
            <div className="text-5xl mb-4">⏱️</div>
            <h2 className={`text-2xl font-bold mb-2 ${text}`}>Quick Quiz Setup</h2>
            <p className={`text-sm mb-8 ${sub}`}>
              Select a timer mode for your {contextLabel} practice.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Off', value: null },
                { label: '5 Seconds', value: 5 },
                { label: '10 Seconds', value: 10 }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setTimerMode(opt.value)}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold flex flex-col items-center justify-center gap-2 ${
                    timerMode === opt.value
                      ? isDark ? 'border-violet-500 bg-violet-900/30 text-violet-300' : 'border-violet-500 bg-violet-50 text-violet-700'
                      : isDark ? 'border-slate-700 hover:border-slate-500 text-slate-300' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  {opt.value ? <Clock size={24} /> : <div className="text-2xl">🐢</div>}
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setQuizStarted(true)}
              className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-violet-700 hover:to-blue-700 transition-all shadow-lg"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Results screen ─────────────────────────────────────────────────────────
  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : pct >= 40 ? '💪' : '📖';
    const label = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good Job!' : pct >= 40 ? 'Keep Going!' : 'Keep Practising!';
    const accentBg = pct >= 80
      ? isDark ? 'bg-emerald-900/30 border-emerald-700/50' : 'bg-emerald-50 border-emerald-200'
      : pct >= 60
        ? isDark ? 'bg-blue-900/30 border-blue-700/50' : 'bg-blue-50 border-blue-200'
        : isDark ? 'bg-orange-900/30 border-orange-700/50' : 'bg-orange-50 border-orange-200';
    const accentText = pct >= 80
      ? isDark ? 'text-emerald-400' : 'text-emerald-600'
      : pct >= 60
        ? isDark ? 'text-blue-400' : 'text-blue-600'
        : isDark ? 'text-orange-400' : 'text-orange-600';

    return (
      <div className={`min-h-screen ${bg} py-10 px-4`}>
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
            <span className={`text-xs font-semibold uppercase tracking-widest ${sub}`}>Practice Portal's Quiz · {contextLabel}</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
          </div>

          <div className={`rounded-2xl p-8 text-center ${card} mb-6`}>
            <div className="text-6xl mb-3">{emoji}</div>
            <h2 className={`text-2xl font-bold mb-1 ${text}`}>{label}</h2>
            <p className={`text-sm ${sub} mb-6`}>You completed the {contextLabel} Quick Quiz</p>

            <div className={`rounded-2xl p-6 border mb-6 ${accentBg}`}>
              <div className={`text-5xl font-black mb-1 ${accentText}`}>{pct}%</div>
              <p className={`text-sm font-semibold ${accentText}`}>
                {score} / {questions.length} correct
              </p>
            </div>

            {/* Per-question review */}
            <div className="text-left space-y-2 mb-6">
              {questions.map((q, i) => {
                const ans = answers[i];
                const correct = ans === q.correctAnswer;
                return (
                  <div
                    key={q.id + i}
                    className={`rounded-xl px-4 py-3 border text-sm flex items-start gap-3 ${
                      correct
                        ? isDark ? 'bg-emerald-900/20 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200'
                        : ans === null
                          ? isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-gray-50 border-gray-200'
                          : isDark ? 'bg-red-900/20 border-red-800/40' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    {correct
                      ? <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      : ans === null
                        ? <span className={`text-xs font-bold flex-shrink-0 mt-0.5 ${sub}`}>–</span>
                        : <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                    }
                    <div className="min-w-0">
                      <p className={`font-medium leading-snug line-clamp-2 ${text}`}>
                        Q{i + 1}. <RichContent content={q.question} />
                      </p>
                      {!correct && ans !== null && (
                        <p className={`text-xs mt-1 ${sub}`}>
                          ✓ {q.options[q.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onHome}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition-colors ${isDark ? 'border-slate-700 bg-[#1E1E1D] text-slate-200 hover:bg-slate-700' : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                <Home size={16} /> Home
              </button>
              <button
                onClick={handleRestart}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:bg-violet-700 transition-colors"
              >
                <Shuffle size={16} /> New Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz screen ────────────────────────────────────────────────────────────
  const q = questions[current];
  const progress = ((current + (revealed ? 1 : 0)) / questions.length) * 100;

  return (
    <div className={`min-h-screen ${bg}`}>
      {/* Top bar */}
      <div className={`sticky top-0 z-10 border-b ${isDark ? 'bg-[#1E1E1D]/90 backdrop-blur border-slate-700/80' : 'bg-white/90 backdrop-blur border-gray-100'}`}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-semibold truncate ${sub}`}>
                <Zap size={11} className="inline text-violet-500 mr-1" />
                Practice Portal's Quiz · {contextLabel}
              </span>
              <span className={`text-xs font-bold flex-shrink-0 ml-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                {current + 1} / {questions.length}
              </span>
            </div>
            <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Timer display */}
        {timerMode !== null && !revealed && timeLeft !== null && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-bold flex items-center gap-1.5 ${timeLeft <= 3 ? 'text-red-500' : isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                <Timer size={16} /> {timeLeft}s remaining
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}>
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${timeLeft <= 3 ? 'bg-red-500' : 'bg-violet-500'}`}
                style={{ width: `${(timeLeft / timerMode) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question card */}
        <div className={`rounded-2xl p-6 mb-5 ${card}`}>
          <p className={`text-xs font-medium uppercase tracking-wide mb-3 ${sub}`}>
            Question {current + 1} of {questions.length}
          </p>
          <h2 className={`text-lg font-semibold leading-relaxed ${text}`}>
            <RichContent content={q.question} />
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.correctAnswer;
            const isSelected = selected === idx;

            let optStyle = '';
            if (!revealed) {
              optStyle = isDark
                ? 'border-slate-700 bg-[#1E1E1D] hover:border-violet-500/70 hover:bg-violet-900/20 cursor-pointer'
                : 'border-gray-200 bg-white hover:border-violet-400 hover:bg-violet-50 cursor-pointer';
            } else if (isCorrect) {
              if (selected !== null) {
                optStyle = isDark
                  ? 'border-emerald-600 bg-emerald-900/30'
                  : 'border-emerald-500 bg-emerald-50';
              } else {
                optStyle = isDark
                  ? 'border-red-600 bg-red-900/30'
                  : 'border-red-400 bg-red-50';
              }
            } else if (isSelected && !isCorrect) {
              optStyle = isDark
                ? 'border-red-600 bg-red-900/30'
                : 'border-red-400 bg-red-50';
            } else {
              optStyle = isDark ? 'border-slate-700 bg-[#1E1E1D] opacity-50' : 'border-gray-200 bg-white opacity-50';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={revealed}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${optStyle}`}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                  revealed && isCorrect
                    ? selected !== null
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-red-500 bg-red-500 text-white'
                    : revealed && isSelected && !isCorrect
                      ? 'border-red-500 bg-red-500 text-white'
                      : isDark
                        ? 'border-slate-600 text-slate-300'
                        : 'border-gray-300 text-gray-600'
                }`}>
                  {revealed && isCorrect
                    ? <CheckCircle2 size={16} />
                    : revealed && isSelected && !isCorrect
                      ? <XCircle size={16} />
                      : String.fromCharCode(65 + idx)
                  }
                </div>
                <span className={`text-sm font-medium ${text}`}>
                  <RichContent content={opt} />
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation + Next */}
        {revealed && (
          <div ref={revealedSectionRef} className="space-y-4">
            {q.explanation && (
              <div className={`rounded-xl p-4 border text-sm ${isDark ? 'bg-blue-900/20 border-blue-800/40 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                <p className="font-semibold mb-1">💡 Explanation</p>
                <RichContent content={q.explanation} />
              </div>
            )}
            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:from-violet-700 hover:to-blue-700 transition-all shadow-lg"
            >
              {current + 1 >= questions.length
                ? <><Trophy size={18} /> See Results</>
                : <><ChevronRight size={18} /> Next Question</>
              }
            </button>
            <button
              onClick={handleRestart}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm border transition-colors ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
            >
              <RotateCcw size={14} /> Restart with new questions
            </button>
            {/* Anchor so scroll always leaves space below the restart button */}
            <div ref={bottomAnchorRef} className="h-2" />
          </div>
        )}

        {!revealed && (
          <p className={`text-center text-xs ${sub}`}>
            Pick an option to reveal the answer
          </p>
        )}
      </div>
    </div>
  );
}
