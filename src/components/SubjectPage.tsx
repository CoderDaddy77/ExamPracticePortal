import { ArrowLeft, PlayCircle, BookOpen } from 'lucide-react';
import type { Subject, Test } from '../types';

interface SubjectPageProps {
  subject: Subject;
  categoryName: string;
  isDark: boolean;
  onBack: () => void;
  onTestSelect: (subjectId: string, testId: string) => void;
}

export function SubjectPage({ subject, categoryName, isDark, onBack, onTestSelect }: SubjectPageProps) {
  const totalQuestions = subject.tests.reduce((sum, test) => sum + test.questions.length, 0);

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
          Back to {categoryName}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <BookOpen className={isDark ? 'text-blue-400' : 'text-blue-600'} size={40} />
          <div>
            <h1 className={`text-4xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
              {subject.name}
            </h1>
            <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>{categoryName}</p>
          </div>
        </div>

        <div className={`rounded-lg shadow-md p-6 mb-6 ${
          isDark ? 'bg-[#212226] border border-slate-700' : 'bg-white'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Total Tests</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {subject.tests.length} {subject.tests.length === 1 ? 'Test' : 'Tests'}
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

        {subject.tests.length > 0 ? (
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
              Available Tests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subject.tests.map((test: Test) => (
                <button
                  key={test.id}
                  onClick={() => onTestSelect(subject.id, test.id)}
                  className={`rounded-xl shadow-md hover:shadow-lg transition-all p-6 text-left group border-l-4 border-blue-500 ${
                    isDark ? 'bg-[#212226] border-slate-700' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <PlayCircle className={isDark ? 'text-blue-400' : 'text-blue-600'} size={28} />
                    <span className={`text-xs px-2 py-1 rounded ${
                      isDark
                        ? 'bg-[#212226] text-blue-400'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {test.questions.length} {test.questions.length === 1 ? 'Question' : 'Questions'}
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold transition-colors ${
                    isDark
                      ? 'text-slate-100 group-hover:text-blue-400'
                      : 'text-gray-800 group-hover:text-blue-600'
                  }`}>
                    {test.name}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={`rounded-lg shadow-md p-12 text-center ${
            isDark ? 'bg-[#212226] border border-slate-700' : 'bg-white'
          }`}>
            <BookOpen className={isDark ? 'text-slate-500' : 'text-gray-400'} size={48} />
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              No tests available yet
            </h3>
            <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>
              Tests will appear here once they are added.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

