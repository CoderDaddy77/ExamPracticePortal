import { PlayCircle, BookOpen, FolderOpen, Zap, PlusCircle } from 'lucide-react';
import type { Chapter, Test } from '../types';


interface ChapterPageProps {
    chapter: Chapter;
    subjectName: string;
    categoryName: string;
    isDark: boolean;
    onBack: () => void;
    onTestSelect: (testId: string) => void;
    onStudyNotesSelect?: () => void;
    onQuickQuiz?: () => void;
    onAddQuestions?: () => void;
}

export function ChapterPage({ chapter, subjectName, categoryName, isDark, onBack, onTestSelect, onStudyNotesSelect, onQuickQuiz, onAddQuestions }: ChapterPageProps) {
    const totalQuestions = chapter.tests.reduce((sum, test) => sum + test.questions.length, 0);
    const hasEnoughForQuiz = totalQuestions >= 3;
    const hasNotes = !!(chapter.notes && (
        (chapter.notes.sections && chapter.notes.sections.length > 0) ||
        (chapter.notes.cheatSheets && chapter.notes.cheatSheets.length > 0)
    ));

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'}`}>
            <div className="container mx-auto px-4 py-8">

                <div className="flex items-center gap-3 mb-4">
                    <FolderOpen className={isDark ? 'text-blue-400' : 'text-blue-600'} size={40} />
                    <div>
                        <h1 className={`text-4xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                            {chapter.name}
                        </h1>
                        <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>{subjectName} • {categoryName}</p>
                    </div>
                </div>

                {/* Stats + action buttons */}
                <div className={`rounded-xl shadow-md p-6 mb-6 ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="grid grid-cols-2 gap-4 flex-1">
                            <div>
                                <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Total Tests</p>
                                <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                    {chapter.tests.length} {chapter.tests.length === 1 ? 'Test' : 'Tests'}
                                </p>
                            </div>
                            <div>
                                <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Total Questions</p>
                                <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                    {totalQuestions} {totalQuestions === 1 ? 'Question' : 'Questions'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 flex-shrink-0">
                            {/* Study Chapter Notes shortcut */}
                            {hasNotes && onStudyNotesSelect && (
                                <button
                                    onClick={onStudyNotesSelect}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg ${isDark
                                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600'
                                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700'
                                    }`}
                                >
                                    <BookOpen size={16} />
                                    Study Chapter Notes
                                </button>
                            )}

                            {/* Quick Quiz CTA */}
                            {hasEnoughForQuiz && onQuickQuiz && (
                                <button
                                    onClick={onQuickQuiz}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg ${isDark
                                        ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500'
                                        : 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700'
                                    }`}
                                >
                                    <Zap size={16} />
                                    Quick Quiz
                                </button>
                            )}

                            {/* Add Questions shortcut */}
                            {onAddQuestions && (
                                <button
                                    onClick={onAddQuestions}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg ${isDark
                                        ? 'bg-emerald-700/80 text-white hover:bg-emerald-600'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    }`}
                                >
                                    <PlusCircle size={16} />
                                    Add Questions
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {chapter.tests.length > 0 ? (
                    <div>
                        <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                            Available Tests
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {chapter.tests.map((test: Test) => (
                                <button
                                    key={test.id}
                                    onClick={() => onTestSelect(test.id)}
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
                ) : (
                    <div className={`rounded-lg shadow-md p-12 text-center ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'
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
