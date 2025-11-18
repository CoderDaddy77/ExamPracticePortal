import { ArrowLeft, FileDown, PlayCircle, BookOpen } from 'lucide-react';
import type { ExamCategory, Test, PDF, Subject } from '../types';

interface CategoryPageProps {
  category: ExamCategory;
  isDark: boolean;
  onBack: () => void;
  onSubjectSelect?: (subjectId: string) => void;
  onTestSelect: (testId: string) => void;
}

export function CategoryPage({ category, isDark, onBack, onSubjectSelect, onTestSelect }: CategoryPageProps) {
  // Check if category has subjects (new structure) or direct tests (old structure)
  const hasSubjects = category.subjects && category.subjects.length > 0;
  const hasTests = category.tests && category.tests.length > 0;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#18191D]' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 mb-6 px-4 py-2 text-sm rounded-lg border transition-colors ${
            isDark
              ? 'border-slate-700 bg-[#212226] text-slate-200 hover:bg-slate-700/80'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <h1 className={`text-4xl font-bold mb-8 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
          {category.name}
        </h1>

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
                const totalQuestions = subject.tests.reduce((sum, test) => sum + test.questions.length, 0);
                return (
                  <button
                    key={subject.id}
                    onClick={() => onSubjectSelect(subject.id)}
                    className={`rounded-xl shadow-md hover:shadow-lg transition-all p-6 text-left group border-l-4 border-blue-500 ${
                      isDark ? 'bg-[#212226] border-slate-700' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className={isDark ? 'text-blue-400' : 'text-blue-600'} size={24} />
                      <h3 className={`text-xl font-bold transition-colors ${
                        isDark
                          ? 'text-slate-100 group-hover:text-blue-400'
                          : 'text-gray-800 group-hover:text-blue-600'
                      }`}>
                        {subject.name}
                      </h3>
                    </div>
                    <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                      {subject.tests.length} {subject.tests.length === 1 ? 'Test' : 'Tests'}
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
                  className={`rounded-lg shadow-md hover:shadow-lg transition-all p-6 text-left group border-l-4 border-blue-500 ${
                    isDark ? 'bg-[#212226] border-slate-700' : 'bg-white'
                  }`}
                >
                  <h3 className={`text-lg font-semibold mb-2 transition-colors ${
                    isDark
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
          <div className={`rounded-lg shadow-md p-8 text-center ${
            isDark ? 'bg-[#212226] border border-slate-700' : 'bg-white'
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
          {category.pdfs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.pdfs.map((pdf: PDF) => (
                <div
                  key={pdf.id}
                  className={`rounded-lg shadow-md p-6 border-l-4 border-green-500 ${
                    isDark ? 'bg-[#212226] border-slate-700' : 'bg-white'
                  }`}
                >
                  <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                    {pdf.name}
                  </h3>
                  {pdf.year && (
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                      Year: {pdf.year}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={`rounded-lg shadow-md p-8 text-center ${
              isDark ? 'bg-[#212226] border border-slate-700' : 'bg-white'
            } text-gray-500`}>
              No PYQs available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
