import { ArrowLeft, FileDown, PlayCircle, BookOpen, Zap } from 'lucide-react';
import type { ExamCategory, Test, PDF, Subject } from '../types';

interface CategoryPageProps {
  category: ExamCategory;
  isDark: boolean;
  onBack: () => void;
  onSubjectSelect?: (subjectId: string) => void;
  onTestSelect: (testId: string) => void;
  onQuickQuiz?: () => void;
  onNotesClick?: () => void;
}

export function CategoryPage({ category, isDark, onBack, onSubjectSelect, onTestSelect, onQuickQuiz, onNotesClick }: CategoryPageProps) {
  // Check if category has subjects (new structure) or direct tests (old structure)
  const hasSubjects = category.subjects && category.subjects.length > 0;
  const hasTests = category.tests && category.tests.length > 0;

  // Count all questions in this category for the Quick Quiz button
  const totalQuestions = (() => {
    let count = 0;
    category.tests?.forEach(t => { count += t.questions.length; });
    category.subjects?.forEach(sub => {
      sub.tests.forEach(t => { count += t.questions.length; });
      sub.chapters?.forEach(ch => ch.tests.forEach(t => { count += t.questions.length; }));
    });
    return count;
  })();
  const hasEnoughForQuiz = totalQuestions >= 3;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'}`}>
      <div className="container mx-auto px-4 py-8">


        <div className="flex flex-wrap items-center gap-3 mb-8">
          <h1 className={`text-4xl font-bold flex-1 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
            {category.name}
          </h1>
          {hasEnoughForQuiz && onQuickQuiz && (
            <button
              onClick={onQuickQuiz}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:from-violet-700 hover:to-blue-700 transition-all shadow-md"
            >
              <Zap size={15} /> Quick Quiz
            </button>
          )}
        </div>

        {hasSubjects && onSubjectSelect ? (
          // New structure: Show subjects
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className={isDark ? 'text-blue-400' : 'text-blue-600'} size={28} />
              <h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                Select Subject
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.subjects!.map((subject: Subject) => {
                // Calculate totals including chapters
                const directTestCount = subject.tests.length;
                const chapterCount = subject.chapters?.length || 0;
                const chapterTestsCount = subject.chapters?.reduce((acc, ch) => acc + ch.tests.length, 0) || 0;

                const totalTests = directTestCount + chapterTestsCount;

                const directQuestions = subject.tests.reduce((sum, test) => sum + test.questions.length, 0);
                const chapterQuestions = subject.chapters?.reduce((acc, ch) =>
                  acc + ch.tests.reduce((tRes, t) => tRes + t.questions.length, 0), 0) || 0;

                const totalQuestions = directQuestions + chapterQuestions;

                return (
                  <button
                    key={subject.id}
                    onClick={() => onSubjectSelect(subject.id)}
                    className={`rounded-xl shadow-md hover:shadow-lg transition-all p-6 text-left group border-l-4 border-blue-500 ${isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className={isDark ? 'text-blue-400' : 'text-blue-600'} size={24} />
                      <h3 className={`text-xl font-bold transition-colors ${isDark
                        ? 'text-slate-100 group-hover:text-blue-400'
                        : 'text-gray-800 group-hover:text-blue-600'
                        }`}>
                        {subject.name}
                      </h3>
                    </div>

                    {chapterCount > 0 && (
                      <p className={`text-sm mb-1 font-medium ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                        {chapterCount} {chapterCount === 1 ? 'Chapter' : 'Chapters'}
                      </p>
                    )}

                    <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                      {totalTests} {totalTests === 1 ? 'Test' : 'Tests'}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                      {totalQuestions} {totalQuestions === 1 ? 'Question' : 'Questions'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : hasTests ? (
          // Old structure: Show tests directly (backward compatibility)
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <PlayCircle className={isDark ? 'text-blue-400' : 'text-blue-600'} size={28} />
              <h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                Practice Tests
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.tests!.map((test: Test) => (
                <button
                  key={test.id}
                  onClick={() => onTestSelect(test.id)}
                  className={`rounded-lg shadow-md hover:shadow-lg transition-all p-6 text-left group border-l-4 border-blue-500 ${isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white'
                    }`}
                >
                  <h3 className={`text-lg font-semibold mb-2 transition-colors ${isDark
                    ? 'text-slate-100 group-hover:text-blue-400'
                    : 'text-gray-800 group-hover:text-blue-600'
                    }`}>
                    {test.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    {test.questions.length} Questions
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={`rounded-lg shadow-md p-8 text-center ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'
            } text-gray-500`}>
            No tests available yet
          </div>
        )}

        <div>
          <div className="flex items-center gap-3 mb-6">
            <FileDown className={isDark ? 'text-green-400' : 'text-green-600'} size={28} />
            <h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
              Previous Year Questions (PYQs)
            </h2>
          </div>
          {(category.pdfs.length > 0 || onNotesClick) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.pdfs.map((pdf: PDF) => {
                const isClickable = !!pdf.url;
                const CardWrapper = isClickable ? 'a' : 'div';
                const wrapperProps = isClickable ? {
                  href: pdf.url,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: `block rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg hover:border-green-400 transition-all cursor-pointer ${isDark ? 'bg-[#1E1E1D] border-slate-700 hover:bg-slate-800' : 'bg-white hover:bg-green-50'}`
                } : {
                  className: `rounded-lg shadow-md p-6 border-l-4 border-green-500 opacity-70 ${isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white'}`
                };

                return (
                  <CardWrapper
                    key={pdf.id}
                    {...(wrapperProps as any)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                          {pdf.name}
                        </h3>
                        {pdf.year && (
                          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                            Year: {pdf.year}
                          </p>
                        )}
                      </div>
                      {isClickable && (
                        <FileDown className={isDark ? 'text-green-400' : 'text-green-600'} size={20} />
                      )}
                    </div>
                  </CardWrapper>
                );
              })}

              {/* Notes Page Link Card */}
              {onNotesClick && (
                <button
                  onClick={onNotesClick}
                  className={`text-left block rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer ${isDark ? 'bg-[#1E1E1D] border-slate-700 hover:bg-slate-800' : 'bg-white hover:bg-blue-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                        {category.name} English PDF Download
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                        Topic-wise Notes & PDFs
                      </p>
                    </div>
                    <BookOpen className={isDark ? 'text-blue-400' : 'text-blue-600'} size={20} />
                  </div>
                </button>
              )}
            </div>
          ) : (
            <div className={`rounded-lg shadow-md p-8 text-center ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'} text-gray-500`}>
              No PYQs or Notes available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
