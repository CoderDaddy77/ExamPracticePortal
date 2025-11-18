import { useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import type { ExamCategory, Test, Question, BookmarkedQuestion, TestResult } from '../types';
import { storage } from '../utils/storage';
import { TestPage } from './TestPage';
import { ResultsPage } from './ResultsPage';

interface BookmarkedTestPageProps {
  categories: ExamCategory[];
  isDark: boolean;
  onBack: () => void;
  onResultSaved: () => void;
}

function resolveBookmarkedQuestions(
  bookmarks: BookmarkedQuestion[],
  categories: ExamCategory[]
): { questions: Question[]; mapping: { [questionId: string]: { categoryId: string; testId: string } } } {
  const mapping: { [questionId: string]: { categoryId: string; testId: string } } = {};
  const questions: Question[] = [];

  const uniqueByQuestion = new Map<string, BookmarkedQuestion>();
  bookmarks.forEach((b) => {
    if (!uniqueByQuestion.has(b.questionId)) {
      uniqueByQuestion.set(b.questionId, b);
    }
  });

  for (const bookmark of uniqueByQuestion.values()) {
    const category = categories.find((c) => c.id === bookmark.categoryId);
    if (!category) continue;

    const allTests: Test[] = [
      ...(category.tests || []),
      ...(category.subjects?.flatMap((s) => s.tests) || [])
    ];

    const test = allTests.find((t) => t.id === bookmark.testId);
    if (!test) continue;

    const question = test.questions.find((q) => q.id === bookmark.questionId);
    if (!question) continue;

    questions.push(question);
    mapping[question.id] = { categoryId: bookmark.categoryId, testId: bookmark.testId };
  }

  return { questions, mapping };
}

export function BookmarkedTestPage({ categories, isDark, onBack, onResultSaved }: BookmarkedTestPageProps) {
  const bookmarks = storage.getBookmarks();

  const { questions } = useMemo(
    () => resolveBookmarkedQuestions(bookmarks, categories),
    [bookmarks, categories]
  );

  const [submitted, setSubmitted] = useState(false);
  const [lastAnswers, setLastAnswers] = useState<number[]>([]);
  const [lastScore, setLastScore] = useState(0);
  const [lastTotal, setLastTotal] = useState(0);

  if (!bookmarks.length || !questions.length) {
    return (
      <div className={`min-h-screen py-8 px-4 ${
        isDark ? 'bg-[#18191D]' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
      }`}>
        <div className={`max-w-xl mx-auto rounded-xl shadow-lg p-8 text-center ${
          isDark ? 'bg-[#212226] border border-slate-700' : 'bg-white'
        }`}>
          <AlertCircle className={isDark ? 'mx-auto mb-4 text-blue-400' : 'mx-auto mb-4 text-blue-500'} size={40} />
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
            No Bookmarked Questions
          </h2>
          <p className={isDark ? 'text-slate-300 mb-6 text-sm' : 'text-gray-600 mb-6 text-sm'}>
            You have not bookmarked any questions yet. After completing a test, you can bookmark
            questions from the results page and they will appear here.
          </p>
          <button
            onClick={onBack}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-colors ${
              isDark
                ? 'border-slate-700 bg-[#18191D] text-slate-200 hover:bg-slate-700/60'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const syntheticTest: Test = {
    id: 'bookmarked-questions',
    name: 'Bookmarked Questions Practice',
    questions
  };

  const handleSubmit = (
    answers: number[],
    score: number,
    total: number,
    durationSeconds?: number
  ) => {
    setSubmitted(true);
    setLastAnswers(answers);
    setLastScore(score);
    setLastTotal(total);

    const result: TestResult = {
      testId: syntheticTest.id,
      categoryId: 'bookmarked',
      answers,
      score,
      total,
      timestamp: Date.now(),
      mode: 'normal',
      durationSeconds
    };

    storage.saveResult(result);
    onResultSaved();
  };

  const handleRetake = () => {
    setSubmitted(false);
    setLastAnswers([]);
    setLastScore(0);
    setLastTotal(0);
  };

  if (!submitted) {
    return (
      <TestPage
        test={syntheticTest}
        categoryId="bookmarked"
        categoryName="Bookmarked Questions"
        isDark={isDark}
        onBack={onBack}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <ResultsPage
      test={syntheticTest}
      categoryName="Bookmarked Questions"
      categoryId="bookmarked"
      answers={lastAnswers}
      score={lastScore}
      total={lastTotal}
      bookmarks={bookmarks}
      isDark={isDark}
      onBack={handleRetake}
      onHome={onBack}
      onToggleBookmark={() => {}}
    />
  );
}
