import { ArrowLeft, PlayCircle, BookOpen, FolderOpen, Zap, PlusCircle } from 'lucide-react';
import type { Subject, Test, Chapter } from '../types';

interface SubjectPageProps {
  subject: Subject;
  categoryName: string;
  isDark: boolean;
  onBack: () => void;
  onTestSelect: (subjectId: string, testId: string) => void;
  onChapterSelect?: (chapterId: string) => void;
  onQuickQuiz?: () => void;
  onAddQuestions?: () => void;
}

export function SubjectPage({ subject, categoryName, isDark, onBack, onTestSelect, onChapterSelect, onQuickQuiz, onAddQuestions }: SubjectPageProps) {
  // Calculate total tests from both direct tests and chapter tests
  const directTestsCount = subject.tests.length;
  const chapterTestsCount = subject.chapters?.reduce((sum, ch) => sum + ch.tests.length, 0) || 0;
  const totalTests = directTestsCount + chapterTestsCount;

  // Calculate total questions
  const directQuestions = subject.tests.reduce((sum, test) => sum + test.questions.length, 0);
  const chapterQuestions = subject.chapters?.reduce((sum, ch) =>
    sum + ch.tests.reduce((testSum, test) => testSum + test.questions.length, 0), 0) || 0;
  const totalQuestions = directQuestions + chapterQuestions;

  const hasChapters = subject.chapters && subject.chapters.length > 0;
  const hasDirectTests = subject.tests.length > 0;
  const hasEnoughForQuiz = totalQuestions >= 3;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'}`}>
      <div className="container mx-auto px-4 py-8">
        

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <BookOpen className={isDark ? 'text-blue-400' : 'text-blue-600'} size={40} />
          <div className="flex-1">
            <h1 className={`text-4xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
              {subject.name}
            </h1>
            <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>{categoryName}</p>
          </div>
          {hasEnoughForQuiz && onQuickQuiz && (
            <button
              onClick={onQuickQuiz}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:from-violet-700 hover:to-blue-700 transition-all shadow-md"
            >
              <Zap size={15} /> Quick Quiz
            </button>
          )}
          {onAddQuestions && (
            <button
              onClick={onAddQuestions}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all shadow-md ${
                isDark ? 'bg-emerald-700/80 hover:bg-emerald-600' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <PlusCircle size={15} /> Add Questions
            </button>
          )}
        </div>

        <div className={`rounded-lg shadow-md p-6 mb-6 ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'
          }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hasChapters && (
              <div>
                <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Chapters</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  {subject.chapters!.length} {subject.chapters!.length === 1 ? 'Chapter' : 'Chapters'}
                </p>
              </div>
            )}
            <div>
              <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Total Tests</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {totalTests} {totalTests === 1 ? 'Test' : 'Tests'}
              </p>
            </div>
            <div>
              <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Total Questions</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {totalQuestions} {totalQuestions === 1 ? 'Question' : 'Questions'}
              </p>
            </div>
          </div>
        </div>

        {/* Chapters Section */}
        {hasChapters && (
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
              Chapters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subject.chapters!.map((chapter: Chapter) => {
                const chapterTestCount = chapter.tests.length;
                const chapterQuestionsCount = chapter.tests.reduce((sum, test) => sum + test.questions.length, 0);

                return (
                  <button
                    key={chapter.id}
                    onClick={() => onChapterSelect?.(chapter.id)}
                    className={`rounded-xl shadow-md hover:shadow-lg transition-all p-6 text-left group border-l-4 border-purple-500 ${isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <FolderOpen className={isDark ? 'text-purple-400' : 'text-purple-600'} size={28} />
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${isDark
                          ? 'bg-purple-900/30 text-purple-400'
                          : 'bg-purple-100 text-purple-700'
                          }`}>
                          {chapterTestCount} {chapterTestCount === 1 ? 'Test' : 'Tests'}
                        </span>
                      </div>
                    </div>
                    <h3 className={`text-lg font-semibold transition-colors ${isDark
                      ? 'text-slate-100 group-hover:text-purple-400'
                      : 'text-gray-800 group-hover:text-purple-600'
                      }`}>
                      {chapter.name}
                    </h3>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      {chapterQuestionsCount} questions
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Uncategorized Tests Section */}
        {hasDirectTests && (
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
              {hasChapters ? 'Uncategorized Tests' : 'Available Tests'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subject.tests.map((test: Test) => (
                <button
                  key={test.id}
                  onClick={() => onTestSelect(subject.id, test.id)}
                  className={`rounded-xl shadow-md hover:shadow-lg transition-all p-6 text-left group border-l-4 border-blue-500 ${isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white'
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <PlayCircle className={isDark ? 'text-blue-400' : 'text-blue-600'} size={28} />
                    <span className={`text-xs px-2 py-1 rounded ${isDark
                      ? 'bg-[#1E1E1D] text-blue-400'
                      : 'bg-blue-100 text-blue-700'
                      }`}>
                      {test.questions.length} {test.questions.length === 1 ? 'Question' : 'Questions'}
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold transition-colors ${isDark
                    ? 'text-slate-100 group-hover:text-blue-400'
                    : 'text-gray-800 group-hover:text-blue-600'
                    }`}>
                    {test.name}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasChapters && !hasDirectTests && (
          <div className={`rounded-lg shadow-md p-12 text-center ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'
            }`}>
            <BookOpen className={isDark ? 'text-slate-500' : 'text-gray-400'} size={48} />
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              No content available yet
            </h3>
            <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>
              Chapters and tests will appear here once they are added.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
