import { useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import type { ExamCategory, Test, Question, BookmarkedQuestion, TestResult, TestPerformanceStats } from '../types';
import { storage } from '../utils/storage';
import { TestPage } from './TestPage';
import { ResultsPage } from './ResultsPage';
import { evaluateTestPerformance } from '../utils/scoring';

interface BookmarkedTestPageProps {
  categories: ExamCategory[];
  bookmarks: BookmarkedQuestion[];
  isDark: boolean;
  onBack: () => void;
  onResultSaved: () => void;
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
  const byId = test.questions.find((q) => q.id === b.questionId);
  if (byId) return byId;
  if (b.questionText) {
    return test.questions.find((q) => q.question === b.questionText);
  }
  return undefined;
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

  for (const b of uniqueByQuestion.values()) {
    const category = categories.find((c) => c.id === b.categoryId);
    if (!category) continue;

    const allTests = getAllTests(category);

    // Try the bookmarked test first
    let test = allTests.find((t) => t.id === b.testId);
    let question: Question | undefined;

    if (test) {
      question = findQuestion(test, b);
    }

    // Cross-test fallback: search all tests in category
    if (!question) {
      for (const t of allTests) {
        question = findQuestion(t, b);
        if (question) { test = t; break; }
      }
    }

    if (!test || !question) continue;

    questions.push(question);
    mapping[question.id] = { categoryId: b.categoryId, testId: test.id };
  }

  return { questions, mapping };
}


export function BookmarkedTestPage({ categories, bookmarks, isDark, onBack, onResultSaved }: BookmarkedTestPageProps) {

  const { questions } = useMemo(
    () => resolveBookmarkedQuestions(bookmarks, categories),
    [bookmarks, categories]
  );

  const [submitted, setSubmitted] = useState(false);
  const [lastAnswers, setLastAnswers] = useState<(number | null)[]>([]);
  const [lastScore, setLastScore] = useState(0);
  const [lastTotal, setLastTotal] = useState(0);
  const [lastPerformance, setLastPerformance] = useState<TestPerformanceStats | null>(null);

  if (!bookmarks.length || !questions.length) {
    return (
      <div className={`min-h-screen py-8 px-4 ${
        isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'
      }`}>
        <div className={`max-w-xl mx-auto rounded-xl shadow-lg p-8 text-center ${
          isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'
        }`}>
          <AlertCircle className={isDark ? 'mx-auto mb-4 text-blue-400' : 'mx-auto mb-4 text-blue-500'} size={40} />
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
            No Bookmarked Questions
          </h2>
          <p className={isDark ? 'text-slate-300 mb-6 text-sm' : 'text-gray-600 mb-6 text-sm'}>
            You have not bookmarked any questions yet. After completing a test, you can bookmark
            questions from the results page and they will appear here.
          </p>
          
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
    answers: (number | null)[],
    score: number,
    total: number,
    durationSeconds?: number,
    performance?: TestPerformanceStats
  ) => {
    const resolvedPerformance = performance ?? evaluateTestPerformance(answers, syntheticTest.questions);
    setSubmitted(true);
    setLastAnswers(answers);
    setLastScore(score);
    setLastTotal(total);
    setLastPerformance(resolvedPerformance);

    const result: TestResult = {
      testId: syntheticTest.id,
      categoryId: 'bookmarked',
      answers,
      score,
      total,
      timestamp: Date.now(),
      mode: 'normal',
      durationSeconds,
      marks: resolvedPerformance.marks,
      totalMarks: resolvedPerformance.totalMarks,
      incorrectCount: resolvedPerformance.incorrect,
      unattemptedCount: resolvedPerformance.unattempted
    };

    storage.saveResult(result);
    onResultSaved();
  };

  const handleRetake = () => {
    setSubmitted(false);
    setLastAnswers([]);
    setLastScore(0);
    setLastTotal(0);
    setLastPerformance(null);
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
      performance={lastPerformance ?? undefined}
      bookmarks={bookmarks}
      isDark={isDark}
      onBack={handleRetake}
      onHome={onBack}
      onToggleBookmark={() => {}}
    />
  );
}
